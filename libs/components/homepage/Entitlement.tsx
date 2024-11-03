import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack, Box, Modal, Divider, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { rentSquare, propertyYears } from '../../config';
import { RentLocation, RentType } from '../../enums/property.enum';
import { RentsInquiry } from '../../types/property/property.input';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const Entitlement = () => {
	const device = useDeviceDetect();
	const { t, i18n } = useTranslation('common');
	if (device === 'mobile') {
		return <div>HEADER FILTER MOBILE</div>;
	} else {
		return (
			<>
				<Stack className="main-entit-container">
					<Stack className={'left-side'}>
						<h1>{t('Rent Sports Facilities & Unique Experiences')} </h1>
						<p>
							{t(
								'Accompany us for a game-changing experience with PlaySpot. Renting sports facilities like soccer fields, basketball courts, golf courses, and more has never been easier. Discover the perfect venue for your next match, training session, or sports event, all in one place. Let us take your sports experience to the next level.',
							)}
						</p>
					</Stack>
					<Stack className="right-side">
						<Stack>
							<img src="/img/header/2024-10-30 20.18.44.jpg" alt="" />

							<img src="/img/header/2024-10-30 20.18.47.jpg" alt="" />
						</Stack>
						<Stack>
							<img src="/img/header/2024-10-30 20.18.08.jpg" alt="" />
							<img src="/img/header/2024-10-30 20.18.51.jpg" alt="" />
						</Stack>
					</Stack>
				</Stack>
			</>
		);
	}
};

export default Entitlement;
