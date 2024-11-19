import React, { useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Button, Stack, Typography, TextField, Avatar, IconButton } from '@mui/material';
import axios from 'axios';
import { Messages, REACT_APP_API_URL } from '../../config';
import { getJwtToken, updateStorage, updateUserInfo } from '../../auth';
import { useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { MemberUpdate } from '../../types/member/member.update';
import { UPDATE_MEMBER } from '../../../apollo/user/mutation';
import { sweetErrorHandling, sweetMixinSuccessAlert } from '../../sweetAlert';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const MyProfile: NextPage = ({ initialValues, ...props }: any) => {
	const device = useDeviceDetect();
	const token = getJwtToken();
	const user = useReactiveVar(userVar);
	const [updateData, setUpdateData] = useState<MemberUpdate>(initialValues);

	/** APOLLO REQUESTS **/
	const [updateMember] = useMutation(UPDATE_MEMBER);

	/** LIFECYCLES **/
	useEffect(() => {
		setUpdateData({
			...updateData,
			memberFirstName: user.memberFirstName,
			memberLastName: user.memberLastName,
			memberEmail: user.memberEmail,
			memberNick: user.memberNick,
			memberPhone: user.memberPhone,
			memberAddress: user.memberAddress,
			memberImage: user.memberImage,
		});
	}, [user]);

	/** HANDLERS **/
	const uploadImage = async (e: any) => {
		try {
			const image = e.target.files[0];
			console.log('+image:', image);

			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
				  }`,
					variables: {
						file: null,
						target: 'member',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.file'],
				}),
			);
			formData.append('0', image);

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImage = response.data.data.imageUploader;
			console.log('+responseImage: ', responseImage);
			setUpdateData((prev) => ({ ...prev, memberImage: responseImage }));

			return `${REACT_APP_API_URL}/${responseImage}`;
		} catch (err) {
			console.log('Error, uploadImage:', err);
		}
	};

	const updateFacilityHandler = useCallback(async () => {
		try {
			if (!user._id) throw new Error(Messages.error2);
			updateData._id = user._id;
			const result = await updateMember({ variables: { input: updateData } });

			const jwtToken = result.data.updateMember?.accessToken;
			console.log('TOKENN', jwtToken);

			if (jwtToken) {
				await updateStorage({ jwtToken });
				updateUserInfo(result.data.updateMember?.accessToken);
				await sweetMixinSuccessAlert('Information updated successfully.');
			}
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	}, [updateData]);

	const doDisabledCheck = () => {
		return !(
			updateData.memberFirstName &&
			updateData.memberLastName &&
			updateData.memberNick &&
			updateData.memberPhone &&
			updateData.memberEmail &&
			updateData.memberAddress &&
			updateData.memberImage
		);
	};

	console.log('+updateData', updateData);

	if (device === 'mobile') {
		return <>MY PROFILE PAGE MOBILE</>;
	} else
		return (
			<div id="my-profile-page">
				<Stack spacing={4} padding={3}>
					<Typography variant="h4">My Profile</Typography>
					<Typography variant="subtitle1">We are glad to see you again!</Typography>

					<Stack direction="row" spacing={3} alignItems="center">
						<Avatar
							src={
								updateData?.memberImage
									? `${REACT_APP_API_URL}/${updateData?.memberImage}`
									: '/img/profile/defaultUser.svg'
							}
							sx={{ width: 100, height: 100 }}
						/>
						<label htmlFor="file-upload">
							<IconButton component="span">
								<PhotoCamera />
							</IconButton>
						</label>
						<input
							id="file-upload"
							type="file"
							hidden
							onChange={uploadImage}
							accept="image/jpg, image/jpeg, image/png"
						/>
						<Typography variant="body2">Upload Profile Image</Typography>
					</Stack>

					<Stack spacing={2}>
						<TextField
							label="First Name"
							value={updateData.memberFirstName}
							onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberFirstName: value })}
							fullWidth
						/>
						<TextField
							label="Last Name"
							value={updateData.memberLastName}
							onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberLastName: value })}
							fullWidth
						/>
						<TextField
							label="Email"
							type="email"
							value={updateData.memberEmail}
							onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberEmail: value })}
							fullWidth
						/>
						<TextField
							label="Username"
							value={updateData.memberNick}
							onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberNick: value })}
							fullWidth
						/>
						<TextField
							label="Phone"
							value={updateData.memberPhone}
							onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberPhone: value })}
							fullWidth
						/>
						<TextField
							label="Address"
							value={updateData.memberAddress}
							onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberAddress: value })}
							fullWidth
						/>
					</Stack>

					<Button variant="contained" onClick={updateFacilityHandler} disabled={doDisabledCheck()}>
						Update Profile
					</Button>
				</Stack>
			</div>
		);
};

MyProfile.defaultProps = {
	initialValues: {
		_id: '',
		memberImage: '',
		memberNick: '',
		memberPhone: '',
		memberAddress: '',
		memberFirstName: '',
		memberLastName: '',
		memberEmail: '',
	},
};

export default MyProfile;
