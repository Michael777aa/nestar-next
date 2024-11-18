import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import { Box, Button, TextField, Select, MenuItem, Typography, Stack } from '@mui/material';
import { useMutation } from '@apollo/client';
import { CREATE_NOTICE } from '../../../apollo/admin/mutation';
import { NoticeCategory, NoticeField, NoticeStatus } from '../../../libs/enums/notice.enum';
import { MemberType } from '../../../libs/enums/member.enum';
import { NoticeInput } from '../../../libs/types/notice/notice.input';
import { sweetErrorHandling, sweetMixinSuccessAlert } from '../../../libs/sweetAlert';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';

const AddNotice = ({ initialValues, ...props }: any) => {
	const router = useRouter();
	const [noticeData, setNoticeData] = useState<NoticeInput>(initialValues);
	const [categories, setCategories] = useState<NoticeCategory[]>(Object.values(NoticeCategory));
	const [fields, setFields] = useState<NoticeField[]>(Object.values(NoticeField));
	const [audiences, setAudiences] = useState<MemberType[]>(Object.values(MemberType));

	const [createNotice] = useMutation(CREATE_NOTICE);

	/** Handlers **/
	const handleInputChange = (key: keyof NoticeInput, value: any) => {
		setNoticeData((prev) => ({ ...prev, [key]: value }));
	};

	const handleCreateNotice = useCallback(async () => {
		try {
			await createNotice({
				variables: { input: noticeData },
			});
			await sweetMixinSuccessAlert('Notice created successfully!');
			router.push('/_admin/cs/notice');
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	}, [noticeData]);

	return (
		<Box component="div" className="content">
			<Box component="div" className="title flex_space">
				<Typography variant="h2">Create Notice</Typography>
			</Box>

			<Box component="div" className="form">
				<Stack spacing={3}>
					<TextField
						label="Title"
						variant="outlined"
						fullWidth
						value={noticeData.noticeTitle}
						onChange={(e) => handleInputChange('noticeTitle', e.target.value)}
					/>

					<TextField
						label="Content"
						variant="outlined"
						fullWidth
						multiline
						minRows={4}
						value={noticeData.noticeContent}
						onChange={(e) => handleInputChange('noticeContent', e.target.value)}
					/>

					<Select
						label="Category"
						value={noticeData.noticeCategory}
						fullWidth
						onChange={(e) => handleInputChange('noticeCategory', e.target.value)}
					>
						{categories.map((category) => (
							<MenuItem key={category} value={category}>
								{category}
							</MenuItem>
						))}
					</Select>

					<Select
						label="Field"
						value={noticeData.noticeField}
						fullWidth
						onChange={(e) => handleInputChange('noticeField', e.target.value)}
					>
						{fields.map((field) => (
							<MenuItem key={field} value={field}>
								{field}
							</MenuItem>
						))}
					</Select>

					<Select
						label="Target Audience"
						value={noticeData.targetAudience}
						fullWidth
						onChange={(e) => handleInputChange('targetAudience', e.target.value)}
					>
						{audiences.map((audience) => (
							<MenuItem key={audience} value={audience}>
								{audience}
							</MenuItem>
						))}
					</Select>

					<Select
						label="Status"
						value={noticeData.noticeStatus}
						fullWidth
						onChange={(e) => handleInputChange('noticeStatus', e.target.value)}
					>
						{Object.values(NoticeStatus).map((status) => (
							<MenuItem key={status} value={status}>
								{status}
							</MenuItem>
						))}
					</Select>

					<Button variant="contained" color="primary" onClick={handleCreateNotice}>
						Create Notice
					</Button>
				</Stack>
			</Box>
		</Box>
	);
};

AddNotice.defaultProps = {
	initialValues: {
		noticeTitle: '',
		noticeField: '',
		noticeCategory: '',
		noticeStatus: NoticeStatus.ACTIVE,
		noticeContent: '',
		targetAudience: '',
	},
};

export default withAdminLayout(AddNotice);
