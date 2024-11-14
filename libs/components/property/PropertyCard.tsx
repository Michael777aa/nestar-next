import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Rent } from '../../types/property/property';
import Link from 'next/link';
import { formatterStr } from '../../utils';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

interface PropertyCardType {
	property: Rent;
	likePropertyHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const PropertyCard = (props: PropertyCardType) => {
	const { property, likePropertyHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = property?.rentImages[0]
		? `${REACT_APP_API_URL}/${property?.rentImages[0]}`
		: '/img/banner/header1.svg';
	const isLiked = myFavorites || (property?.meLiked && property?.meLiked[0]?.myFavorite);

	if (device === 'mobile') {
		return <div>PROPERTY CARD</div>;
	} else {
		return (
			<Stack className="card-config">
				<Stack className="top">
					<Link
						href={{
							pathname: '/property/detail',
							query: { id: property?._id },
						}}
					>
						<img src={imagePath} alt="" />
					</Link>
					{property && property?.rentRank > topPropertyRank && (
						<Box component={'div'} className={'top-badge'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<Typography>TOP</Typography>
						</Box>
					)}
				</Stack>
				<Stack className="bottom">
					<Stack className="name-address">
						<Stack className="name">
							<Link
								href={{
									pathname: '/property/detail',
									query: { id: property?._id },
								}}
							>
								<Typography className="rent-title">{property.rentTitle}</Typography>
							</Link>
						</Stack>
						<Stack className="address">
							<Typography>
								{property.rentAddress}, {property.rentLocation}
							</Typography>
						</Stack>
					</Stack>

					<Stack className="options">
						<Stack className="option">
							<img src="/img/icons/bed.svg" alt="" /> <Typography>{property.furnished}</Typography>
						</Stack>
						<Stack className="option">
							<img src="/img/icons/room.svg" alt="" /> <Typography>{property.rentBalconies} balconies</Typography>
						</Stack>
						<Stack className="option">
							<img src="/img/icons/expand.svg" alt="" /> <Typography>{property.rentSquare} m2</Typography>
						</Stack>
					</Stack>

					<Stack className="options">
						<div className="option">
							<span>{property?.furnished ? 'furnished' : 'no furnished'}</span>
						</div>
						<div className="option ">
							<span>{property?.parkingAvailable ? 'parking available' : 'parking unavailable'}</span>
						</div>
						<div className="option">
							<span>{property?.rentPetsAllowed ? 'pets  allowed' : 'pets not allowed'}</span>
						</div>
					</Stack>
					<Stack className="type-buttons">
						<Stack className="type"></Stack>
						{!recentlyVisited && (
							<Stack className="buttons">
								<IconButton color={'default'}>
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography className="view-cnt">{property?.rentViews}</Typography>
								<IconButton color={'default'} onClick={() => likePropertyHandler(user, property?._id)}>
									{myFavorites ? (
										<FavoriteIcon color="primary" />
									) : property?.meLiked && property?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon color="primary" />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
								<Typography className="view-cnt">{property?.rentLikes}</Typography>
							</Stack>
						)}
					</Stack>
					<Box
						component={'div'}
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							position: 'relative',
							bottom: '18px',
							padding: '8px 20px',
							background: 'linear-gradient(135deg, #4CAF50, #2E7D32)', // Green gradient background
							borderRadius: '50px', // Fully rounded for a pill shape
							color: '#ffffff', // White text for contrast
							fontWeight: '600',
							width: '40%',
							fontSize: '18px',
							textAlign: 'center',
							boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)',
							transition: 'transform 0.3s ease, box-shadow 0.3s ease',
							cursor: 'pointer',
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.transform = 'scale(1.05)';
							e.currentTarget.style.boxShadow = '0px 8px 20px rgba(0, 0, 0, 0.2)';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = 'scale(1)';
							e.currentTarget.style.boxShadow = '0px 6px 12px rgba(0, 0, 0, 0.15)';
						}}
					>
						<Typography>${formatterStr(property?.rentalPrice)}/week</Typography>
					</Box>
					<Link
						href={{
							pathname: '/property/detail',
							query: { id: property?._id },
						}}
					>
						<button
							style={{
								position: 'relative',
								top: '-55px',
								left: '520px',
								padding: '10px 24px',
								fontSize: '16px',
								fontWeight: '600',
								color: '#ffffff',
								background: 'linear-gradient(135deg, #4CAF50, #2E7D32)', // Green gradient background
								border: 'none',
								borderRadius: '50px',
								cursor: 'pointer',
								boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
								transition: 'transform 0.3s ease, box-shadow 0.3s ease',
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.transform = 'scale(1.05)';
								e.currentTarget.style.boxShadow = '0px 6px 16px rgba(0, 0, 0, 0.2)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform = 'scale(1)';
								e.currentTarget.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.15)';
							}}
						>
							Book Now
						</button>
					</Link>
					<Stack className="options">
						<div
							style={{
								position: 'relative',
								top: '-125px',
								left: '0px',
							}}
						>
							<span>{property?.amenities}</span>
						</div>
					</Stack>
					<Stack className="divider"></Stack>
				</Stack>
			</Stack>
		);
	}
};

export default PropertyCard;
