import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import IconButton from '@mui/material/IconButton';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';
import { Facility } from '../../types/facility/facility';
import { formatterStr } from '../../utils';
import Moment from 'react-moment';
import { useRouter } from 'next/router';
import { AvailabilityStatus } from '../../enums/facility.enum';

interface FacilityCardProps {
	facility: Facility;
	deleteFacilityHandler?: any;
	memberPage?: boolean;
	updateFacilityHandler?: any;
}

export const FacilityCard = (props: FacilityCardProps) => {
	const { facility, deleteFacilityHandler, memberPage, updateFacilityHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	/** HANDLERS **/
	const pushEditFacility = async (id: string) => {
		console.log('+pushEditFacility: ', id);
		await router.push({
			pathname: '/mypage',
			query: { category: 'addFacility', facilityId: id },
		});
	};

	const pushFacilityDetail = async (id: string) => {
		if (memberPage)
			await router.push({
				pathname: '/facility/detail',
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
		return <div>MOBILE FACILITY CARD</div>;
	} else
		return (
			<Stack className="facility-card-box" sx={{ opacity: facility.availabilityStatus === 'DELETE' ? 0.6 : 1 }}>
				<Stack
					className="image-box"
					onClick={() => facility.availabilityStatus !== 'DELETE' && pushFacilityDetail(facility?._id)}
					sx={{
						filter: facility.availabilityStatus === 'DELETE' ? 'grayscale(100%)' : 'none',
						pointerEvents: facility.availabilityStatus === 'DELETE' ? 'none' : 'auto',
					}}
				>
					<img src={`${process.env.REACT_APP_API_URL}/${facility.facilityImages[0]}`} alt="" />
				</Stack>
				<Stack
					className="information-box"
					onClick={() => facility.availabilityStatus !== 'DELETE' && pushFacilityDetail(facility?._id)}
				>
					<Typography
						className="name"
						sx={{ textDecoration: facility.availabilityStatus === 'DELETE' ? 'line-through' : 'none' }}
					>
						{facility.facilityTitle}
					</Typography>
					<Typography className="address" sx={{ color: facility.availabilityStatus === 'DELETE' ? '#999' : '#333' }}>
						{facility.facilityAddress}
					</Typography>
					<Typography className="price">
						<strong>
							{facility.availabilityStatus !== 'DELETE' ? `$${formatterStr(facility?.facilityPrice)}` : 'Deleted'}
						</strong>
					</Typography>
				</Stack>
				<Stack className="date-box">
					<Typography className="date">
						<Moment format="DD MMMM, YYYY">{facility.createdAt}</Moment>
					</Typography>
				</Stack>
				<Stack className="status-box">
					<Stack
						className="coloured-box"
						sx={{
							background: facility.availabilityStatus === 'DELETE' ? '#FCE4EC' : '#E5F0FD',
							cursor: facility.availabilityStatus === 'DELETE' ? 'default' : 'pointer',
						}}
						onClick={facility.availabilityStatus !== 'DELETE' ? handleClick : undefined}
					>
						<Typography
							className="status"
							sx={{
								color: facility.availabilityStatus === 'DELETE' ? '#D32F2F' : '#3554d1',
								fontWeight: facility.availabilityStatus === 'DELETE' ? 'bold' : 'normal',
							}}
						>
							{facility.availabilityStatus}
						</Typography>
					</Stack>
					{!memberPage && facility.availabilityStatus !== 'DELETE' && (
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
							{facility.availabilityStatus === 'AVAILABLE' && (
								<MenuItem
									onClick={() => {
										handleClose();
										updateFacilityHandler(AvailabilityStatus.RESERVED, facility?._id);
									}}
								>
									OCCUPIED
								</MenuItem>
							)}
							{facility.availabilityStatus === 'RESERVED' && (
								<MenuItem
									onClick={() => {
										handleClose();
										updateFacilityHandler(AvailabilityStatus.AVAILABLE, facility?._id);
									}}
								>
									AVAILABLE
								</MenuItem>
							)}
						</Menu>
					)}
				</Stack>

				<Stack className="views-box">
					<Typography className="views">{facility.facilityViews?.toLocaleString() || '0'}</Typography>
				</Stack>

				{!memberPage && facility.availabilityStatus === AvailabilityStatus.AVAILABLE && (
					<Stack className="action-box">
						<IconButton className="icon-button" onClick={() => pushEditFacility(facility._id)}>
							<ModeIcon className="buttons" />
						</IconButton>
						<IconButton className="icon-button" onClick={() => deleteFacilityHandler(facility._id)}>
							<DeleteIcon className="buttons" />
						</IconButton>
					</Stack>
				)}
			</Stack>
		);
};
