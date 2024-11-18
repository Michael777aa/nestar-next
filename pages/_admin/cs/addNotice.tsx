import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/router';

import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Stack } from '@mui/material';
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
	const [categories] = useState<NoticeCategory[]>(Object.values(NoticeCategory));
	const [fields] = useState<NoticeField[]>(Object.values(NoticeField));
	const [audiences] = useState<MemberType[]>(Object.values(MemberType));

	const [createNotice] = useMutation(CREATE_NOTICE);

	/** Handlers **/
	const handleInputChange = (key: keyof NoticeInput, value: any) => {
		setNoticeData((prev) => ({ ...prev, [key]: value }));
	};

	const handleCreateNotice = useCallback(async () => {
		try {
			// Construct the payload conditionally
			const { targetAudience, ...rest } = noticeData;
			const noticePayload = targetAudience
				? { ...rest, targetAudience } // Include `targetAudience` only if it exists
				: { ...rest };

			await createNotice({
				variables: { input: noticePayload },
			});

			await sweetMixinSuccessAlert('Notice created successfully!');

			// Reset form fields
			setNoticeData({
				noticeTitle: '',
				noticeField: '',
				noticeCategory: '',
				noticeStatus: NoticeStatus.ACTIVE,
				noticeContent: '',
				targetAudience: '',
			});
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	}, [noticeData]);

	return (
		<Box component="div" sx={{ p: 4, bgcolor: '#f9f9f9', borderRadius: 2 }}>
			<Box component="div" sx={{ mb: 4 }}>
				<Typography variant="h4" fontWeight="bold">
					Create Notice
				</Typography>
				<Typography variant="subtitle1" color="textSecondary">
					Fill in the details to create a new notice.
				</Typography>
			</Box>

			<Box component="div" sx={{ bgcolor: '#fff', p: 4, borderRadius: 2, boxShadow: 2 }}>
				<Stack spacing={4}>
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

					<FormControl fullWidth>
						<InputLabel id="category-label">Category</InputLabel>
						<Select
							labelId="category-label"
							value={noticeData.noticeCategory}
							onChange={(e) => handleInputChange('noticeCategory', e.target.value)}
						>
							{categories.map((category) => (
								<MenuItem key={category} value={category}>
									{category}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl fullWidth>
						<InputLabel id="field-label">Field</InputLabel>
						<Select
							labelId="field-label"
							value={noticeData.noticeField}
							onChange={(e) => handleInputChange('noticeField', e.target.value)}
						>
							{fields.map((field) => (
								<MenuItem key={field} value={field}>
									{field}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl fullWidth>
						<InputLabel id="audience-label">Target Audience (Optional)</InputLabel>
						<Select
							labelId="audience-label"
							value={noticeData.targetAudience || ''}
							onChange={(e) => handleInputChange('targetAudience', e.target.value)}
						>
							<MenuItem value="">
								<em>None</em>
							</MenuItem>
							{audiences.map((audience) => (
								<MenuItem key={audience} value={audience}>
									{audience}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<Button
						variant="contained"
						color="primary"
						size="large"
						onClick={handleCreateNotice}
						sx={{ alignSelf: 'flex-start' }}
					>
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
