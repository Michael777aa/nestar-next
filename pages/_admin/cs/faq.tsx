import React, { useEffect, useState } from 'react';
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
import { CREATE_NOTICE, UPDATE_NOTICE } from '../../../apollo/admin/mutation';
import { GET_ALL_NOTICES } from '../../../apollo/admin/query';
import { Notice, Notices } from '../../../libs/types/notice/notice';
import { NoticesInquiry } from '../../../libs/types/notice/notice.input';
import { NoticeCategory, NoticeStatus } from '../../../libs/enums/notice.enum';
import { NoticeUpdate } from '../../../libs/types/notice/notice.update';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';

const FaqArticles: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [noticesInquiry, setNoticesInquiry] = useState<NoticesInquiry>(initialInquiry);
	const [allNotices, setAllNotices] = useState<Notice[]>([]);
	const [value, setValue] = useState(
		noticesInquiry?.search?.noticeStatus ? noticesInquiry?.search?.noticeStatus : 'ALL',
	);
	const [searchText, setSearchText] = useState('');

	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/

	const [createNotice] = useMutation(CREATE_NOTICE);
	const [updateNotice] = useMutation(UPDATE_NOTICE);

	const {
		loading: getNoticesLoading,
		data: getNoticesData,
		error: getNoticesError,
		refetch: getNoticesRefetch,
	} = useQuery(GET_ALL_NOTICES, {
		fetchPolicy: 'network-only',
		variables: { input: noticesInquiry },
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
	const handleTabChange = async (event: any, newValue: string) => {
		setValue(newValue);

		setNoticesInquiry({ ...noticesInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setNoticesInquiry({ ...noticesInquiry, search: { noticeStatus: NoticeStatus.ACTIVE } });
				break;
			case 'ACTIVE':
				setNoticesInquiry({ ...noticesInquiry, search: { noticeStatus: NoticeStatus.HOLD } });
				break;
			case 'DELETE':
				setNoticesInquiry({ ...noticesInquiry, search: { noticeStatus: NoticeStatus.DELETE } });
				break;
			default:
				delete noticesInquiry?.search?.noticeStatus;
				setNoticesInquiry({ ...noticesInquiry });
				break;
		}
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
			console.log('+updateData: ', updateData);
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

	const removeArticleHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('are you sure to delete?')) {
				await updateNotice({
					variables: {
						input: id,
					},
				});
				await getNoticesRefetch({ input: noticesInquiry });
			}
		} catch (err: any) {
			sweetErrorHandling(err).then();
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
					<TabContext value={'value'}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={(e) => handleTabChange(e, 'all')}
									value="all"
									className={'all' === 'all' ? 'li on' : 'li'}
								>
									All (0)
								</ListItem>
								<ListItem
									onClick={(e) => handleTabChange(e, 'active')}
									value="active"
									className={'all' === 'all' ? 'li on' : 'li'}
								>
									Active (0)
								</ListItem>
								<ListItem
									onClick={(e) => handleTabChange(e, 'blocked')}
									value="blocked"
									className={'all' === 'all' ? 'li on' : 'li'}
								>
									Blocked (0)
								</ListItem>
								<ListItem
									onClick={(e) => handleTabChange(e, 'deleted')}
									value="deleted"
									className={'all' === 'all' ? 'li on' : 'li'}
								>
									Deleted (0)
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<Select sx={{ width: '160px', mr: '20px' }} value={'searchCategory'}>
									<MenuItem value={'mb_nick'}>mb_nick</MenuItem>
									<MenuItem value={'mb_id'}>mb_id</MenuItem>
								</Select>

								<OutlinedInput
									value={'searchInput'}
									// onChange={(e) => searchTextHandler(e.target.value)}
									sx={{ width: '100%' }}
									className={'search'}
									placeholder="Search user name"
									onKeyDown={(event) => {
										// if (event.key == 'Enter') searchTargetHandler().then();
									}}
									endAdornment={
										<>
											{true && <CancelRoundedIcon onClick={() => {}} />}
											<InputAdornment position="end" onClick={() => {}}>
												<img src="/img/icons/search_icon.png" alt={'searchIcon'} />
											</InputAdornment>
										</>
									}
								/>
							</Stack>
							<Divider />
						</Box>
						<FaqArticlesPanelList
							// dense={dense}
							// membersData={membersData}
							// searchMembers={searchMembers}
							anchorEl={anchorEl}
							// handleMenuIconClick={handleMenuIconClick}
							// handleMenuIconClose={handleMenuIconClose}
							// generateMentorTypeHandle={generateMentorTypeHandle}
						/>

						<TablePagination
							rowsPerPageOptions={[20, 40, 60]}
							component="div"
							count={4}
							rowsPerPage={10}
							page={1}
							onPageChange={() => {}}
							onRowsPerPageChange={() => {}}
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
