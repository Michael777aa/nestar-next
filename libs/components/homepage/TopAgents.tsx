import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box, Link } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopAgentCard from './TopAgentCard';
import { Member } from '../../types/member/member';
import { AgentsInquiry } from '../../types/member/member.input';
import { useQuery } from '@apollo/client';
import { GET_AGENTS } from '../../../apollo/user/query';
import { T } from '../../types/common';

interface TopAgentsProps {
	initialInput: AgentsInquiry;
	orderNumber: number;
}

const TopAgents = (props: TopAgentsProps) => {
	const { initialInput, orderNumber } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [topAgents, setTopAgents] = useState<Member[]>([]);

	/** APOLLO REQUESTS **/

	const {
		loading: getAgentsLoading,
		data: getAgentsData,
		error: getAgentsError,
		refetch: getAgentsRefetch,
	} = useQuery(GET_AGENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTopAgents(data?.getAgents?.list);
		},
	});
	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className={'top-agents'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Top Agents</span>
					</Stack>
					<Stack className={'wrapper'}>
						<Swiper
							className={'top-agents-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={29}
							modules={[Autoplay]}
						>
							{topAgents.map((agent: Member) => {
								return (
									<SwiperSlide className={'top-agents-slide'} key={agent?._id}>
										<TopAgentCard orderNumber={orderNumber} agent={agent} key={agent?.memberNick} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'top-agents'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Best Agents</span>
							<p>Our senior leadership is consistently at your service.</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<Link href={'/agent'}>
									<span>View All Agents</span>
								</Link>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className={'wrapper'}>
						<Box
							component={'div'}
							style={{ position: 'relative', right: 20 }}
							className={'switch-btn swiper-agents-prev'}
						>
							<ArrowBackIosNewIcon />
						</Box>
						<Box component={'div'} className={'card-wrapper'}>
							<Swiper
								className={'top-agents-swiper'}
								slidesPerView={'auto'}
								spaceBetween={29}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-agents-next',
									prevEl: '.swiper-agents-prev',
								}}
							>
								{topAgents.map((agent: Member, index: number) => {
									return (
										<SwiperSlide className="top-agents-slide" key={agent?._id}>
											{/* Pass the order number as a prop */}
											<TopAgentCard agent={agent} orderNumber={index + 1} key={agent?.memberNick} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						</Box>
						<Box
							component={'div'}
							className={'switch-btn swiper-agents-next lefsfdsd'}
							style={{ position: 'relative', left: 20 }}
						>
							<ArrowBackIosNewIcon />
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TopAgents.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'memberRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopAgents;
