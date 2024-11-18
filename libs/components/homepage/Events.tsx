import React, { useEffect, useState } from 'react';
import { Stack, Box } from '@mui/material';
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
						{allEvents.map((event: Event) => {
							return <EventCard event={event} key={event?.eventName} />;
						})}
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
