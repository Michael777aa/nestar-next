import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { PropertyCard } from './PropertyCard';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Rent } from '../../types/property/property';
import { AgentPropertiesInquiry } from '../../types/property/property.input';
import { T } from '../../types/common';
import { AvailabilityStatus } from '../../enums/property.enum';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { UPDATE_RENT } from '../../../apollo/user/mutation';
import { GET_AGENT_PROPERTIES } from '../../../apollo/user/query';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';

const MyProperties: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const [searchFilter, setSearchFilter] = useState<AgentPropertiesInquiry>(initialInput);
	const [agentProperties, setAgentProperties] = useState<Rent[]>([]);
	const [total, setTotal] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** APOLLO REQUESTS **/

	const [updateProperty] = useMutation(UPDATE_RENT);

	const {
		loading: getAgentPropertiesLoading,
		data: getAgentPropertiesData,
		error: getAgentPropertiesError,
		refetch: getAgentPropertiesRefetch,
	} = useQuery(GET_AGENT_PROPERTIES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentProperties(data?.getAgentProperties?.list);
			setTotal(data?.getAgentProperties?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const changeStatusHandler = (value: AvailabilityStatus) => {
		setSearchFilter({ ...searchFilter, search: { availabilityStatus: value } });
	};

	const deletePropertyHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to delete this sport complex?')) {
				await updateProperty({ variables: { input: { _id: id, availabilityStatus: AvailabilityStatus.DELETE } } });
			}
			await getAgentPropertiesRefetch({ input: searchFilter });
		} catch (err: any) {
			sweetErrorHandling(err);
		}
	};

	const updatePropertyHandler = async (status: string, id: string) => {
		try {
			if (await sweetConfirmAlert(`Are you sure to change ${status} status?`)) {
				await updateProperty({ variables: { input: { _id: id, availabilityStatus: status } } });
			}
			await getAgentPropertiesRefetch({ input: searchFilter });
		} catch (err: any) {
			sweetErrorHandling(err);
		}
	};

	if (user?.memberType !== 'AGENT') {
		router.back();
	}

	if (device === 'mobile') {
		return <div>PlaySpot Sport facilities MOBILE</div>;
	} else {
		return (
			<div id="my-property-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Facilities</Typography>
						<Typography className="sub-title">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="property-list-box">
					<Stack className="tab-name-box">
						<Typography
							onClick={() => changeStatusHandler(AvailabilityStatus.AVAILABLE)}
							className={
								searchFilter.search.availabilityStatus === AvailabilityStatus.AVAILABLE ? 'active-tab-name' : 'tab-name'
							}
						>
							AVAILABLE
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(AvailabilityStatus.OCUPPIED)}
							className={
								searchFilter.search.availabilityStatus === AvailabilityStatus.OCUPPIED ? 'active-tab-name' : 'tab-name'
							}
						>
							OCUPPIED
						</Typography>
					</Stack>
					<Stack className="list-box">
						<Stack className="listing-title-box">
							<Typography className="title-text">Listing title</Typography>
							<Typography className="title-text">Date Published</Typography>
							<Typography className="title-text">Status</Typography>
							<Typography className="title-text">View</Typography>
							{searchFilter.search.availabilityStatus === AvailabilityStatus.AVAILABLE && (
								<Typography className="title-text">Action</Typography>
							)}
						</Stack>

						{agentProperties?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Property found!</p>
							</div>
						) : (
							agentProperties.map((property: Rent) => {
								return (
									<PropertyCard
										property={property}
										deletePropertyHandler={deletePropertyHandler}
										updatePropertyHandler={updatePropertyHandler}
									/>
								);
							})
						)}

						{agentProperties.length !== 0 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box">
									<Pagination
										count={Math.ceil(total / searchFilter.limit)}
										page={searchFilter.page}
										shape="circular"
										color="primary"
										onChange={paginationHandler}
									/>
								</Stack>
								<Stack className="total-result">
									<Typography>{total} Facilities available</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

MyProperties.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			availabilityStatus: AvailabilityStatus.AVAILABLE,
		},
	},
};

export default MyProperties;
