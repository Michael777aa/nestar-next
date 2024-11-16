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
			<Stack className="property-card-box">
				<Stack className="image-box" onClick={() => pushPropertyDetail(property?._id)}>
					<img src={`${process.env.REACT_APP_API_URL}/${property.rentImages[0]}`} alt="" />
				</Stack>
				<Stack className="information-box" onClick={() => pushPropertyDetail(property?._id)}>
					<Typography className="name">{property.rentTitle}</Typography>
					<Typography className="address">{property.rentAddress}</Typography>
					<Typography className="price">
						<strong>${formatterStr(property?.rentalPrice)}</strong>
					</Typography>
				</Stack>
				<Stack className="date-box">
					<Typography className="date">
						<Moment format="DD MMMM, YYYY">{property.createdAt}</Moment>
					</Typography>
				</Stack>
				<Stack className="status-box">
					<Stack className="coloured-box" sx={{ background: '#E5F0FD' }} onClick={handleClick}>
						<Typography className="status" sx={{ color: '#3554d1' }}>
							{property.availabilityStatus}
						</Typography>
					</Stack>
					{!memberPage && property.availabilityStatus !== 'DELETE' && (
						<Menu
							anchorEl={anchorEl}
							open={open}
							onClose={handleClose}
							PaperProps={{
								elevation: 0,
								sx: {
									width: '70px',
									mt: 1,
									ml: '10px',
									overflow: 'visible',
									filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
								},
								style: {
									padding: 0,
									display: 'flex',
									justifyContent: 'center',
								},
							}}
						>
							{property.availabilityStatus === 'AVAILABLE' && (
								<MenuItem
									className="coloured-box"
									disableRipple
									onClick={() => {
										handleClose();
										updatePropertyHandler(AvailabilityStatus.OCUPPIED, property?._id);
									}}
								>
									OCCUPIED
								</MenuItem>
							)}
							{property.availabilityStatus === 'OCUPPIED' && (
								<MenuItem
									disableRipple
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

				{!memberPage && property.availabilityStatus !== 'DELETE' && (
					<Menu
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						PaperProps={{
							elevation: 0,
							sx: {
								width: '70px',
								mt: 1,
								ml: '10px',
								overflow: 'visible',
								filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							},
							style: {
								padding: 0,
								display: 'flex',
								justifyContent: 'center',
							},
						}}
					>
						{property.availabilityStatus === 'AVAILABLE' && (
							<MenuItem
								disableRipple
								onClick={() => {
									handleClose();
									updatePropertyHandler(AvailabilityStatus.OCUPPIED, property?._id);
								}}
							>
								OCCUPIED
							</MenuItem>
						)}
						{property.availabilityStatus === 'OCUPPIED' && (
							<MenuItem
								disableRipple
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
