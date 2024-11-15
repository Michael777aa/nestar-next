import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	Button,
	OutlinedInput,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Tooltip,
	IconButton,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { RentLocation, RentType } from '../../enums/property.enum';
import { RentsInquiry } from '../../types/property/property.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { rentSquare } from '../../config';
import RefreshIcon from '@mui/icons-material/Refresh';

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface FilterType {
	searchFilter: RentsInquiry;
	setSearchFilter: any;
	initialInput: RentsInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [rentLocation, setRentLocation] = useState<RentLocation[]>(Object.values(RentLocation));
	const [rentType, setrentType] = useState<RentType[]>(Object.values(RentType));
	const [searchText, setSearchText] = useState<string>('');

	/** LIFECYCLES **/
	useEffect(() => {
		if (searchFilter?.search?.locationList?.length == 0) {
			delete searchFilter.search.locationList;
			router
				.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.typeList?.length == 0) {
			delete searchFilter.search.typeList;
			router
				.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.balconiesList?.length == 0) {
			delete searchFilter.search.balconiesList;
			router
				.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}
	}, [searchFilter]);

	/** HANDLERS **/
	const RentLocationSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.locationList?.includes(value)) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('RentLocationSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, RentLocationSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const rentTypeSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.typeList?.includes(value)) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('rentTypeSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, rentTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const rentBalconieselectHandler = useCallback(
		async (number: Number) => {
			try {
				if (number != 0) {
					if (searchFilter?.search?.balconiesList?.includes(number)) {
						await router.push(
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									balconiesList: searchFilter?.search?.balconiesList?.filter((item: Number) => item !== number),
								},
							})}`,
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									balconiesList: searchFilter?.search?.balconiesList?.filter((item: Number) => item !== number),
								},
							})}`,
							{ scroll: false },
						);
					} else {
						await router.push(
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									balconiesList: [...(searchFilter?.search?.balconiesList || []), number],
								},
							})}`,
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									balconiesList: [...(searchFilter?.search?.balconiesList || []), number],
								},
							})}`,
							{ scroll: false },
						);
					}
				} else {
					delete searchFilter?.search.balconiesList;
					setSearchFilter({ ...searchFilter });
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('rentBalconieselectHandler:', number);
			} catch (err: any) {
				console.log('ERROR, rentBalconieselectHandler:', err);
			}
		},
		[searchFilter],
	);

	const rentSquareHandler = useCallback(
		async (e: any, type: string) => {
			const value = e.target.value;

			if (type == 'start') {
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							squaresRange: { ...searchFilter.search.squaresRange, start: value },
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							squaresRange: { ...searchFilter.search.squaresRange, start: value },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							squaresRange: { ...searchFilter.search.squaresRange, end: value },
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							squaresRange: { ...searchFilter.search.squaresRange, end: value },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const rentalPriceHandler = useCallback(
		async (value: number, type: string) => {
			if (type == 'start') {
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const refreshHandler = async () => {
		try {
			setSearchText('');
			await router.push(
				`/property?input=${JSON.stringify(initialInput)}`,
				`/property?input=${JSON.stringify(initialInput)}`,
				{ scroll: false },
			);
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>Rents FILTER</div>;
	} else {
		return (
			<Stack className={'filter-main'}>
				<Stack className={'find-your-home'} mb={'40px'}>
					<Typography className={'title-main'}>Find Your Sport</Typography>
					<Stack className={'input-box'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input'}
							placeholder={'Search'}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key == 'Enter') {
									setSearchFilter({
										...searchFilter,
										search: { ...searchFilter.search, text: searchText },
									});
								}
							}}
							endAdornment={
								<>
									<CancelRoundedIcon
										onClick={() => {
											setSearchText('');
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: '' },
											});
										}}
									/>
								</>
							}
						/>
						<img src={'/img/icons/search_icon.png'} alt={''} />
						<Tooltip title="Reset">
							<IconButton onClick={refreshHandler}>
								<RefreshIcon />
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<p className={'title'} style={{ textShadow: '0px 3px 4px #b9b9b9' }}>
						Location
					</p>
					<Stack className="property-location" style={{ height: '400px' }}>
						{rentLocation.map((location: string) => (
							<Stack className="input-box" key={location}>
								<Checkbox
									id={location}
									className="property-checkbox"
									color="default"
									size="small"
									value={location}
									checked={(searchFilter?.search?.locationList || []).includes(location as RentLocation)}
									onChange={RentLocationSelectHandler}
								/>
								<label className="label">
									<Typography className="property-type">{location}</Typography>
								</label>{' '}
							</Stack>
						))}{' '}
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Facility Type</Typography>
					{rentType.map((type: string) => (
						<Stack
							className={'input-box'}
							key={type}
							sx={{
								display: 'flex',
								alignItems: 'center',
								backgroundColor: '#f7f7f7',
								padding: '10px 15px',
								borderRadius: '8px',
								boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
								transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
								'&:hover': {
									backgroundColor: '#ececec',
									boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
								},
							}}
						>
							<Checkbox
								id={type}
								className="property-checkbox"
								color="default"
								size="small"
								value={type}
								onChange={rentTypeSelectHandler}
								checked={(searchFilter?.search?.typeList || []).includes(type as RentType)}
								sx={{
									marginRight: '10px',
									'&.Mui-checked': {
										color: '#007bff',
									},
								}}
							/>
							<label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
								<Typography
									className="property_type"
									sx={{
										fontSize: '14px',
										color: '#333',
										transition: 'color 0.3s ease',
										'&:hover': {
											color: '#000',
										},
									}}
								>
									{type}
								</Typography>
							</label>
						</Stack>
					))}
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Balconies</Typography>
					<Stack
						className="button-group"
						sx={{
							display: 'flex',
							flexDirection: 'row',
							gap: '5px', // Adds some space between the buttons for better layout
						}}
					>
						<Button
							sx={{
								flex: 1, // Ensures all buttons have equal width
								borderRadius: '12px 0 0 12px',
								border: !searchFilter?.search?.balconiesList ? '2px solid #181A20' : '1px solid #b9b9b9',
								backgroundColor: !searchFilter?.search?.balconiesList ? '#f5f5f5' : 'white',
								color: '#181A20',
								fontWeight: 'bold',
								'&:hover': {
									backgroundColor: '#e0e0e0',
									borderColor: '#181A20',
								},
							}}
							onClick={() => rentBalconieselectHandler(0)}
						>
							Any
						</Button>
						{[1, 2, 3, 4].map((num) => (
							<Button
								key={num}
								sx={{
									flex: 1,
									borderRadius: 0,
									border: searchFilter?.search?.balconiesList?.includes(num)
										? '2px solid #181A20'
										: '1px solid #b9b9b9',
									borderLeft: searchFilter?.search?.balconiesList?.includes(num) ? undefined : 'none',
									backgroundColor: searchFilter?.search?.balconiesList?.includes(num) ? '#f5f5f5' : 'white',
									color: '#181A20',
									fontWeight: 'bold',
									'&:hover': {
										backgroundColor: '#e0e0e0',
										borderColor: '#181A20',
									},
								}}
								onClick={() => rentBalconieselectHandler(num)}
							>
								{num}
							</Button>
						))}
						<Button
							sx={{
								flex: 1,
								borderRadius: '0 12px 12px 0',
								border: searchFilter?.search?.balconiesList?.includes(5) ? '2px solid #181A20' : '1px solid #b9b9b9',
								backgroundColor: searchFilter?.search?.balconiesList?.includes(5) ? '#f5f5f5' : 'white',
								color: '#181A20',
								fontWeight: 'bold',
								'&:hover': {
									backgroundColor: '#e0e0e0',
									borderColor: '#181A20',
								},
							}}
							onClick={() => rentBalconieselectHandler(5)}
						>
							5+
						</Button>
					</Stack>
				</Stack>

				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Area unit</Typography>
					<Stack
						className="square-year-input"
						sx={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							gap: '15px', // Adds space between elements for better readability
							backgroundColor: '#f9f9f9', // Light background for contrast
							padding: '10px',
							borderRadius: '8px',
							boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
						}}
					>
						<FormControl
							sx={{
								minWidth: '110px',
								backgroundColor: '#fff',
								borderRadius: '8px',
								'& .MuiOutlinedInput-root': {
									'& fieldset': {
										borderColor: '#ccc', // Default border color
									},
									'&:hover fieldset': {
										borderColor: '#888', // Hover border color
									},
									'&.Mui-focused fieldset': {
										borderColor: '#007bff', // Focus border color
										boxShadow: '0 0 5px rgba(0, 123, 255, 0.3)', // Focus shadow
									},
								},
								'& .MuiSelect-icon': {
									color: '#888', // Icon color
									transition: 'color 0.3s ease',
								},
								'&:hover .MuiSelect-icon': {
									color: '#555',
								},
							}}
						>
							<InputLabel
								id="demo-simple-select-label"
								sx={{
									color: '#717171',
									'&.Mui-focused': {
										color: '#007bff', // Label focus color
									},
								}}
							>
								Min
							</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={searchFilter?.search?.squaresRange?.start ?? 0}
								label="Min"
								onChange={(e: any) => rentSquareHandler(e, 'start')}
								MenuProps={MenuProps}
								sx={{
									padding: '10px',
									color: '#333',
									'&:focus': {
										backgroundColor: '#f9f9f9',
									},
								}}
							>
								{rentSquare.map((square: number) => (
									<MenuItem
										value={square}
										disabled={(searchFilter?.search?.squaresRange?.end || 0) < square}
										key={square}
										sx={{
											'&.Mui-disabled': {
												color: '#bbb',
											},
											'&:hover': {
												backgroundColor: '#e0e0e0',
											},
										}}
									>
										{square}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<div
							className="central-divider"
							style={{
								width: '5px',
								height: '10px',
								transform: 'rotate(90deg)',
								backgroundColor: '#ccc',
								margin: '0 10px',
							}}
						></div>

						<FormControl
							sx={{
								minWidth: '120px',
								backgroundColor: '#fff',
								borderRadius: '8px',
								'& .MuiOutlinedInput-root': {
									'& fieldset': {
										borderColor: '#ccc',
									},
									'&:hover fieldset': {
										borderColor: '#888',
									},
									'&.Mui-focused fieldset': {
										borderColor: '#007bff',
										boxShadow: '0 0 5px rgba(0, 123, 255, 0.3)',
									},
								},
								'& .MuiSelect-icon': {
									color: '#888',
									transition: 'color 0.3s ease',
								},
								'&:hover .MuiSelect-icon': {
									color: '#555',
								},
							}}
						>
							<InputLabel
								id="demo-simple-select-label"
								sx={{
									color: '#717171',
									'&.Mui-focused': {
										color: '#007bff',
									},
								}}
							>
								Max
							</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={searchFilter?.search?.squaresRange?.end ?? 500}
								label="Max"
								onChange={(e: any) => rentSquareHandler(e, 'end')}
								MenuProps={MenuProps}
								sx={{
									padding: '10px',
									color: '#333',
									'&:focus': {
										backgroundColor: '#f9f9f9',
									},
								}}
							>
								{rentSquare.map((square: number) => (
									<MenuItem
										value={square}
										disabled={(searchFilter?.search?.squaresRange?.start || 0) > square}
										key={square}
										sx={{
											'&.Mui-disabled': {
												color: '#bbb',
											},
											'&:hover': {
												backgroundColor: '#e0e0e0',
											},
										}}
									>
										{square}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'}>
					<Typography className={'title'}>Price Range</Typography>
					<Stack
						className="square-year-input"
						direction="row"
						alignItems="center"
						spacing={1}
						sx={{
							border: '1px solid #ccc',
							borderRadius: '8px',
							padding: '10px',
							backgroundColor: '#f9f9f9',
							boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
						}}
					>
						<input
							type="number"
							placeholder="$ min"
							min={0}
							value={searchFilter?.search?.pricesRange?.start ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									rentalPriceHandler(e.target.value, 'start');
								}
							}}
							style={{
								flex: 1,
								height: '40px',
								borderRadius: '5px',
								border: '1px solid #ddd',
								padding: '0 10px',
								fontSize: '14px',
								outline: 'none',
								transition: 'border-color 0.3s ease',
							}}
						/>
						<div
							className="central-divider"
							style={{
								width: '2px',
								height: '10px',
								backgroundColor: '#ccc',
								transform: 'rotate(90deg)',
							}}
						></div>
						<input
							type="number"
							placeholder="$ max"
							value={searchFilter?.search?.pricesRange?.end ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									rentalPriceHandler(e.target.value, 'end');
								}
							}}
							style={{
								flex: 1,
								height: '40px',
								borderRadius: '5px',
								border: '1px solid #ddd',
								padding: '0 10px',
								fontSize: '14px',
								outline: 'none',
								transition: 'border-color 0.3s ease',
							}}
						/>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Filter;
