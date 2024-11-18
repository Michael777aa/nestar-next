import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Rent } from '../../types/property/property';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';
import { useRouter } from 'next/router';
import BalconyIcon from '@mui/icons-material/Balcony';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

interface PopularPropertyCardProps {
	property: Rent;
}

const PopularPropertyCard = (props: PopularPropertyCardProps) => {
	const { property } = props;
	const device = useDeviceDetect();
	const router = useRouter();

	/** HANDLERS **/

	const pushDetailHandler = async (propertyId: string) => {
		console.log(propertyId);
		await router.push({ pathname: '/property/detail', query: { id: propertyId } });
	};
	if (device === 'mobile') {
		return (
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.rentImages[0]})` }}
					onClick={() => {
						pushDetailHandler(property._id);
					}}
				>
					<div className={'price'}>${property.rentalPrice}</div>
				</Box>
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
					<div className={'options'}>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{property?.rentBalconies} balconies</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{property?.rentSquare} m2</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{property?.rentViews}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.rentImages[0]})` }}
					onClick={() => {
						pushDetailHandler(property._id);
					}}
				>
					{(property?.rentRank ?? 0) >= topPropertyRank && (
						<div className="status">
							<img src="/img/icons/electricity.svg" alt="Top Property Icon" />
							<span>Top</span>
						</div>
					)}
				</Box>

				<Box component={'div'} className={'info'}>
					<div className={'options'}>
						<div>
							<BalconyIcon />
							<span>{property?.rentBalconies} balconies</span>
						</div>

						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{property?.rentSquare} m2</span>
						</div>
					</div>
					<strong
						className={'title'}
						style={{ position: 'relative', top: '-5px' }}
						onClick={() => {
							pushDetailHandler(property._id);
						}}
					>
						{property.rentTitle} <ArrowOutwardIcon />
					</strong>
					<p className={'desc'}>{property.rentDesc}</p>
					<p className={'address'}>Address: {property.rentAddress}</p>
					<div className="div-rent-location">
						<p className={'type'}>Rent Type: {property.rentType}</p>
						<p className={'location'}>Location: {property.rentLocation}</p>
					</div>

					<div className="bottom-card">
						<div className={'price'}>${property.rentalPrice}/week</div>

						<div className="viewsss">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{property?.rentViews}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default PopularPropertyCard;
