import React from 'react';
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
	Typography,
	Stack,
	Box,
	Link,
	IconButton,
	Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Notice } from '../../../types/notice/notice';
import { NoticeUpdate } from '../../../types/notice/notice.update';
import { NoticeStatus } from '../../../enums/notice.enum';
import OpenInBrowserRoundedIcon from '@mui/icons-material/OpenInBrowserRounded';
import Moment from 'react-moment';

interface Data {
	category: string;
	title: string;
	writer: string;
	register: string;
	view: number;
	like: number;
	status: string;
	article_id: string;
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'article_id',
		numeric: true,
		disablePadding: false,
		label: 'Notice ID',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'TITLE',
	},
	{
		id: 'category',
		numeric: true,
		disablePadding: false,
		label: 'CATEGORY',
	},

	{
		id: 'register',
		numeric: true,
		disablePadding: false,
		label: 'REGISTER DATE',
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
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
export interface FaqArticlesPanelListType {
	allNotices: Notice[];
	anchorEl: any;
	handleMenuIconClick: any;
	handleMenuIconClose: any;
	updateArticleHandler: any;
}

export const FaqArticlesPanelList = (props: FaqArticlesPanelListType) => {
	const { allNotices, anchorEl, handleMenuIconClick, handleMenuIconClose, updateArticleHandler } = props;
	return (
		<TableContainer>
			<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
				{/*@ts-ignore*/}
				<EnhancedTableHead />
				<TableBody>
					{allNotices.length === 0 && (
						<TableRow>
							<TableCell align="center" colSpan={8}>
								<span className={'no-data'}>data not found!</span>
							</TableCell>
						</TableRow>
					)}

					{allNotices.length !== 0 &&
						allNotices.map((notice: Notice, index: number) => (
							<TableRow hover key={notice._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
								<TableCell align="left">{notice._id}</TableCell>
								<TableCell align="left">
									<Box component={'div'}>
										{notice.noticeTitle}
										{notice.noticeStatus === NoticeStatus.ACTIVE && (
											<Link
												href={`/community/detail?articleCategory=${notice.noticeCategory}&id=${notice._id}`}
												className={'img_box'}
											>
												<IconButton className="btn_window">
													<Tooltip title={'Open window'}>
														<OpenInBrowserRoundedIcon />
													</Tooltip>
												</IconButton>
											</Link>
										)}
									</Box>
								</TableCell>
								<TableCell align="left">{notice.noticeCategory}</TableCell>

								<TableCell align="left">
									<Moment format={'DD.MM.YY HH:mm'}>{notice?.createdAt}</Moment>
								</TableCell>
								<TableCell align="center">
									{notice.noticeStatus === NoticeStatus.DELETE ? (
										<Button
											variant="outlined"
											sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000000' } }}
											// onClick={() => removeArticleHandler(notice._id)}
										>
											<DeleteIcon fontSize="small" />
										</Button>
									) : (
										<>
											<Button onClick={(e: any) => handleMenuIconClick(e, index)} className={'badge success'}>
												{notice.noticeStatus}
											</Button>

											<Menu
												className={'menu-modal'}
												MenuListProps={{
													'aria-labelledby': 'fade-button',
												}}
												anchorEl={anchorEl[index]}
												open={Boolean(anchorEl[index])}
												onClose={handleMenuIconClose}
												TransitionComponent={Fade}
												sx={{ p: 1 }}
											>
												{Object.values(NoticeStatus)
													.filter((ele) => ele !== notice.noticeStatus)
													.map((status: string) => (
														<MenuItem
															onClick={() => updateArticleHandler({ _id: notice._id, noticeStatus: status })}
															key={status}
														>
															<Typography variant={'subtitle1'} component={'span'}>
																{status}
															</Typography>
														</MenuItem>
													))}
											</Menu>
										</>
									)}
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};
