import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box, Typography, Badge, Drawer, TableRow, TableCell, InputBase, IconButton } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import SearchIcon from '@mui/icons-material/Search';
import { GET_NOTIFICATIONS } from '../../apollo/user/query';
import { NotificationInquiry } from '../types/notifications/notifications';
import { Notification } from '../types/notifications/notifications';
import { NotificationStatus } from '../enums/notification.enum';
import { UPDATE_NOTIFICATION } from '../../apollo/user/mutation';
import { List, ListItem } from '@mui/material';
import { TabContext } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';
import { FacilitiesInquiry } from '../types/facility/facility.input';
import MenuIcon from '@mui/icons-material/Menu';
import { T } from '../types/common';
interface topFilter {
	initialInput: FacilitiesInquiry;
}
const Top = (props: topFilter) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);
	const [colorChange, setColorChange] = useState(false);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
	const [bgColor, setBgColor] = useState<boolean>(false);
	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);
	const [searchFiltere, setSearchFiltere] = useState<FacilitiesInquiry>(initialInput);
	const [isNotificationOpen, setIsNotificationOpen] = useState(false);
	const [unreadCount, setUnreadCount] = useState<number>(0);
	const [selectedLang, setSelectedLang] = useState('en'); // Default selected language
	const [isMenuDrawerOpen, setMenuDrawerOpen] = useState(false);
	const [isSearchDrawerOpen, setSearchDrawerOpen] = useState(false);
	// FOR MODILE
	const [isDrawerOpen, setDrawerOpen] = useState(false);

	const searchFilter: NotificationInquiry = {
		page: 1,
		limit: 500,
		search: {
			receiverId: user?._id || '', // Ensure you have a valid user ID
		},
	};
	const [updateNotification] = useMutation(UPDATE_NOTIFICATION);

	const { refetch: getNotificationsRefetch } = useQuery(GET_NOTIFICATIONS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchFilter },
		onCompleted: (data) => {
			const newNotifications = data?.getNotifications?.list || [];
			setNotifications(newNotifications);
			setUnreadCount(newNotifications.filter((n: any) => n.notificationStatus === NotificationStatus.WAIT).length);
		},
	});
	useEffect(() => {
		if (user?._id) {
			getNotificationsRefetch();
		} else {
			setNotifications([]); // Clear notifications when logged out
		}
	}, [user]);
	const toggleDrawer = () => {
		setDrawerOpen(!isDrawerOpen);
	};

	useEffect(() => {
		if (user?._id) {
			getNotificationsRefetch();
		} else {
			setNotifications([]);
		}
	}, [user]);

	const toggleNotificationDrawer = (open: boolean) => {
		if (open && user?._id) {
			getNotificationsRefetch(); // Ensure notifications are refreshed when opening
		}
		setIsNotificationOpen(open);
	};

	const updateNotifsHandler = async (notificationId: string) => {
		try {
			// Find the notification in the current state
			const notification = notifications.find((n) => n._id === notificationId);

			// Proceed only if the notification is not already read
			if (notification && notification.notificationStatus === NotificationStatus.WAIT) {
				const updateData = { _id: notificationId, notificationStatus: NotificationStatus.READ };

				// Call mutation to update the notification status
				const response = await updateNotification({
					variables: {
						input: updateData,
					},
				});

				if (response.data) {
					// Update the notification status locally without removing it from the list
					setNotifications((prevNotifications) =>
						prevNotifications.map((n) =>
							n._id === notificationId ? { ...n, notificationStatus: NotificationStatus.READ } : n,
						),
					);

					// Decrease the unread count by 1
					setUnreadCount((prev) => Math.max(prev - 1, 0));
				}
			}
		} catch (error) {
			console.error('Error updating notification:', error);
		}
	};

	// In the `useEffect`, ensure notifications are refetched when the user logs in or the drawer is opened
	useEffect(() => {
		if (user?._id) {
			getNotificationsRefetch(); // Fetch all notifications for the user
		} else {
			setNotifications([]); // Clear notifications when logged out
		}
	}, [user, isNotificationOpen]);

	const pushSearchHandler = async () => {
		try {
			if (searchFiltere?.search?.locationList?.length == 0) {
				delete searchFiltere.search.locationList;
			}

			if (searchFiltere?.search?.typeList?.length == 0) {
				delete searchFiltere.search.typeList;
			}

			await router.push(
				`/facility?input=${JSON.stringify(searchFiltere)}`,
				`/facility?input=${JSON.stringify(searchFiltere)}`,
			);
		} catch (err: any) {
			console.log('ERROR, pushSearchHandler:', err);
		}
	};
	const handlePasswordKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			pushSearchHandler();
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
			case '/facility/detail':
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

	const langChoicee = (e: T) => {
		const lang = e.currentTarget.id; // Get the ID of the selected language
		setLang(lang);
	};
	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};

	const langClose = () => {
		setAnchorEl2(null);
	};

	// const langChoice = useCallback(
	// 	async (e: any) => {
	// 		setLang(e.target.id);
	// 		localStorage.setItem('locale', e.target.id);
	// 		setAnchorEl2(null);
	// 		await router.push(router.asPath, router.asPath, { locale: e.target.id });
	// 	},
	// 	[router],
	// );
	// Corrected `langChoice` function
	const langChoice = useCallback(
		async (e: any) => {
			const langId = e.currentTarget.id; // Ensure `id` is correctly extracted
			setSelectedLang(langId); // Update the selected language in state
			localStorage.setItem('locale', langId); // Store the selected language in local storage

			// Close the drawer (if needed)
			setDrawerOpen(false);

			// Redirect to the current page with the new locale
			await router.push(router.asPath, router.asPath, { locale: langId });
		},
		[router],
	);

	// Ensure the `selectedLang` reflects the correct initial language on load
	useEffect(() => {
		const savedLang = localStorage.getItem('locale') || 'en'; // Default to 'en' if no language is stored
		setSelectedLang(savedLang);
	}, []);

	const changeNavbarColor = () => {
		if (window.scrollY >= 50) {
			setColorChange(true);
		} else {
			setColorChange(false);
		}
	};
	const toggleMenuDrawer = (state: any) => {
		setMenuDrawerOpen(state);
	};

	const toggleSearchDrawer = () => {
		setSearchDrawerOpen((prevState) => !prevState); // Toggle the drawer open/close
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
			<div className="top">
				<Stack className="left">
					<Stack className="left-main">
						<button className="left-icon" onClick={toggleDrawer}>
							{isDrawerOpen ? <CloseIcon /> : <MenuIcon />}
						</button>

						<Drawer
							anchor="left"
							open={isDrawerOpen}
							onClose={toggleDrawer}
							sx={{
								'& .MuiDrawer-paper': {
									width: '100%',
									padding: '20px',
									backgroundColor: '#ffffff',
								},
							}}
						>
							<Box>
								<Stack
									className="drawer-menu"
									sx={{
										display: 'flex',
										flexDirection: 'column',
										marginTop: '60px',
										gap: '15px',
									}}
								>
									<a href="/" onClick={toggleDrawer} style={{ fontSize: '1.2rem', color: '#333', cursor: 'pointer' }}>
										Home
									</a>
									<span style={{ width: '100%', height: '1px', backgroundColor: '#000000' }}></span>
									<a
										href="/facility"
										onClick={toggleDrawer}
										style={{ fontSize: '1.2rem', color: '#333', cursor: 'pointer' }}
									>
										Facilities
									</a>
									<span style={{ width: '100%', height: '1px', backgroundColor: '#000000' }}></span>

									<a
										href="/agent"
										onClick={toggleDrawer}
										style={{ fontSize: '1.2rem', color: '#333', cursor: 'pointer' }}
									>
										Agents
									</a>
									<span style={{ width: '100%', height: '1px', backgroundColor: '#000000' }}></span>

									<a
										href="/community?articleCategory=FREE"
										onClick={toggleDrawer}
										style={{ fontSize: '1.2rem', color: '#333', cursor: 'pointer' }}
									>
										Community
									</a>
									<span style={{ width: '100%', height: '1px', backgroundColor: '#000000' }}></span>

									<a href="/cs" onClick={toggleDrawer} style={{ fontSize: '1.2rem', color: '#333', cursor: 'pointer' }}>
										Customer Care
									</a>
									<span style={{ width: '100%', height: '1px', backgroundColor: '#000000' }}></span>
									{user?._id && (
										<Link href={'/mypage'}>
											<div onClick={toggleDrawer} style={{ fontSize: '1.2rem', color: '#333', cursor: 'pointer' }}>
												{' '}
												{t('My Profile')}{' '}
											</div>
											<span style={{ width: '100%', height: '1px', backgroundColor: '#000000' }}></span>
										</Link>
									)}
								</Stack>
								<Box className="lan-box">
									<List className="language-list" sx={{ display: 'flex', marginTop: '50px' }}>
										{/* English Option */}
										<ListItem
											id="en"
											className={`dropdown-item ${selectedLang === 'en' ? 'selected' : ''}`}
											onClick={langChoice}
											sx={{
												cursor: 'pointer',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												borderBottom: selectedLang === 'en' ? '2px solid red' : '2px solid transparent',
												padding: '10px 15px',
												transition: 'border-color 0.3s',
											}}
										>
											<img
												className="img-flag"
												src="/img/flag/langen.png"
												alt="usaFlag"
												style={{ width: '20px', marginRight: '8px' }}
											/>
											{t('English')}
										</ListItem>

										{/* Korean Option */}
										<ListItem
											id="kr"
											className={`dropdown-item ${selectedLang === 'kr' ? 'selected' : ''}`}
											onClick={langChoice}
											sx={{
												cursor: 'pointer',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												borderBottom: selectedLang === 'kr' ? '2px solid red' : '2px solid transparent',
												padding: '10px 15px',
												transition: 'border-color 0.3s',
											}}
										>
											<img
												className="img-flag"
												src="/img/flag/langkr.png"
												alt="koreanFlag"
												style={{ width: '20px', marginRight: '8px' }}
											/>
											{t('Korean')}
										</ListItem>

										{/* Russian Option */}
										<ListItem
											id="ru"
											className={`dropdown-item ${selectedLang === 'ru' ? 'selected' : ''}`}
											onClick={langChoice}
											sx={{
												cursor: 'pointer',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												borderBottom: selectedLang === 'ru' ? '2px solid red' : '2px solid transparent',
												padding: '10px 15px',
												transition: 'border-color 0.3s',
											}}
										>
											<img
												className="img-flag"
												src="/img/flag/langru.png"
												alt="russiaFlag"
												style={{ width: '20px', marginRight: '8px' }}
											/>
											{t('Russian')}
										</ListItem>
									</List>
								</Box>
							</Box>
						</Drawer>
						<Drawer
							anchor="top"
							open={isSearchDrawerOpen} // Drawer visibility depends on the state
							onClose={toggleSearchDrawer} // Close the drawer when clicking outside
							sx={{
								'& .MuiDrawer-paper': {
									width: '100%', // Full width drawer
									padding: '20px',
									backgroundColor: '#ffffff',
									position: 'relative',
									height: '100vh',
									top: '50px',
								},
							}}
						>
							<Box>
								<Stack direction="row" spacing={2} alignItems="center">
									<InputBase
										style={{
											border: '1px solid #ccc',
											borderRadius: '5px',
											padding: '5px 10px',
											flexGrow: 1,
										}}
										value={searchFiltere?.search?.text ?? ''}
										type="text"
										onChange={(e: any) => {
											setSearchFiltere({
												...searchFiltere,
												search: { ...searchFiltere.search, text: e.target.value },
											});
										}}
										placeholder="Search facilities..."
										onKeyDown={handlePasswordKeyDown}
									/>
									<IconButton onClick={pushSearchHandler} style={{ padding: '10px' }}>
										<SearchIcon />
									</IconButton>
								</Stack>
							</Box>
						</Drawer>
						{/* <MenuIcon className="left-icon" onClick={toggleDrawer} /> */}
						<IconButton
							className="search-buttton-inside"
							onClick={toggleSearchDrawer} // Toggle the drawer on button click
							style={{ padding: '10px' }}
						>
							{isSearchDrawerOpen ? <CloseIcon /> : <SearchIcon />} {/* Show X or search icon */}
						</IconButton>
						{/* Search Drawer */}
						<Drawer
							anchor="top"
							open={isSearchDrawerOpen} // Drawer visibility depends on the state
							onClose={toggleSearchDrawer} // Close the drawer when clicking outside
							sx={{
								'& .MuiDrawer-paper': {
									width: '100%', // Full width drawer
									padding: '20px',
									backgroundColor: '#ffffff',
									position: 'relative',
									height: '100vh',
									top: '50px',
								},
							}}
						>
							<Box>
								<Stack direction="row" spacing={2} alignItems="center">
									<InputBase
										style={{
											border: '1px solid #ccc',
											borderRadius: '5px',
											padding: '5px 10px',
											flexGrow: 1,
										}}
										value={searchFiltere?.search?.text ?? ''}
										type="text"
										onChange={(e: any) => {
											setSearchFiltere({
												...searchFiltere,
												search: { ...searchFiltere.search, text: e.target.value },
											});
										}}
										placeholder="Search facilities..."
										onKeyDown={handlePasswordKeyDown}
									/>
									<IconButton onClick={pushSearchHandler} style={{ padding: '10px' }}>
										<SearchIcon />
									</IconButton>
								</Stack>
							</Box>
						</Drawer>
					</Stack>
				</Stack>
				<Stack className="middle">PlaySpot 🏟️</Stack>
				<Stack className="right">
					<Link href="/account/join">
						<Stack
							component="div"
							className="user-box"
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								position: 'relative',
							}}
						>
							{user?._id ? (
								<>
									<div
										className="login-user"
										onClick={(event) => setLogoutAnchor(event.currentTarget)}
										style={{
											width: '40px',
											height: '40px',
											borderRadius: '50%',
											overflow: 'hidden',
											cursor: 'pointer',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
										}}
									>
										<img
											src={
												user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : `/img/profile/defaultUser.svg`
											}
											alt="User Profile"
											style={{
												width: '100%',
												height: '100%',
												objectFit: 'cover',
											}}
										/>
									</div>
									<Menu
										id="basic-menu"
										anchorEl={logoutAnchor}
										open={logoutOpen}
										onClose={() => setLogoutAnchor(null)}
										sx={{
											mt: '5px',
											'& .MuiMenu-paper': {
												minWidth: '150px',
												borderRadius: '8px',
												boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
											},
										}}
									>
										<MenuItem
											onClick={() => logOut()}
											sx={{
												display: 'flex',
												alignItems: 'center',
												gap: '10px',
												padding: '10px 16px',
												fontSize: '14px',
												fontWeight: '500',
												color: 'blue',
												'&:hover': {
													backgroundColor: '#f5f5f5',
												},
											}}
										>
											<Logout fontSize="small" />
											Logout
										</MenuItem>
									</Menu>
								</>
							) : (
								<Link href="/account/join" style={{ textDecoration: 'none' }}>
									<div
										className="join-box"
										style={{
											width: '40px',
											height: '40px',
											borderRadius: '50%',

											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											cursor: 'pointer',
										}}
									>
										<AccountCircleIcon fontSize="medium" />
									</div>
								</Link>
							)}
						</Stack>
					</Link>
					<Stack>
						<Badge badgeContent={notifications.length} color="secondary">
							<NotificationsOutlinedIcon
								onClick={() => toggleNotificationDrawer(!isNotificationOpen)}
								style={{ cursor: 'pointer', fontSize: '28px', position: 'relative', top: '6px' }}
							/>
						</Badge>

						<Drawer
							anchor="right"
							open={isNotificationOpen}
							onClose={() => toggleNotificationDrawer(false)}
							ModalProps={{
								onBackdropClick: () => toggleNotificationDrawer(false),
							}}
							sx={{
								'& .MuiDrawer-paper': {
									width: device === 'mobile' ? '100%' : '450px',
									padding: '20px',
									backgroundColor: '#ffffff',
									boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
									borderRadius: device === 'mobile' ? '0px' : '8px',
								},
							}}
						>
							{/* Notification Content */}
							<Stack spacing={2}>
								<Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
									{t('Notifications')}
								</Typography>
								{notifications.length === 0 ? (
									<Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', marginTop: '20px' }}>
										{t('No new notifications')}
									</Typography>
								) : (
									notifications.map((notification) => (
										<Box
											key={notification._id}
											sx={{
												position: 'relative',
												padding: '16px',
												border: '1px solid #ddd',
												borderRadius: '8px',
												marginBottom: '12px',
												boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
												transition: 'background-color 0.3s',
												'&:hover': {
													backgroundColor: '#f4f4f4',
												},
											}}
										>
											<MenuItem
												onClick={() => updateNotifsHandler(notification._id)}
												sx={{
													padding: '0',
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'flex-start',
												}}
											>
												{notification.notificationStatus === 'WAIT' && (
													<Box
														sx={{
															width: '10px',
															height: '10px',
															backgroundColor: 'green',
															borderRadius: '50%',
															position: 'absolute',
															top: '-8px',
															left: '-8px',
														}}
													/>
												)}
												<Box sx={{ width: '100%' }}>
													{notification.notificationName && (
														<Typography
															variant="body1"
															sx={{
																fontSize: '15px',
																fontWeight: '900',
																color: '#00000',
																marginBottom: '8px',
																wordBreak: 'break-word',
																whiteSpace: 'normal',
															}}
														>
															Name: {notification.notificationName}
														</Typography>
													)}
													<Typography
														variant="body1"
														sx={{
															fontSize: '17px',
															fontWeight: '700',
															color: '#00000',
															marginBottom: '8px',
															wordBreak: 'break-word',
															whiteSpace: 'normal',
														}}
													>
														{notification.notificationTitle}
													</Typography>
													<Typography
														sx={{
															fontSize: '14px',
															color: 'textSecondary',
															marginBottom: '8px',
															wordBreak: 'break-word',
															whiteSpace: 'normal',
														}}
														variant="body2"
													>
														{notification.notificationDesc}
													</Typography>
												</Box>
											</MenuItem>
										</Box>
									))
								)}
							</Stack>
						</Drawer>
					</Stack>
				</Stack>
			</div>
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

									<Link href={'/cs'} className={'link'}>
										<div> {t('Customer Care')} </div>
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

										<Menu
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
										</Menu>
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
									<Link href={'/facility'}>
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
										value={searchFiltere?.search?.text ?? ''}
										type="text"
										onChange={(e: any) => {
											setSearchFiltere({
												...searchFiltere,
												search: { ...searchFiltere.search, text: e.target.value },
											});
										}}
										placeholder="Search facilities..."
										onKeyDown={handlePasswordKeyDown}
									/>
									<SearchIcon className={'search-buttton-inside'} onClick={pushSearchHandler} />
								</Stack>
								<Stack className="right-login-and-notif">
									<Stack component="div" className="user-box">
										{user?._id ? (
											<>
												<div className="login-user" onClick={(event) => setLogoutAnchor(event.currentTarget)}>
													<img
														src={
															user?.memberImage
																? `${REACT_APP_API_URL}/${user?.memberImage}`
																: `/img/profile/defaultUser.svg`
														}
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
									<Badge badgeContent={unreadCount} color="secondary">
										<NotificationsOutlinedIcon
											onClick={() => toggleNotificationDrawer(true)}
											style={{ cursor: 'pointer', fontSize: '28px' }} // Increased icon size for better visibility
										/>
									</Badge>
									<Drawer
										anchor="right"
										open={isNotificationOpen}
										onClose={() => toggleNotificationDrawer(false)}
										sx={{
											'& .MuiDrawer-paper': {
												width: '450px',
												padding: '20px',
												backgroundColor: '#ffffff',
												boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
												borderRadius: '8px',
											},
										}}
									>
										<Stack spacing={2}>
											<Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
												{t('Notifications')}
											</Typography>
											{notifications.length === 0 ? (
												<Typography
													variant="body2"
													color="textSecondary"
													sx={{ textAlign: 'center', marginTop: '20px' }}
												>
													{t('No new notifications')}
												</Typography>
											) : (
												notifications.map((notification) => (
													<Box
														key={notification._id}
														sx={{
															position: 'relative',
															padding: '16px',
															border: '1px solid #ddd',
															borderRadius: '8px',
															marginBottom: '12px',
															boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
															transition: 'background-color 0.3s',
															'&:hover': {
																backgroundColor: '#f4f4f4',
															},
														}}
													>
														<MenuItem
															onClick={() => updateNotifsHandler(notification._id)}
															sx={{ padding: '0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
														>
															{notification.notificationStatus === NotificationStatus.WAIT && (
																<Box
																	sx={{
																		width: '10px',
																		height: '10px',
																		backgroundColor: 'green',
																		borderRadius: '50%',
																		position: 'absolute',
																		top: '-8px',
																		left: '-8px',
																	}}
																/>
															)}
															<Box sx={{ width: '100%' }}>
																{notification.notificationName && (
																	<Typography
																		variant="body1"
																		sx={{
																			fontSize: '15px',
																			fontWeight: '900',
																			color: '#00000',
																			marginBottom: '8px',
																			wordBreak: 'break-word',
																			whiteSpace: 'normal',
																		}}
																	>
																		Name: {notification.notificationName}
																	</Typography>
																)}

																{notification.notificationNumber && (
																	<Typography
																		variant="body1"
																		sx={{
																			fontSize: '14px',
																			fontWeight: '700',
																			color: '#00000',
																			marginBottom: '8px',
																			wordBreak: 'break-word',
																			whiteSpace: 'normal',
																		}}
																	>
																		Number: {notification.notificationNumber}
																	</Typography>
																)}

																{/* Always display the notification title */}
																<Typography
																	variant="body1"
																	sx={{
																		fontSize: '17px',
																		fontWeight: '700',
																		color: '#00000',
																		marginBottom: '8px',
																		wordBreak: 'break-word',
																		whiteSpace: 'normal',
																	}}
																>
																	{notification.notificationTitle}
																</Typography>

																{/* Display notification description */}
																<Typography
																	sx={{
																		fontSize: '14px',
																		color: 'textSecondary',
																		marginBottom: '8px',
																		wordBreak: 'break-word',
																		whiteSpace: 'normal',
																	}}
																	variant="body2"
																>
																	{notification.notificationDesc}
																</Typography>

																{/* Display the creation date of the notification */}
																<Typography
																	variant="caption"
																	sx={{
																		fontSize: '14px',
																		fontWeight: '700',
																		color: '#00000',
																		marginBottom: '8px',
																		wordBreak: 'break-word',
																		whiteSpace: 'normal',
																	}}
																>
																	{new Date(notification.createdAt).toLocaleString()}
																</Typography>
															</Box>
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
Top.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			squaresRange: {
				start: 0,
				end: 500,
			},
			pricesRange: {
				start: 0,
				end: 500000,
			},
		},
	},
};
export default Top;
