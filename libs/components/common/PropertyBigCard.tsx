import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Rent } from '../../types/property/property';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';
import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BalconyIcon from '@mui/icons-material/Balcony';

interface PropertyBigCardProps {
	property: Rent;
	likePropertyHandler?: any;
}

const PropertyBigCard = (props: PropertyBigCardProps) => {
	const { property, likePropertyHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** HANDLERS **/
	const goPropertyDetatilPage = (propertyId: string) => {
		router.push(`/property/detail?id=${propertyId}`);
	};

	if (device === 'mobile') {
		return <div>APARTMEND BIG CARD</div>;
	} else {
		return (
			<Stack
				className="property-big-card-box"
				onClick={() => goPropertyDetatilPage(property?._id)}
				style={{
					width: '100%',
					maxWidth: '350px',

					borderRadius: '12px',
					overflow: 'hidden',
					cursor: 'pointer',
					backgroundColor: '#fff',
					transition: 'transform 0.3s ease, box-shadow 0.3s ease',
				}}
			>
				<Box
					component="div"
					className="card-img"
					style={{
						width: '100%',
						height: '220px',
						backgroundImage: `url(${REACT_APP_API_URL}/${property?.rentImages?.[0]})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						position: 'relative',
						borderRadius: '12px 12px 0 0',
					}}
				/>
				<Box
					component="div"
					className="info"
					style={{
						padding: '20px',
						display: 'flex',
						flexDirection: 'column',
						gap: '12px',
					}}
				>
					<strong
						className="title"
						style={{
							fontSize: '1.25rem',
							fontWeight: '600',
							color: '#333',
							marginBottom: '6px',
						}}
					>
						{property?.rentTitle}
					</strong>
					<p
						className="desc"
						style={{
							fontSize: '0.9rem',
							color: '#666',
							marginBottom: '10px',
						}}
					>
						{property?.rentAddress}
					</p>
					<div
						className="options"
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
							color: '#777',
						}}
					>
						<BalconyIcon style={{ fontSize: '18px', color: '#555' }} />
						<span style={{ fontSize: '0.85rem' }}>{property?.rentBalconies} balconies</span>
					</div>
					<Divider sx={{ mt: '8px', mb: '8px' }} />
					<div
						className="bott"
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginTop: '6px',
						}}
					>
						<div
							className="price"
							style={{
								fontSize: '1.1rem',
								fontWeight: 'bold',
								color: '#333',
							}}
						>
							${formatterStr(property?.rentalPrice)}
						</div>
						<div className="buttons-box" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
							<IconButton color="default" style={{ padding: '5px' }}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt" style={{ fontSize: '0.85rem', color: '#333' }}>
								{property?.rentViews}
							</Typography>
							<IconButton
								color="default"
								style={{ padding: '5px' }}
								onClick={(e) => {
									e.stopPropagation();
									likePropertyHandler(user, property?._id);
								}}
							>
								{property?.meLiked && property?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt" style={{ fontSize: '0.85rem', color: '#333' }}>
								{property?.rentLikes}
							</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default PropertyBigCard;
