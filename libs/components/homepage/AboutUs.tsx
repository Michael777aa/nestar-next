import React from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Button, Container, Stack, Typography } from '@mui/material';

const AboutUs = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>COMMUNITY BOARDS (MOBILE)</div>;
	} else {
		return (
			<Stack className={'about-us-main'}>
				<Container className="container">
					<Stack className={'about-us'}>
						<Stack className={'about-us-left'}>
							<img className={'about-us-left'} src="/img/about-us/sport-1-banner-4.jpg"></img>
						</Stack>
						<Stack className={'about-us-right'}>
							<h1>WE SUPPORT PASSIONS AND TRY TO HELP FUTURE ATHLETES</h1>
							<h3>Find out more about our activities</h3>
							<Stack className={'about-us-right-buttons'}>
								<Link href={'/about'}>
									<Button className={'button'}>About us</Button>
								</Link>
								<Link href={'/about'}>
									<Button className={'button'}>Our mission</Button>
								</Link>
							</Stack>
						</Stack>
					</Stack>
				</Container>
			</Stack>
		);
	}
};

export default AboutUs;
