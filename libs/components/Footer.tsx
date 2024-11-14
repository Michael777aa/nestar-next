import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';

import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box, Container, Typography, Link, Input } from '@mui/material';
import moment from 'moment';
import styled from 'styled-components';
import { Button, TextField } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
	const device = useDeviceDetect();

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src="/img/logo/logoWhite.svg" alt="" className={'logo'} />
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>total free customer care</span>
							<p>+82 10 4867 2909</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>nee live</span>
							<p>+82 10 4867 2909</p>
							<span>Support?</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>follow us on social media</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>Popular Search</strong>
								<span>Property for Rent</span>
								<span>Property Low to hide</span>
							</div>
							<div>
								<strong>Quick Links</strong>
								<span>Terms of Use</span>
								<span>Privacy Policy</span>
								<span>Pricing Plans</span>
								<span>Our Services</span>
								<span>Contact Support</span>
								<span>FAQs</span>
							</div>
							<div>
								<strong>Discover</strong>
								<span>Seoul</span>
								<span>Gyeongido</span>
								<span>Busan</span>
								<span>Jejudo</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© Nestar - All rights reserved. Nestar {moment().year()}</span>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<div style={{ width: '100%', padding: '60px 0', backgroundColor: '#060f2b', color: '#fff' }}>
				<Container>
					<Stack
						className="main-upper-container"
						direction={{ xs: 'column', md: 'row' }}
						justifyContent="space-between"
						alignItems="center"
						spacing={4}
					>
						{/* Left Side */}
						<Stack className="left-side-up">
							<Typography variant="h4" className="left-entitle">
								PlaySpot
							</Typography>
							<Typography variant="subtitle1" className="left-topic">
								Best Deals
							</Typography>
						</Stack>

						{/* Middle Side (Search Box) */}
						<Stack className="middle-side-up" width={{ xs: '100%', md: '50%' }}>
							<Box className="search-box-main" display="flex" alignItems="center">
								<input
									style={{ borderRadius: '50px', backgroundColor: '#fff', width: '636px', height: '59px' }}
									placeholder="Enter your email"
									type="text"
								/>
								<Button className="search-icon">Subscribe </Button>
							</Box>
						</Stack>

						{/* Right Side (Icons) */}
						<Stack className="right-side-up" direction="row" justifyContent="center">
							<a href="" className="icon">
								<TwitterIcon />
							</a>

							<a href="" className="icon">
								<FacebookIcon />
							</a>

							<a href="" className="icon">
								<YouTubeIcon />
							</a>

							<a href="" className="icon">
								<LinkedInIcon />
							</a>
						</Stack>
					</Stack>

					{/* Divider Line */}
					<Box className="hover-linesss" borderBottom="1px solid #ffb514" />

					{/* Main Content */}
					<Stack
						className="middle-main-container"
						direction={{ xs: 'column', md: 'row' }}
						justifyContent="space-between"
						mt={4}
						spacing={4}
					>
						{/* Section 1 */}
						<Stack className="left-side1 same">
							<Typography variant="h1">Why People Like Us!</Typography>
							<Typography variant="h2" className="left-words">
								Renting sports facilities like soccer fields, basketball courts, golf courses, and more has never been
								easier. Best arenas are here.
							</Typography>
							<Button className="down-button">Read More</Button>
						</Stack>

						{/* Section 2 */}
						<Stack className="left-side2 same color-hover">
							<Typography variant="h1">About Us</Typography>

							<Link href={'/contact'} className="ssss">
								<Typography variant="h2">Contact Us</Typography>
							</Link>
							<Link href={'/cs'} className="ssss">
								<Typography variant="h2">Privacy Policy</Typography>
							</Link>
							<Link href={'/cs'} className="ssss">
								<Typography variant="h2">Terms & Condition</Typography>
							</Link>
							<Link href={'/cs'} className="ssss">
								<Typography variant="h2">Return Policy</Typography>
							</Link>
						</Stack>

						<Stack className="right-side1 color-hover same">
							<Link className="ssss">
								<Typography variant="h1">Account</Typography>
							</Link>

							<Link href={'/mypage'} className="ssss">
								<Typography variant="h2">My Account</Typography>
							</Link>

							<Link href={'/property'} className="ssss">
								<Typography variant="h2">Booking details</Typography>
							</Link>

							<Link href={'/mypage'} className="ssss">
								<Typography variant="h2">WishList</Typography>
							</Link>

							<Link href={'/mypage'} className="ssss">
								<Typography variant="h2">my profile </Typography>
							</Link>
						</Stack>

						<Stack className="right-side2 same">
							<Link className="ssss">
								<Typography variant="h1">Contact</Typography>
							</Link>
							<Typography
								variant="h2"
								component="a"
								href="https://maps.google.com/?q=1429 Netus Rd, NY 48247"
								sx={{
									textDecoration: 'none',
									fontWeight: '600',
									fontSize: '16px',
									color: '#ffffff80',
								}}
								target="_blank" // Open the link in a new tab
								rel="noopener noreferrer" // Security measure to prevent access from the new page to your app
							>
								Address: 1429 Netus Rd, NY 48247
							</Typography>

							<Typography
								className="emaillll"
								component="a"
								href="mailto:abdullah.just777@gmail.com"
								sx={{ fontWeight: '600', fontSize: '16px' }}
							>
								Email: abdullah.just777@gmail.com
							</Typography>

							<Typography
								className="emaillll22"
								variant="h2"
								component="a"
								href="tel:+821028771575"
								sx={{
									textDecoration: 'none',
									fontWeight: '600',
									fontSize: '16px',
									color: '#ffffff80',
								}}
							>
								Phone: +82 10 2877 1575
							</Typography>
							<Typography variant="h2" className="emaillll22234" mt={2}>
								Payment Accepted
							</Typography>
							<Box display="flex" gap={2} mt={4}>
								<img src="/img/footer/master-card.svg" alt="Visa" />
								<img src="/img/footer/paypal-card.svg" alt="Western Union" />
								<img src="/img/footer/visa-card.svg" alt="MasterCard" />
								<img src="/img/footer/western-card.svg" alt="PayPal" />
							</Box>
						</Stack>
					</Stack>
				</Container>
			</div>
		);
	}
};

export default Footer;
