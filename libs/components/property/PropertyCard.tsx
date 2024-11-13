import React, { useState, useCallback, useEffect } from 'react';
import { Stack, Typography, Box, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Link from 'next/link';
import { formatterStr } from '../../utils';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Rent } from '../../types/property/property';

interface PropertyCardType {
	rent: Rent;
	likePropertyHandler?: (user: any, propertyId: string) => Promise<void>;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const PropertyCard = ({ rent, likePropertyHandler, myFavorites, recentlyVisited }: PropertyCardType) => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath = rent?.rentImages[0] ? `${REACT_APP_API_URL}/${rent?.rentImages[0]}` : '/img/banner/header1.svg';

	const [likes, setLikes] = useState(rent?.rentLikes || 0);
	const [liked, setLiked] = useState<boolean>(false);

	// Load the liked state from localStorage or backend on component mount
	useEffect(() => {
		const likedState = localStorage.getItem(`property_${rent?._id}_liked`);
		setLiked(likedState === 'true');
	}, [rent?._id]);

	const handleLike = useCallback(async () => {
		if (!user?._id) return; // Ensure user is authenticated

		const newLikedState = !liked;
		setLiked(newLikedState);
		setLikes(newLikedState ? likes + 1 : likes - 1); // Instant update

		// Store liked state in localStorage for persistence
		localStorage.setItem(`property_${rent?._id}_liked`, newLikedState.toString());

		// Trigger actual like mutation if provided
		if (likePropertyHandler) await likePropertyHandler(user, rent?._id);
	}, [liked, likes, user, rent?._id, likePropertyHandler]);

	const cardHoverStyle = {
		transform: 'scale(1.02)',
		transition: 'transform 0.2s ease-in-out',
		cursor: 'pointer',
		boxShadow: '0 6px 18px rgba(0, 0, 0, 0.2)',
	};

	return device === 'mobile' ? (
		<div>PROPERTY CARD</div>
	) : (
		<Stack
			style={{
				maxWidth: '320px',
				margin: '20px auto',
				borderRadius: '12px',
				backgroundColor: '#f9f9f9',
				overflow: 'hidden',
				...cardHoverStyle,
			}}
		>
			<Stack style={{ position: 'relative' }}>
				<Link href={{ pathname: '/property/detail', query: { id: rent?._id } }}>
					<img
						src={imagePath}
						alt={rent.rentTitle}
						style={{
							width: '100%',
							height: '200px',
							objectFit: 'cover',
							borderRadius: '12px 12px 0 0',
							transition: 'opacity 0.2s ease',
						}}
					/>
				</Link>
				{rent?.rentRank > topPropertyRank && (
					<Box
						style={{
							position: 'absolute',
							top: '10px',
							left: '10px',
							backgroundColor: '#ff5722',
							color: '#fff',
							padding: '5px 10px',
							borderRadius: '4px',
							fontSize: '12px',
							fontWeight: 'bold',
						}}
					>
						Top
					</Box>
				)}
				<Box
					style={{
						position: 'absolute',
						bottom: '10px',
						left: '10px',
						backgroundColor: 'rgba(0,0,0,0.7)',
						color: '#fff',
						padding: '5px 10px',
						borderRadius: '4px',
					}}
				>
					<Typography>${formatterStr(rent?.rentalPrice)}</Typography>
				</Box>
			</Stack>

			<Stack style={{ padding: '15px 20px' }}>
				<Typography variant="h6" style={{ fontWeight: '600', marginBottom: '5px' }}>
					<Link href={{ pathname: '/property/detail', query: { id: rent?._id } }}>{rent.rentTitle}</Link>
				</Typography>
				<Typography variant="body2" color="textSecondary">
					{rent.rentAddress}, {rent.rentLocation}
				</Typography>

				<Box style={{ borderTop: '1px solid #ddd', marginTop: '15px', paddingTop: '10px' }}>
					<Stack direction="row" spacing={1} alignItems="center">
						<IconButton>
							<RemoveRedEyeIcon style={{ color: '#757575' }} />
						</IconButton>
						<Typography style={{ fontSize: '14px' }}>{rent?.rentViews}</Typography>

						<IconButton onClick={handleLike} style={{ color: liked ? '#e53935' : '#757575' }}>
							{liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
						</IconButton>
						<Typography style={{ fontSize: '14px' }}>{likes}</Typography>
					</Stack>
				</Box>
			</Stack>
		</Stack>
	);
};

export default PropertyCard;
