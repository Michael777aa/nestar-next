import React, { useEffect, useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { GET_ALL_EVENTS } from '../../../apollo/admin/query';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { EventInquiry } from '../../types/event/event.input';
import { GET_EVENTS } from '../../../apollo/user/query';
import { Event } from '../../types/event/event';
import { REACT_APP_API_URL } from '../../config';

const EventCard = ({ event }: { event: Event }) => {
	const device = useDeviceDetect();
	const event_image = `${REACT_APP_API_URL}/${event.eventImages[0]}`;

	if (device === 'mobile') {
		return <div>EVENT CARD</div>;
	} else {
		return (
			<Stack
				className="event-card"
				style={{
					backgroundImage: `url(${event_image})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				}}
			>
				<Box component={'div'} className={'info'}>
					<strong>{event?.eventLocation}</strong>
					<span>{event?.eventTopic}</span>
				</Box>
				<Box component={'div'} className={'more'}>
					<span>{event?.eventDesc}</span>
				</Box>
			</Stack>
		);
	}
};

const Events = ({ initialInquiry, ...props }: any) => {
	const [eventInquiry, setEventInquiry] = useState<EventInquiry>(initialInquiry);
	const device = useDeviceDetect();
	const [allEvents, setAllEvents] = useState<Event[]>([]);

	const {
		loading: getEventsLoading,
		data: getEventsData,
		error: getEventsError,
		refetch: getEventsRefetch,
	} = useQuery(GET_EVENTS, {
		fetchPolicy: 'network-only',
		variables: { input: eventInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAllEvents(data?.getEvents?.list || []);
		},
	});

	useEffect(() => {
		getEventsRefetch({ input: eventInquiry });
	}, [eventInquiry]);

	if (device === 'mobile') {
		return <div>EVENT CARD</div>;
	} else {
		return (
			<Stack className={'events'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span className={'white'}>Events</span>
						</Box>
					</Stack>
					<Stack className={'card-wrapper'}>
						{getEventsLoading ? (
							<Typography variant="h6" align="center">
								Loading events...
							</Typography>
						) : allEvents.length === 0 ? (
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									position: 'relative',
									left: '180px',
									width: '900px',
									backgroundColor: '#f5f5f5',
									borderRadius: 2,
									boxShadow: 2,
									padding: 3,
									textAlign: 'center',
								}}
							>
								<Typography
									variant="h4"
									sx={{
										color: '#555',
										fontWeight: 'bold',
										marginBottom: 2,
									}}
								>
									No Events Available
								</Typography>
								<Typography
									variant="body1"
									sx={{
										color: '#888',
									}}
								>
									Please check back later for updates on events.
								</Typography>
							</Box>
						) : (
							allEvents.map((event: Event) => <EventCard event={event} key={event?.eventName} />)
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

Events.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			eventStatus: 'ACTIVE',
		},
	},
};

export default Events;
