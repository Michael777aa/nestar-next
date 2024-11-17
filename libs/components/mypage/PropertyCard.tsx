import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import IconButton from '@mui/material/IconButton';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';
import { Rent } from '../../types/property/property';
import { formatterStr } from '../../utils';
import Moment from 'react-moment';
import { useRouter } from 'next/router';
import { AvailabilityStatus } from '../../enums/property.enum';

interface PropertyCardProps {
	property: Rent;
	deletePropertyHandler?: any;
	memberPage?: boolean;
	updatePropertyHandler?: any;
}

export const PropertyCard = (props: PropertyCardProps) => {
	const { property, deletePropertyHandler, memberPage, updatePropertyHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	/** HANDLERS **/
	const pushEditProperty = async (id: string) => {
		console.log('+pushEditProperty: ', id);
		await router.push({
			pathname: '/mypage',
			query: { category: 'addProperty', propertyId: id },
		});
	};

	const pushPropertyDetail = async (id: string) => {
		if (memberPage)
			await router.push({
				pathname: '/property/detail',
				query: { id: id },
			});
		else return;
	};

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return <div>MOBILE PROPERTY CARD</div>;
	} else
		return (
			<Stack className="property-card-box" sx={{ opacity: property.availabilityStatus === 'DELETE' ? 0.6 : 1 }}>
				<Stack
					className="image-box"
					onClick={() => property.availabilityStatus !== 'DELETE' && pushPropertyDetail(property?._id)}
					sx={{
						filter: property.availabilityStatus === 'DELETE' ? 'grayscale(100%)' : 'none',
						pointerEvents: property.availabilityStatus === 'DELETE' ? 'none' : 'auto',
					}}
				>
					<img src={`${process.env.REACT_APP_API_URL}/${property.rentImages[0]}`} alt="" />
				</Stack>
				<Stack
					className="information-box"
					onClick={() => property.availabilityStatus !== 'DELETE' && pushPropertyDetail(property?._id)}
				>
					<Typography
						className="name"
						sx={{ textDecoration: property.availabilityStatus === 'DELETE' ? 'line-through' : 'none' }}
					>
						{property.rentTitle}
					</Typography>
					<Typography className="address" sx={{ color: property.availabilityStatus === 'DELETE' ? '#999' : '#333' }}>
						{property.rentAddress}
					</Typography>
					<Typography className="price">
						<strong>
							{property.availabilityStatus !== 'DELETE' ? `$${formatterStr(property?.rentalPrice)}` : 'Deleted'}
						</strong>
					</Typography>
				</Stack>
				<Stack className="date-box">
					<Typography className="date">
						<Moment format="DD MMMM, YYYY">{property.createdAt}</Moment>
					</Typography>
				</Stack>
				<Stack className="status-box">
					<Stack
						className="coloured-box"
						sx={{
							background: property.availabilityStatus === 'DELETE' ? '#FCE4EC' : '#E5F0FD',
							cursor: property.availabilityStatus === 'DELETE' ? 'default' : 'pointer',
						}}
						onClick={property.availabilityStatus !== 'DELETE' ? handleClick : undefined}
					>
						<Typography
							className="status"
							sx={{
								color: property.availabilityStatus === 'DELETE' ? '#D32F2F' : '#3554d1',
								fontWeight: property.availabilityStatus === 'DELETE' ? 'bold' : 'normal',
							}}
						>
							{property.availabilityStatus}
						</Typography>
					</Stack>
					{!memberPage && property.availabilityStatus !== 'DELETE' && (
						<Menu
							anchorEl={anchorEl}
							open={open}
							onClose={handleClose}
							PaperProps={{
								elevation: 2,
								sx: {
									width: '100px',
									mt: 1,
									ml: '10px',
									overflow: 'hidden',
									borderRadius: '8px',
									boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
								},
							}}
						>
							{property.availabilityStatus === 'AVAILABLE' && (
								<MenuItem
									onClick={() => {
										handleClose();
										updatePropertyHandler(AvailabilityStatus.RESERVED, property?._id);
									}}
								>
									OCCUPIED
								</MenuItem>
							)}
							{property.availabilityStatus === 'RESERVED' && (
								<MenuItem
									onClick={() => {
										handleClose();
										updatePropertyHandler(AvailabilityStatus.AVAILABLE, property?._id);
									}}
								>
									AVAILABLE
								</MenuItem>
							)}
						</Menu>
					)}
				</Stack>

				<Stack className="views-box">
					<Typography className="views">{property.rentViews?.toLocaleString() || '0'}</Typography>
				</Stack>

				{!memberPage && property.availabilityStatus === AvailabilityStatus.AVAILABLE && (
					<Stack className="action-box">
						<IconButton className="icon-button" onClick={() => pushEditProperty(property._id)}>
							<ModeIcon className="buttons" />
						</IconButton>
						<IconButton className="icon-button" onClick={() => deletePropertyHandler(property._id)}>
							<DeleteIcon className="buttons" />
						</IconButton>
					</Stack>
				)}
			</Stack>
		);
};
