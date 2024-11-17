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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Notice } from '../../../types/notice/notice';
import { NoticeUpdate } from '../../../types/notice/notice.update';
import { NoticeStatus } from '../../../enums/notice.enum';

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
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-label="articles table">
					<TableHead>
						<TableRow>
							<TableCell align="left">Category</TableCell>
							<TableCell align="left">Title</TableCell>
							<TableCell align="left">Writer</TableCell>
							<TableCell align="left">Date</TableCell>
							<TableCell align="center">Status</TableCell>
							<TableCell align="center">Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{allNotices.map((notice, index) => (
							<TableRow hover key={notice._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
								<TableCell align="left">{notice.noticeCategory}</TableCell>
								<TableCell align="left">{notice.noticeTitle}</TableCell>
								<TableCell align="left">{notice._id || 'Unknown'}</TableCell>
								<TableCell align="left">{new Date(notice.createdAt).toLocaleDateString()}</TableCell>
								<TableCell align="center">
									{notice.noticeStatus === NoticeStatus.DELETE ? (
										<Button
											variant="outlined"
											color="error"
											sx={{ p: '3px', ':hover': { border: '1px solid #000000' } }}
										>
											<DeleteIcon fontSize="small" />
										</Button>
									) : (
										<>
											<Button
												onClick={(e) => handleMenuIconClick(e, index)}
												className={`badge ${notice.noticeStatus.toLowerCase()}`}
											>
												{notice.noticeStatus}
											</Button>
											<Menu
												anchorEl={anchorEl[index]}
												open={Boolean(anchorEl[index])}
												onClose={handleMenuIconClose}
												TransitionComponent={Fade}
												sx={{ p: 1 }}
											>
												{Object.values(NoticeStatus)
													.filter((status) => status !== notice.noticeStatus)
													.map((status) => (
														<MenuItem
															onClick={() =>
																updateArticleHandler({
																	_id: notice._id,
																	noticeStatus: status as NoticeStatus,
																})
															}
															key={status}
														>
															<Typography variant="subtitle1">{status}</Typography>
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
		</Stack>
	);
};
