import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import {
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	Stack,
	TextField,
	Typography,
	Container,
} from '@mui/material';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { T } from '../../libs/types/common';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Join: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const [input, setInput] = useState({
		firstName: '',
		lastName: '',
		nick: '',
		password: '',
		memberEmail: '',
		phone: '',
		type: 'USER',
	});
	const [loginView, setLoginView] = useState<boolean>(true);

	/** HANDLERS **/
	const viewChangeHandler = (state: boolean) => {
		setLoginView(state);
	};

	const handleInputChange = (name: string, value: any) => {
		setInput((prev) => ({ ...prev, [name]: value }));
	};

	const handleUserTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target;
		handleInputChange('type', checked ? name : 'USER');
	};

	const doLogin = useCallback(async () => {
		try {
			await logIn(input.nick, input.password);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input, router]);

	const doSignUp = useCallback(async () => {
		try {
			await signUp(
				input.firstName,
				input.lastName,
				input.nick,
				input.password,
				input.memberEmail,
				input.phone,
				input.type,
			);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input, router]);

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (e.key === 'Enter') {
				if (loginView) {
					doLogin();
				} else {
					doSignUp();
				}
			}
		},
		[doLogin, doSignUp, loginView],
	);
	if (device === 'mobile') {
		return <div>LOGIN MOBILE</div>;
	} else {
		return (
			<Container maxWidth="sm" className="join-page" sx={{ marginTop: 5 }}>
				<Box textAlign="center" mb={3}>
					<Typography variant="h4" gutterBottom>
						{loginView ? 'Welcome Back!' : 'Create Your Account'}
					</Typography>
					<Typography variant="body1">
						{loginView ? 'Please log in to continue.' : 'Sign up to get started.'}
					</Typography>
				</Box>
				<Stack onKeyPress={handleKeyPress} spacing={2} mt={2}>
					<TextField
						label="Nickname"
						variant="outlined"
						fullWidth
						onChange={(e) => handleInputChange('nick', e.target.value)}
						required
					/>
					<TextField
						label="Password"
						variant="outlined"
						type="password"
						fullWidth
						onChange={(e) => handleInputChange('password', e.target.value)}
						required
					/>
					{!loginView && (
						<>
							<TextField
								label="First Name"
								variant="outlined"
								fullWidth
								onChange={(e) => handleInputChange('firstName', e.target.value)}
								required
							/>
							<TextField
								label="Last Name"
								variant="outlined"
								fullWidth
								onChange={(e) => handleInputChange('lastName', e.target.value)}
								required
							/>
							<TextField
								label="Email"
								variant="outlined"
								type="email"
								fullWidth
								onChange={(e) => handleInputChange('memberEmail', e.target.value)}
								required
							/>
							<TextField
								label="Phone"
								variant="outlined"
								fullWidth
								onChange={(e) => handleInputChange('phone', e.target.value)}
								required
							/>
						</>
					)}
					{!loginView && (
						<FormGroup>
							<FormControlLabel
								control={
									<Checkbox size="small" name="USER" checked={input.type === 'USER'} onChange={handleUserTypeChange} />
								}
								label="User"
							/>
							<FormControlLabel
								control={
									<Checkbox
										size="small"
										name="AGENT"
										checked={input.type === 'AGENT'}
										onChange={handleUserTypeChange}
									/>
								}
								label="Agent"
							/>
						</FormGroup>
					)}
					<Button
						variant="contained"
						color="primary"
						disabled={
							loginView ? input.nick === '' || input.password === '' : Object.values(input).some((val) => val === '')
						}
						onClick={loginView ? doLogin : doSignUp}
					>
						{loginView ? 'Login' : 'Sign Up'}
					</Button>
				</Stack>
				<Box textAlign="center" mt={2}>
					{loginView ? (
						<p onClick={() => viewChangeHandler(false)}>
							Not registered yet? <span>Sign Up</span>
						</p>
					) : (
						<p onClick={() => viewChangeHandler(true)}>
							Have an account? <span>Login</span>
						</p>
					)}
				</Box>
			</Container>
		);
	}
};

export default withLayoutBasic(Join);
