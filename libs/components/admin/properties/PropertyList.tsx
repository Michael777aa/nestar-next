import React from 'react';
import Link from 'next/link';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { Stack } from '@mui/material';
import { Rent } from '../../../types/property/property';
import { REACT_APP_API_URL } from '../../../config';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { AvailabilityStatus } from '../../../enums/property.enum';

interface Data {
	id: string;
	title: string;
	price: string;
	agent: string;
	location: string;
	type: string;
	status: string;
	remove: string;
}

type Order = 'asc' | 'desc';

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id',
		numeric: true,
		disablePadding: false,
		label: 'MB ID',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'TITLE',
	},
	{
		id: 'price',
		numeric: false,
		disablePadding: false,
		label: 'PRICE',
	},
	{
		id: 'agent',
		numeric: false,
		disablePadding: false,
		label: 'AGENT',
	},
	{
		id: 'location',
		numeric: false,
		disablePadding: false,
		label: 'LOCATION',
	},
	{
		id: 'type',
		numeric: false,
		disablePadding: false,
		label: 'TYPE',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'STATUS',
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface PropertyPanelListType {
	properties: Rent[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updatePropertyHandler: any;
	removePropertyHandler: any;
}

export const PropertyPanelList = (props: PropertyPanelListType) => {
	const {
		properties,
		anchorEl,
		menuIconClickHandler,
		menuIconCloseHandler,
		updatePropertyHandler,
		removePropertyHandler,
	} = props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					{/* Table Header */}
					{/*@ts-ignore*/}
					<EnhancedTableHead />
					<TableBody>
						{/* No Data Row */}
						{properties.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={headCells.length}>
									<span className="no-data">No data found!</span>
								</TableCell>
							</TableRow>
						)}

						{/* Data Rows */}
						{properties.length !== 0 &&
							properties.map((property: Rent, index: number) => {
								const propertyImage = `${REACT_APP_API_URL}/${property?.rentImages[0]}`;

								return (
									<TableRow hover key={property?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										{/* Property ID */}
										<TableCell align="left">{property._id}</TableCell>

										{/* Property Title with Image */}
										<TableCell align="left">
											<Stack direction={'row'}>
												<Link href={`/property/detail?id=${property?._id}`}>
													<Avatar
														alt={property.rentTitle}
														src={propertyImage}
														sx={{ ml: '2px', mr: '10px', width: 50, height: 50 }}
													/>
												</Link>
												<Link href={`/property/detail?id=${property?._id}`}>
													<Typography>{property.rentTitle}</Typography>
												</Link>
											</Stack>
										</TableCell>

										<TableCell align="center">${property.rentalPrice}</TableCell>

										<TableCell align="center">{property.memberData?.memberNick || 'N/A'}</TableCell>

										<TableCell align="center">{property.rentLocation}</TableCell>

										<TableCell align="center">{property.rentType}</TableCell>

										<TableCell align="center">
											<Button
												className={`badge ${property.availabilityStatus.toLowerCase()}`}
												onClick={(e) => menuIconClickHandler(e, index)}
											>
												{property.availabilityStatus}
											</Button>
											<Menu
												anchorEl={anchorEl[index]}
												open={Boolean(anchorEl[index])}
												onClose={menuIconCloseHandler}
												TransitionComponent={Fade}
											>
												{Object.values(AvailabilityStatus)
													.filter((status) => status !== property.availabilityStatus)
													.map((status) => (
														<MenuItem
															key={status}
															onClick={() =>
																updatePropertyHandler({
																	_id: property._id,
																	availabilityStatus: status,
																})
															}
														>
															<Typography>{status}</Typography>
														</MenuItem>
													))}
											</Menu>
										</TableCell>

										{property.availabilityStatus === 'DELETE' && (
											<TableCell align="center">
												<Button
													variant="outlined"
													color="error"
													onClick={() => removePropertyHandler(property._id)}
													sx={{ p: '3px' }}
												>
													<DeleteIcon fontSize="small" />
												</Button>
											</TableCell>
										)}
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
