import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import {
	Box,
	Button,
	TextField,
	Select,
	MenuItem,
	Typography,
	Stack,
	Grid,
	FormControl,
	InputLabel,
} from '@mui/material';
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
			router.push('/_admin/cs/faq');
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	}, [noticeData]);

	return (
		<Box component="div" className="content" sx={{ padding: 4, backgroundColor: '#f9f9f9' }}>
			<Grid container spacing={2}>
				{/* Title Section */}
				<Grid item xs={12}>
					<Box
						component="div"
						className="title"
						sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
					>
						<Typography variant="h4" sx={{ fontWeight: 'bold' }}>
							Create Notice
						</Typography>
						<Select
							label="Target Audience"
							value={noticeData.targetAudience}
							sx={{ width: 300, backgroundColor: '#fff', borderRadius: 1 }}
							onChange={(e) => handleInputChange('targetAudience', e.target.value)}
						>
							<MenuItem value="">None</MenuItem>
							{audiences.map((audience) => (
								<MenuItem key={audience} value={audience}>
									{audience}
								</MenuItem>
							))}
						</Select>
					</Box>
				</Grid>

				{/* Form Section */}
				<Grid item xs={12} md={8}>
					<Box
						component="div"
						className="form"
						sx={{ padding: 4, backgroundColor: '#fff', borderRadius: 2, boxShadow: 1 }}
					>
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
							<FormControl fullWidth sx={{ backgroundColor: '#fff' }}>
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

							<Select
								label="Field"
								value={noticeData.noticeField}
								fullWidth
								sx={{ backgroundColor: '#fff' }}
								onChange={(e) => handleInputChange('noticeField', e.target.value)}
							>
								<MenuItem value="">Select Field</MenuItem>
								{fields.map((field) => (
									<MenuItem key={field} value={field}>
										{field}
									</MenuItem>
								))}
							</Select>

							<Button
								variant="contained"
								color="primary"
								sx={{ paddingY: 1.5, fontWeight: 'bold', fontSize: '1rem' }}
								onClick={handleCreateNotice}
							>
								Create Notice
							</Button>
						</Stack>
					</Box>
				</Grid>

				{/* Optional Info Section */}
				<Grid item xs={12} md={4}>
					<Box
						component="div"
						className="info-box"
						sx={{
							padding: 3,
							backgroundColor: '#fff',
							borderRadius: 2,
							boxShadow: 1,
							display: 'flex',
							flexDirection: 'column',
							gap: 2,
						}}
					>
						<Typography variant="h6" sx={{ fontWeight: 'bold' }}>
							Quick Tips
						</Typography>
						<Typography variant="body2">
							Use clear and concise titles to make your notices easy to understand.
						</Typography>
						<Typography variant="body2">Target Audience is optional and can be left empty if not required.</Typography>
					</Box>
				</Grid>
			</Grid>
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
