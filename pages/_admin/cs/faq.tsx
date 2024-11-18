import React, { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Button, InputAdornment, Stack } from '@mui/material';
import { List, ListItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import OutlinedInput from '@mui/material/OutlinedInput';
import TablePagination from '@mui/material/TablePagination';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { FaqArticlesPanelList } from '../../../libs/components/admin/cs/FaqList';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_NOTICE } from '../../../apollo/admin/mutation';
import { GET_ALL_NOTICES } from '../../../apollo/admin/query';
import { Notice } from '../../../libs/types/notice/notice';
import { NoticeCategory, NoticeField, NoticeStatus } from '../../../libs/enums/notice.enum';
import { NoticeUpdate } from '../../../libs/types/notice/notice.update';
import { sweetErrorHandling } from '../../../libs/sweetAlert';
import { T } from '../../../libs/types/common';
import { NoticiesInquiry } from '../../../libs/types/notice/notice.input';

const FaqArticles: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<any>([]);
	const [noticesInquiry, setNoticesInquiry] = useState<NoticiesInquiry>(initialInquiry);
	const [allNotices, setAllNotices] = useState<Notice[]>([]);
	const [value, setValue] = useState(
		noticesInquiry?.search?.noticeStatus ? noticesInquiry?.search?.noticeStatus : 'ALL',
	);
	const [searchText, setSearchText] = useState('');
	const [total, setTotal] = useState<number>(0);

	const [searchType, setSearchType] = useState('ALL');
	const [searchField, setSearchField] = useState('ALL');

	/** APOLLO REQUESTS **/

	const [updateNotice] = useMutation(UPDATE_NOTICE);

	const { loading: getNoticesLoading, refetch: getNoticesRefetch } = useQuery(GET_ALL_NOTICES, {
		fetchPolicy: 'network-only',
		variables: { input: noticesInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAllNotices(data?.getNotices?.list || []);
			setTotal(data?.getNotices?.metaCounter[0]?.total || 0);
		},
	});

	/** LIFECYCLES **/

	useEffect(() => {
		getNoticesRefetch({ input: noticesInquiry });
	}, [noticesInquiry]);

	/** HANDLERS **/

	const changePageHandler = async (event: unknown, newPage: number) => {
		setNoticesInquiry((prev) => ({ ...prev, page: newPage + 1 }));
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		setNoticesInquiry((prev) => ({
			...prev,
			limit: parseInt(event.target.value, 10),
			page: 1,
		}));
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const tabChangeHandler = (event: any, newValue: string) => {
		setValue(newValue);

		let updatedSearch: any = { ...noticesInquiry.search };

		switch (newValue) {
			case 'ACTIVE':
				updatedSearch.noticeStatus = NoticeStatus.ACTIVE;
				break;
			case 'HOLD':
				updatedSearch.noticeStatus = NoticeStatus.HOLD;
				break;
			case 'DELETE':
				updatedSearch.noticeStatus = NoticeStatus.DELETE;
				break;
			default:
				delete updatedSearch.noticeStatus;
		}

		setNoticesInquiry({
			...noticesInquiry,
			page: 1,
			sort: 'createdAt',
			search: updatedSearch,
		});
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const searchTypeHandler = (newValue: string) => {
		setSearchType(newValue);

		let updatedSearch = { ...noticesInquiry.search };
		if (newValue !== 'ALL') {
			updatedSearch.noticeCategory = newValue as NoticeCategory;
		} else {
			delete updatedSearch.noticeCategory;
		}

		setNoticesInquiry({ ...noticesInquiry, search: updatedSearch });
	};

	const searchFieldHandler = (newValue: string) => {
		setSearchField(newValue);

		let updatedSearch = { ...noticesInquiry.search };
		if (newValue !== 'ALL') {
			updatedSearch.noticeField = newValue as NoticeField;
		} else {
			delete updatedSearch.noticeField;
		}

		setNoticesInquiry({ ...noticesInquiry, search: updatedSearch });
	};

	const updateArticleHandler = async (updateData: NoticeUpdate) => {
		try {
			await updateNotice({
				variables: {
					input: updateData,
				},
			});
			menuIconCloseHandler();
			getNoticesRefetch({ input: noticesInquiry });
		} catch (err) {
			console.error('Error updating notice:', err);
			sweetErrorHandling(err);
		}
	};

	const searchTextHandler = () => {
		setNoticesInquiry({
			...noticesInquiry,
			search: {
				...noticesInquiry.search,
				text: searchText,
			},
		});
	};

	return (
		<Box component="div" className="content">
			<Box component="div" className="title flex_space">
				<Typography variant="h2">FAQ Management</Typography>
				<Button className="btn_add" variant="contained" size="medium">
					<AddRoundedIcon sx={{ mr: '8px' }} />
					ADD
				</Button>
			</Box>
			<Box component="div" className="table-wrap">
				<TabContext value={value}>
					<Box component="div">
						<List className="tab-menu">
							{['ALL', 'ACTIVE', 'HOLD', 'DELETE'].map((status) => (
								<ListItem
									key={status}
									onClick={(e) => tabChangeHandler(e, status)}
									value={status}
									className={value === status ? 'li on' : 'li'}
								>
									{status}
								</ListItem>
							))}
						</List>
						<Divider sx={{ my: 2 }} />

						<Stack className="search-area" sx={{ m: '24px' }}>
							<OutlinedInput
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
								sx={{ width: '100%' }}
								placeholder="Search user name"
								onKeyDown={(e) => e.key === 'Enter' && searchTextHandler()}
								endAdornment={
									<>
										{searchText && (
											<CancelRoundedIcon
												style={{ cursor: 'pointer' }}
												onClick={() => {
													setSearchText('');
													searchTextHandler();
												}}
											/>
										)}
										<InputAdornment position="end" onClick={searchTextHandler}>
											<img src="/img/icons/search_icon.png" alt="searchIcon" style={{ cursor: 'pointer' }} />
										</InputAdornment>
									</>
								}
							/>
							<Stack direction="row" sx={{}}>
								<Select
									value={searchType}
									sx={{ width: '160px', mr: 2, ml: 2 }}
									onChange={(e) => searchTypeHandler(e.target.value)}
								>
									<MenuItem value="ALL">ALL</MenuItem>
									{Object.values(NoticeCategory).map((category) => (
										<MenuItem key={category} value={category}>
											{category}
										</MenuItem>
									))}
								</Select>
								<Select
									value={searchField}
									sx={{ width: '160px' }}
									onChange={(e) => searchFieldHandler(e.target.value)}
								>
									<MenuItem value="ALL">ALL</MenuItem>
									{Object.values(NoticeField).map((field) => (
										<MenuItem key={field} value={field}>
											{field}
										</MenuItem>
									))}
								</Select>
							</Stack>
						</Stack>
						<Divider sx={{ my: 2 }} />
					</Box>

					<FaqArticlesPanelList
						anchorEl={anchorEl}
						allNotices={allNotices}
						handleMenuIconClick={menuIconClickHandler}
						handleMenuIconClose={menuIconCloseHandler}
						updateArticleHandler={updateArticleHandler}
					/>

					<TablePagination
						rowsPerPageOptions={[10, 20, 40, 60]}
						component="div"
						count={total}
						rowsPerPage={noticesInquiry?.limit}
						page={noticesInquiry.page - 1}
						onPageChange={changePageHandler}
						onRowsPerPageChange={changeRowsPerPageHandler}
					/>
				</TabContext>
			</Box>
		</Box>
	);
};

FaqArticles.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(FaqArticles);
