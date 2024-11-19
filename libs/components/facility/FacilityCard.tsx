import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Facility } from '../../types/facility/facility';
import Link from 'next/link';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import WifiIcon from '@mui/icons-material/Wifi';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import ElevatorIcon from '@mui/icons-material/Elevator';
import SecurityIcon from '@mui/icons-material/Security';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import BuildIcon from '@mui/icons-material/Build';
import WeekendIcon from '@mui/icons-material/Weekend';
interface FacilityCardType {
	facility: Facility;
	likeFacilityHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const FacilityCard = (props: FacilityCardType) => {
	const { facility, likeFacilityHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = facility?.facilityImages[0]
		? `${REACT_APP_API_URL}/${facility?.facilityImages[0]}`
		: '/img/banner/header1.svg';

	const amenityIcons: any = {
		WiFi: <WifiIcon />,
		'Air Conditioning': <AcUnitIcon />,
		'Washer/Dryer': <LocalLaundryServiceIcon />,
		Elevator: <ElevatorIcon />,
		'Security System': <SecurityIcon />,
		'Lounge Area': <WeekendIcon />,
		'24-Hour Maintenance': <BuildIcon />,
		Breakfast: <LocalCafeIcon />,
	};
	if (device === 'mobile') {
		return <div>FACILITY CARD</div>;
	} else {
		return (
			<Stack className="card-config">
				<Stack className="top">
					<Link
						href={{
							pathname: '/facility/detail',
							query: { id: facility?._id },
						}}
					>
						<img src={imagePath} alt="" />
					</Link>
				</Stack>
				<Stack className="bottom">
					<Stack className="name-address">
						<Stack className="name">
							<Link
								href={{
									pathname: '/facility/detail',
									query: { id: facility?._id },
								}}
							>
								<Typography className="rent-title">{facility?.facilityTitle}</Typography>
							</Link>
						</Stack>
						<Stack className="address">
							<Typography>
								{facility.facilityAddress}, {facility.facilityLocation}
							</Typography>
						</Stack>
					</Stack>

					<Stack className="options">
						<Stack className="option">
							<Typography>{facility.facilityBalconies} balconies</Typography>
						</Stack>
						<Stack className="option">
							<Typography>{facility.facilitySquare} m2</Typography>
						</Stack>
					</Stack>

					<Stack className="options">
						<div className="option">
							<span>{facility?.furnished ? 'furnished' : 'no furnished'}</span>
						</div>
						<div className="option ">
							<span>{facility?.parkingAvailable ? 'parking available' : 'parking unavailable'}</span>
						</div>
						<div className="option">
							<span>{facility?.facilityPetsAllowed ? 'pets  allowed' : 'pets not allowed'}</span>
						</div>
					</Stack>
					<Stack className="type-buttons">
						<Stack className="type"></Stack>
						{!recentlyVisited && (
							<Stack className="buttons">
								<IconButton color={'default'}>
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography className="view-cnt">{facility?.facilityViews}</Typography>
								<IconButton color={'default'} onClick={() => likeFacilityHandler(user, facility?._id)}>
									{myFavorites ? (
										<FavoriteIcon color="primary" />
									) : facility?.meLiked && facility?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon color="primary" />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
								<Typography className="view-cnt">{facility?.facilityLikes}</Typography>
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
							width: '150px',
							fontSize: '10px',
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
						<Typography style={{ fontSize: '15px' }}>${facility?.facilityPrice}/week</Typography>
					</Box>
					<Link
						href={{
							pathname: '/facility/detail',
							query: { id: facility?._id },
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
								background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
								border: 'none',
								borderRadius: '50px',
								cursor: 'pointer',
							}}
						>
							Book Now
						</button>
					</Link>

					<Stack
						className="amenities"
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'flex-start',
							position: 'relative',
							top: '-130px',
						}}
					>
						Amenities:
						{facility?.amenities?.map((amenity) => (
							<Box
								key={amenity}
								style={{
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-between',
									margin: '5px',
									color: '#4CAF50',
									fontSize: '20px',
								}}
							>
								{amenityIcons[amenity] || <span>{amenity}</span>}
							</Box>
						))}
					</Stack>
					<Stack className="divider"></Stack>
				</Stack>
			</Stack>
		);
	}
};

export default FacilityCard;
