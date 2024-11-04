import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Rent } from '../../types/property/property';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import BrushIcon from '@mui/icons-material/Brush';
interface TopPropertyCardProps {
	property: Rent;
	likePropertyHandler: any;
}

const TopPropertyCard = (props: TopPropertyCardProps) => {
	const { property, likePropertyHandler } = props;
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
			<Stack className="top-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.rentImages[0]})` }}
					onClick={() => {
						pushDetailHandler(property._id);
					}}
				>
					<div>${property?.rentalPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong
						className={'title'}
						onClick={() => {
							pushDetailHandler(property._id);
						}}
					>
						{property?.rentTitle}
					</strong>
					<p className={'desc'}>{property?.rentAddress}</p>
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
							<IconButton color={'default'}>
								{property?.meLiked && property?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{property?.rentLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.rentImages[0]})` }}
					onClick={() => {
						pushDetailHandler(property._id);
					}}
				></Box>
				<Box component={'div'} className={'info'}>
					<strong
						className={'title'}
						onClick={() => {
							pushDetailHandler(property._id);
						}}
					>
						{property?.rentTitle}
					</strong>
					<div className={'options'}>
						<div>
							<span>{property?.availabilityStatus}</span>
						</div>
						<div></div>
						<div>
							<span>{property?.rentPetsAllowed ? 'pets allowed' : 'pets prohibited'}</span>
						</div>
					</div>
					<div className={'options'}>
						<div>
							<span>{property?.parkingAvailable ? 'parking' : 'no parking'}</span>
						</div>
						<div></div>
						<div>
							<span>{property?.furnished ? 'furnished' : 'no furnished'}</span>
						</div>
					</div>

					<div className={'options'}>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{property?.rentBalconies} balconies</span>
						</div>
						<div></div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{property?.rentSquare} m2</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div>${property?.rentalPrice}/week</div>

						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{property?.rentViews}</Typography>
							<IconButton color={'default'} onClick={() => likePropertyHandler(user, property?._id)}>
								{property?.meLiked && property?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{property?.rentLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default TopPropertyCard;
