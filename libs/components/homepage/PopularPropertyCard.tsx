import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Rent } from '../../types/property/property';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface PopularPropertyCardProps {
	property: Rent;
}

const PopularPropertyCard = (props: PopularPropertyCardProps) => {
	const { property } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/

	const pushDetailHandler = async (propertyId: string) => {
		console.log(propertyId);
		await router.push({ pathname: '/property/detail', query: { id: propertyId } });
	};
	if (device === 'mobile') {
		return (
			<Stack className="popular-card-box">
				{/* <Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.rentImages[0]})` }}
					onClick={() => {
						pushDetailHandler(property._id);
					}}
				>
					{property && property?.rentRank >= topPropertyRank ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					) : (
						''
					)}

					<div className={'price'}>${property.rentalPrice}</div>
				</Box> */}
			</Stack>
		);
	} else {
		return (
			<Stack className="popular-card-box">
				<Box component={'div'} className={'info'}>
					<strong
						className={'title'}
						onClick={() => {
							pushDetailHandler(property._id);
						}}
					>
						{property.rentTitle}
					</strong>
					<p className={'desc'}>{property.rentAddress}</p>
				</Box>
			</Stack>
		);
	}
};

export default PopularPropertyCard;
