import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box, TextField, Drawer, IconButton, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import SearchIcon from '@mui/icons-material/Search';
import defaultUserImage from '/public/img/profile/defaultUser.svg';
import { GET_NOTIFICATIONS } from '../../apollo/user/query';
import { NotificationInquiry } from '../types/notifications/notifications';
import { Notification } from '../types/notifications/notifications';

const Top = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);
	const [colorChange, setColorChange] = useState(false);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
	let open = Boolean(anchorEl);
	const [bgColor, setBgColor] = useState<boolean>(false);
	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [isNotificationOpen, setIsNotificationOpen] = useState(false);
	const searchFilter: NotificationInquiry = {
		page: 1,
		limit: 10,
		search: {
			receiverId: user?._id || '', // Ensure you have a valid user ID
		},
	};

	const {
		loading: getNotificationsLoading,
		data: getNotificationsData,
		error: getNotificationsError,
		refetch: getNotificationsRefetch,
	} = useQuery(GET_NOTIFICATIONS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchFilter },
		onCompleted: (data) => {
			setNotifications(data?.getNotifications?.list || []);
		},
	});
	useEffect(() => {
		if (user?._id) {
			getNotificationsRefetch();
		} else {
			setNotifications([]); // Clear notifications when logged out
		}
	}, [user]);

	const toggleNotificationDrawer = (open: boolean) => {
		if (open && user?._id) {
			getNotificationsRefetch(); // Refetch notifications when opening the drawer
		}
		setIsNotificationOpen(open);
	};

	const handleSearch = () => {
		if (searchQuery) {
			router.push({
				pathname: '/property',
				query: { search: searchQuery },
			});
		}
	};

	const handlePasswordKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale'));
		}
	}, [router]);
	useEffect(() => {
		switch (router.pathname) {
			case '/property/detail':
				setBgColor(true);
				break;
			default:
				break;
		}
	}, [router]);
	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);
	useEffect(() => {
		if (user?._id) {
			getNotificationsRefetch(); // Fetch notifications when user logs in
		}
	}, [user]);
	/** HANDLERS **/

	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};

	const langClose = () => {
		setAnchorEl2(null);
	};

	const langChoice = useCallback(
		async (e: any) => {
			setLang(e.target.id);
			localStorage.setItem('locale', e.target.id);
			setAnchorEl2(null);
			await router.push(router.asPath, router.asPath, { locale: e.target.id });
		},
		[router],
	);

	const changeNavbarColor = () => {
		if (window.scrollY >= 50) {
			setColorChange(true);
		} else {
			setColorChange(false);
		}
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleHover = (event: any) => {
		if (anchorEl !== event.currentTarget) {
			setAnchorEl(event.currentTarget);
		} else {
			setAnchorEl(null);
		}
	};
	const StyledMenu = styled((props: MenuProps) => (
		<Menu
			elevation={0}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			{...props}
		/>
	))(({ theme }) => ({
		'& .MuiPaper-root': {
			top: '109px',
			padding: '10px',
			border: '1px solid black', // Fixed typo: '1spx' to '1px'
			marginTop: theme.spacing(1),
			minWidth: 160,
			color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
			backgroundColor: theme.palette.background.paper, // Set background color for the menu
			borderRadius: '0px', // Rounded corners
			boxShadow: `rgb(255, 255, 255) 0px 0px 0px 0px,
				rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
				rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
				rgba(0, 0, 0, 0.05) 0px 4px 6px -2px`,
			'& .MuiMenu-list': {
				padding: '4px 0',
			},
			'& .MuiMenuItem-root': {
				borderRadius: '0px', // Rounded corners for menu items
				'&:hover': {
					backgroundColor: alpha(theme.palette.primary.main, 0.1), // Light background on hover
				},
				'&:active': {
					backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
				},
				'& .MuiSvgIcon-root': {
					fontSize: 15,
					color: theme.palette.text.secondary,
					marginRight: theme.spacing(1.5),
				},
				// Improved Typography
				'& span': {
					fontWeight: 500, // Medium weight for better readability
					fontSize: '14px', // Adjust font size
				},
			},
		},
	}));

	const getLanguageLabel = (langCode: string | null) => {
		switch (langCode) {
			case 'en':
				return 'English';
			case 'kr':
				return 'Korean';
			case 'ru':
				return 'Russian';
			default:
				return 'English';
		}
	};

	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', changeNavbarColor);
	}

	if (device == 'mobile') {
		return (
			<Stack className={'top'}>
				<Link href={'/'}>
					<div>{t('Home')}</div>
				</Link>
				<Link href={'/property'}>
					<div>{t('Properties')}</div>
				</Link>
				<Link href={'/agent'}>
					<div> {t('Agents')} </div>
				</Link>
				<Link href={'/community?articleCategory=FREE'}>
					<div> {t('Community')} </div>
				</Link>
				<Link href={'/cs'}>
					<div> {t('CS')} </div>
				</Link>
			</Stack>
		);
	} else {
		return (
			<Stack className={'navbar'}>
				<Stack className={`navbar-main ${colorChange ? 'transparent' : ''} ${bgColor ? 'transparent' : ''}`}>
					<Stack className={'container'}>
						<Stack className={'navbar-top-menu'}>
							<Stack className={'left-top-menu'}>
								<a href="" className="icon">
									<InstagramIcon />
								</a>
								<a href="" className="icon">
									<YouTubeIcon />
								</a>
								<a href="" className="icon">
									<TelegramIcon />
								</a>
								<a href="" className="icon">
									<TwitterIcon />
								</a>
								<a href="" className="icon">
									<FacebookIcon />
								</a>
							</Stack>
							<Stack className={'right-top-menu'}>
								<Box component={'div'} className={'right-top-box'}>
									<Link href={'/about'} className={'link'}>
										<div>{t('About')} </div>
									</Link>
									<Link href={'/contact'} className={'link'}>
										<div> {t('Contact')} </div>
									</Link>
									<Link href={'/blog'} className={'link'}>
										<div> {t('Blog')} </div>
									</Link>
									<Link href={'/cs'} className={'link'}>
										<div> {t('Cs')} </div>
									</Link>
									<Stack className={'lan-box'}>
										<Button
											disableRipple
											className="btn-lang"
											onClick={langClick}
											endIcon={<CaretDown size={10} color="#000000" weight="fill" />}
										>
											<Box component={'div'} className={'flag'}>
												{lang !== null ? (
													<>
														<img src={`/img/flag/lang${lang}.png`} alt={'Flag'} />
														<span className={'language-label'} style={{ marginLeft: '8px' }}>
															{getLanguageLabel(lang)}
														</span>
													</>
												) : (
													<img src={`/img/flag/langen.png`} alt={'Flag'} />
												)}
											</Box>
										</Button>

										<StyledMenu
											anchorEl={anchorEl2}
											open={drop}
											onClose={langClose}
											sx={{
												position: 'absolute',
												display: 'flex',
												flexDirection: 'row',
												justifyContent: 'center',
												alignItems: 'center',
											}}
										>
											<MenuItem disableRipple onClick={langChoice} id="en">
												<img
													className="img-flag"
													src={'/img/flag/langen.png'}
													onClick={langChoice}
													id="en"
													alt={'usaFlag'}
												/>
												{t('English')}
											</MenuItem>
											<MenuItem disableRipple onClick={langChoice} id="kr">
												<img
													className="img-flag"
													src={'/img/flag/langkr.png'}
													onClick={langChoice}
													id="uz"
													alt={'koreanFlag'}
												/>
												{t('Korean')}
											</MenuItem>
											<MenuItem disableRipple onClick={langChoice} id="ru">
												<img
													className="img-flag"
													src={'/img/flag/langru.png'}
													onClick={langChoice}
													id="ru"
													alt={'russiaFlag'}
												/>
												{t('Russian')}
											</MenuItem>
										</StyledMenu>
									</Stack>
								</Box>
							</Stack>
						</Stack>
						{/* UPPER SIDE */}
						<Stack className={'navbar-middle-menu'}>
							<Stack className={'left-middle-menu'}>
								<Box component={'div'} className={'logo-box'}>
									<Link href={'/'} className={'entitlement'}>
										<h1>PlaySpot 🏟️</h1>
									</Link>
								</Box>
								<Box component={'div'} className={'router-box'}>
									<Link href={'/'}>
										<div>{t('Home')}</div>
									</Link>
									<Link href={'/property'}>
										<div>{t('Book')}</div>
									</Link>
									<Link href={'/agent'}>
										<div> {t('Managers')} </div>
									</Link>
									<Link href={'/community?articleCategory=FREE'}>
										<div> {t('Community')} </div>
									</Link>
									{user?._id && (
										<Link href={'/mypage'}>
											<div> {t('My Page')} </div>
										</Link>
									)}
								</Box>
							</Stack>
							<Stack className={'right-middle-menu'}>
								<Stack className={'search-b'}>
									<input
										className={'search-buttton'}
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										placeholder="Search properties..."
										onKeyDown={handlePasswordKeyDown}
									/>
									<SearchIcon className={'search-buttton-inside'} onClick={handleSearch} />
								</Stack>
								<Stack className="right-login-and-notif">
									<Stack component="div" className="user-box">
										{user?._id ? (
											<>
												<div className="login-user" onClick={(event) => setLogoutAnchor(event.currentTarget)}>
													<img
														src={
															user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : `${defaultUserImage}`
														}
														alt="Profile"
													/>
												</div>
												<Menu
													id="basic-menu"
													anchorEl={logoutAnchor}
													open={logoutOpen}
													onClose={() => setLogoutAnchor(null)}
													sx={{ mt: '5px' }}
												>
													<MenuItem onClick={() => logOut()}>
														<Logout fontSize="small" style={{ color: 'blue', marginRight: '10px' }} />
														Logout
													</MenuItem>
												</Menu>
											</>
										) : (
											<Link href="/account/join">
												<div className="join-box">
													<AccountCircleIcon />
												</div>
											</Link>
										)}
									</Stack>
								</Stack>
								<Stack>
									<NotificationsOutlinedIcon
										style={{ position: 'absolute', right: 5, top: '16px' }}
										onClick={() => toggleNotificationDrawer(true)}
									/>
									<Drawer
										anchor="right"
										open={isNotificationOpen}
										onClose={() => toggleNotificationDrawer(false)}
										sx={{
											'& .MuiDrawer-paper': {
												width: '450px', // Set the width of the drawer
												padding: '16px', // Add padding
												backgroundColor: '#f9f9f9', // Background color
												boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', // Add shadow
												border: 'none', // Remove border
											},
										}}
									>
										<Stack>
											<h3 style={{ margin: '0 0 16px 0', fontWeight: 'bold', fontSize: '20px', color: '#333' }}>
												{t('Notifications')}
											</h3>
											{notifications.length === 0 && isNotificationOpen ? (
												<p style={{ color: '#888' }}>{t('No new notifications')}</p>
											) : (
												notifications.map((notification: Notification) => (
													<Box
														key={notification.receiverId}
														sx={{
															padding: '12px',
															marginBottom: '8px',
															border: '1px solid #ddd',
															borderRadius: '4px',
															backgroundColor: '#fff',
															boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
														}}
													>
														<MenuItem sx={{ justifyContent: 'space-between', padding: '0' }}>
															<Box sx={{ flexGrow: 1 }}>
																<h4 style={{ margin: '0', fontSize: '16px', color: '#333' }}>
																	{notification.notificationTitle}
																</h4>
																<p style={{ margin: '4px 0', color: '#555' }}>{notification.notificationDesc}</p>
															</Box>
															<span style={{ fontSize: '12px', color: '#aaa' }}>
																{new Date(notification.createdAt).toLocaleTimeString([], {
																	hour: '2-digit',
																	minute: '2-digit',
																})}
															</span>
														</MenuItem>
													</Box>
												))
											)}
										</Stack>
									</Drawer>
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withRouter(Top);
