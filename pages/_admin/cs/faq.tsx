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
import { CREATE_NOTICE, REMOVE_NOTICE, UPDATE_NOTICE } from '../../../apollo/admin/mutation';
import { GET_ALL_NOTICES } from '../../../apollo/admin/query';
import { Notice, Notices } from '../../../libs/types/notice/notice';
import { NoticesInquiry } from '../../../libs/types/notice/notice.input';
import { NoticeCategory, NoticeStatus } from '../../../libs/enums/notice.enum';
import { NoticeUpdate } from '../../../libs/types/notice/notice.update';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { T } from '../../../libs/types/common';

const FaqArticles: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [noticesInquiry, setNoticesInquiry] = useState<NoticesInquiry>(initialInquiry);
	const [allNotices, setAllNotices] = useState<Notice[]>([]);
	const [value, setValue] = useState(
		noticesInquiry?.search?.noticeStatus ? noticesInquiry?.search?.noticeStatus : 'ALL',
	);
	const [searchText, setSearchText] = useState('');
	const [total, setTotal] = useState<number>(0);

	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/

	const [createNotice] = useMutation(CREATE_NOTICE);
	const [updateNotice] = useMutation(UPDATE_NOTICE);
	const [removeNotice] = useMutation(REMOVE_NOTICE);

	const {
		loading: getNoticesLoading,
		data: getNoticesData,
		error: getNoticesError,
		refetch: getNoticesRefetch,
	} = useQuery(GET_ALL_NOTICES, {
		fetchPolicy: 'network-only',
		variables: { input: noticesInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAllNotices(data?.getNotices?.list);
			setTotal(data?.getNotices?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/

	useEffect(() => {
		getNoticesRefetch({ input: noticesInquiry });
	}, [noticesInquiry]);

	/** HANDLERS **/

	const changePageHandler = async (event: unknown, newPage: number) => {
		noticesInquiry.page = newPage + 1;
		await getNoticesRefetch({ input: noticesInquiry });
		setNoticesInquiry({ ...noticesInquiry });
	};
	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		noticesInquiry.limit = parseInt(event.target.value, 10);
		noticesInquiry.page = 1;
		await getNoticesRefetch({ input: noticesInquiry });
		setNoticesInquiry({ ...noticesInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};
	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);

			if (newValue !== 'ALL') {
				setNoticesInquiry({
					...noticesInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...noticesInquiry.search,
						noticeCategory: newValue as NoticeCategory,
					},
				});
			} else {
				delete noticesInquiry?.search?.noticeCategory;
				setNoticesInquiry({ ...noticesInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	const updateArticleHandler = async (updateData: NoticeUpdate) => {
		try {
			await updateNotice({
				variables: {
					input: updateData,
				},
			});

			menuIconCloseHandler();
			await getNoticesRefetch({ input: noticesInquiry });
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};
	const textHandler = useCallback((value: string) => {
		try {
			setSearchText(value);
		} catch (err: any) {
			console.log('textHandler: ', err.message);
		}
	}, []);
	const searchTextHandler = () => {
		try {
			setNoticesInquiry({
				...noticesInquiry,
				search: {
					...noticesInquiry.search,
					text: searchText,
				},
			});
		} catch (err: any) {
			console.log('searchTextHandler: ', err.message);
		}
	};

	return (
		// @ts-ignore
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Typography variant={'h2'}>FAQ Management</Typography>
				<Button
					className="btn_add"
					variant={'contained'}
					size={'medium'}
					// onClick={() => router.push(`/_admin/cs/faq_create`)}
				>
					<AddRoundedIcon sx={{ mr: '8px' }} />
					ADD
				</Button>
			</Box>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'}>
							{/* Category Selection */}
							<Select sx={{ width: '160px', ml: '20px' }} value={searchType}>
								<MenuItem value={'ALL'} onClick={() => searchTypeHandler('ALL')}>
									All
								</MenuItem>
								<MenuItem value={NoticeCategory.FAQ} onClick={() => searchTypeHandler(NoticeCategory.FAQ)}>
									FAQ
								</MenuItem>
								<MenuItem value={NoticeCategory.TERMS} onClick={() => searchTypeHandler(NoticeCategory.TERMS)}>
									TERMS
								</MenuItem>
								<MenuItem value={NoticeCategory.INQUIRY} onClick={() => searchTypeHandler(NoticeCategory.INQUIRY)}>
									INQUIRY
								</MenuItem>
							</Select>
							<Divider sx={{ my: 2 }} />

							{/* Search Bar */}
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<OutlinedInput
									value={searchText}
									onChange={(e) => textHandler(e.target.value)}
									sx={{ width: '100%' }}
									className={'search'}
									placeholder="Search user name"
									onKeyDown={(event) => {
										if (event.key === 'Enter') searchTextHandler();
									}}
									endAdornment={
										<>
											{/* Clear Search */}
											{searchText && (
												<CancelRoundedIcon
													style={{ cursor: 'pointer' }}
													onClick={async () => {
														setSearchText('');
														setNoticesInquiry({
															...noticesInquiry,
															search: {
																...noticesInquiry.search,
																text: '',
															},
														});
														await getNoticesRefetch({ input: noticesInquiry });
													}}
												/>
											)}

											<InputAdornment position="end" onClick={() => searchTextHandler()}>
												<img src="/img/icons/search_icon.png" alt={'searchIcon'} style={{ cursor: 'pointer' }} />
											</InputAdornment>
										</>
									}
								/>
							</Stack>
							<Divider sx={{ my: 2 }} />
						</Box>

						{/* Articles List */}
						<FaqArticlesPanelList
							anchorEl={anchorEl}
							allNotices={allNotices} // Use the actual state data
							handleMenuIconClick={menuIconClickHandler}
							handleMenuIconClose={menuIconCloseHandler}
							updateArticleHandler={updateArticleHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 50]}
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
