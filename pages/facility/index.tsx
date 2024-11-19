import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Direction, Message } from '../../libs/enums/common.enum';
import { useMutation, useQuery } from '@apollo/client';
import { GET_FACILITIES } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Facility } from '../../libs/types/facility/facility';
import { LIKE_TARGET_FACILITY } from '../../apollo/user/mutation';
import { FacilitiesInquiry } from '../../libs/types/facility/facility.input';
import FacilityCard from '../../libs/components/facility/FacilityCard';
import Filter from '../../libs/components/facility/Filter';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const FacilityList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<FacilitiesInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [facilities, setFacilities] = useState<Facility[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [selectedSortOption, setSelectedSortOption] = useState('Sort by latest');

	/** APOLLO REQUESTS **/
	const [likeTargetFacility] = useMutation(LIKE_TARGET_FACILITY);

	const {
		loading: getFacilitiesLoading,
		data: getFacilitiesData,
		error: getFacilitiesError,
		refetch: getFacilitiesRefetch,
	} = useQuery(GET_FACILITIES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setFacilities(data?.getFacilities?.list);
			setTotal(data?.getFacilities?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	/** HANDLERS **/
	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(
			`/facility?input=${JSON.stringify(searchFilter)}`,
			`/facility?input=${JSON.stringify(searchFilter)}`,
			{
				scroll: false,
			},
		);
		setCurrentPage(value);
	};

	const likeFacilityHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetFacility({ variables: { input: id } });

			await getFacilitiesRefetch({ _id: id });
		} catch (err: any) {
			console.log('Error on likeFacilityHandler', err);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		const selectedOption = e.currentTarget.id;
		setSelectedSortOption(selectedOption); // Update the selected option state
		switch (selectedOption) {
			case 'Sort by price:low to high':
				setSearchFilter({ ...searchFilter, sort: 'facilityPrice', direction: Direction.ASC });
				break;
			case 'Sort by price:high to low':
				setSearchFilter({ ...searchFilter, sort: 'facilityPrice', direction: Direction.DESC });
				break;
			case 'Sort by latest':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.ASC });
				break;
			case 'Sort by popularity':
				setSearchFilter({ ...searchFilter, sort: 'facilityViews', direction: Direction.DESC });
				break;
			case 'Sort by liked':
				setSearchFilter({ ...searchFilter, sort: 'facilityLikes', direction: Direction.DESC });
				break;
		}
		setSortingOpen(false);
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return <h1>FACILITIES MOBILE</h1>;
	} else {
		return (
			<div id="facility-list-page" style={{ position: 'relative' }}>
				<div className="container">
					<Box component={'div'} className={'right'}>
						<span>Sort by</span>
						<div>
							<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
								{selectedSortOption}
							</Button>
							<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
								{[
									'Sort by popularity',
									'Sort by latest',
									'Sort by price:low to high',
									'Sort by price:high to low',
									'Sort by liked',
								].map((label) => (
									<MenuItem
										className="inside-item"
										onClick={sortingHandler}
										id={label}
										disableRipple
										key={label}
										sx={{
											color: selectedSortOption === label ? 'red' : 'inherit', // Set color to red if selected
											fontWeight: selectedSortOption === label ? 'bold' : 'normal', // Make selected option bold
										}}
									>
										{label}
									</MenuItem>
								))}
							</Menu>
						</div>
					</Box>
					<Stack className={'facility-page'}>
						<Stack className={'filter-config'}>
							{/* @ts-ignore */}
							<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
						</Stack>
						<Stack className="main-config" mb={'76px'}>
							<Stack className={'list-config'}>
								{facilities?.length === 0 ? (
									<div className={'no-data'}>
										<img src="/img/icons/icoAlert.svg" alt="" />
										<p>No Facilities found!</p>
									</div>
								) : (
									facilities.map((facility: Facility) => {
										return (
											<FacilityCard facility={facility} likeFacilityHandler={likeFacilityHandler} key={facility?._id} />
										);
									})
								)}
							</Stack>
							<Stack className="pagination-config">
								{facilities.length !== 0 && (
									<Stack className="pagination-box">
										<Pagination
											page={currentPage}
											count={Math.ceil(total / searchFilter.limit)}
											onChange={handlePaginationChange}
											shape="circular"
											color="primary"
										/>
									</Stack>
								)}

								{facilities.length !== 0 && (
									<Stack className="total-result">
										<Typography>
											Total {total} facilit{total > 1 ? 'ies' : 'y'} available
										</Typography>
									</Stack>
								)}
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

FacilityList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 15,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			squaresRange: {
				start: 0,
				end: 500,
			},
			pricesRange: {
				start: 0,
				end: 2000000,
			},
		},
	},
};

export default withLayoutBasic(FacilityList);
