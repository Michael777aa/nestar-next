import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack, Box, Modal, Divider, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { propertySquare, propertyYears } from '../../config';
import { PropertyLocation, PropertyType } from '../../enums/property.enum';
import { PropertiesInquiry } from '../../types/property/property.input';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const Entitlement = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>HEADER FILTER MOBILE</div>;
	} else {
		return (
			<>
				<Stack className={'entitlement-main'}>
					<h1>Rent Sports Facilities & Unique Experiences</h1>
					<p>
						Accompany us for a game-changing experience with PlaySpot, renting sports facilities like soccer fields,
						basketball courts, golf courses, and more has never been easier. Discover the perfect venue for your next
						match, training session, or sports event, all in one place. Let us take your sports experience to the next
						level.
					</p>
				</Stack>
			</>
		);
	}
};

export default Entitlement;
