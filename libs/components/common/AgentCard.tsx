import React, { useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box, Typography, Divider, Button } from '@mui/material';
import Link from 'next/link';
import { REACT_APP_API_URL } from '../../config';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Member } from '../../types/member/member';
import { useRouter } from 'next/router';
import { GET_MEMBER } from '../../../apollo/user/query';
import { T } from '../../types/common';

interface AgentCardProps {
	agent: any;
	likeMemberHandler: any;
	subscribeHandler: any;
	unsubscribeHandler: any;
}

const AgentCard = (props: AgentCardProps) => {
	const { agent, likeMemberHandler, subscribeHandler, unsubscribeHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();

	const user = useReactiveVar(userVar);
	const [member, setMember] = useState<Member | null>(null);
	const { memberId } = router.query;
	const {
		loading: getMemberLoading,
		data: getMemberData,
		error: getMemberError,
		refetch: getMemberRefetch,
	} = useQuery(GET_MEMBER, {
		fetchPolicy: 'network-only',
		variables: { input: agent._id },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMember(data?.getMember);
		},
	});
	const imagePath: string = agent?.memberImage
		? `${REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';

	if (device === 'mobile') {
		return <div>AGENT CARD</div>;
	} else {
		return (
			<Stack className="agent-general-card">
				<Link
					href={{
						pathname: '/agent/detail',
						query: { agentId: agent?._id },
					}}
				>
					<Box
						component={'div'}
						className={'agent-img'}
						style={{
							backgroundImage: `url(${imagePath})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							backgroundRepeat: 'no-repeat',
						}}
					></Box>
				</Link>
				<span className="special-agent">
					<span>Sport</span>
					<span>Facility</span>
					<span>Agent</span>
				</span>
				<div className="count-facilities">
					<span style={{ fontSize: '45px' }}>{agent?.memberProperties}</span>
					<span>sport</span>
					<span>arenas</span>
				</div>
				<span className="sport-facility">Sport Facility</span>
				<Divider style={{ position: 'relative', top: '-155px' }}></Divider>
				<Stack className={'agent-desc'}>
					<Box component={'div'} className={'agent-info'}>
						<Link
							href={{
								pathname: '/agent/detail',
								query: { agentId: 'id' },
							}}
						>
							<strong className="namee">{agent?.memberFirstName ?? agent?.memberNick}</strong>
						</Link>
					</Box>
					<Box component={'div'} className={'buttons'}>
						<IconButton style={{ color: '#fff' }}>
							<RemoveRedEyeIcon />
						</IconButton>
						<Typography className="view-cnt">{agent?.memberViews}</Typography>
						<IconButton style={{ color: '#fff' }} onClick={() => likeMemberHandler(user, agent?._id)}>
							{agent?.meLiked && agent?.meLiked[0]?.myFavorite ? (
								<FavoriteIcon color={'primary'} />
							) : (
								<FavoriteBorderIcon />
							)}
						</IconButton>
						<Typography className="view-cnt">{agent?.memberLikes}</Typography>
					</Box>
				</Stack>

				<Stack
					className="follow-button-box"
					direction="row"
					style={{ position: 'relative', top: '-120px', left: '80px' }}
					spacing={1}
					alignItems="center"
					justifyContent="center"
				>
					{member?.meFollowed && member?.meFollowed[0]?.myFollowing ? (
						<Button
							className="buttons"
							variant="contained"
							sx={{
								background: 'linear-gradient(135deg, #ff8a8a 0%, #e57373 100%)',
								color: '#fff',
								borderRadius: '50px',
								padding: '10px 20px',
								fontWeight: 'bold',
								fontSize: '14px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0px 6px 10px rgba(255, 90, 90, 0.4)',
							}}
							onClick={() => unsubscribeHandler(member?._id, getMemberRefetch, agent._id)}
						>
							<FavoriteIcon sx={{ marginRight: '5px', fontSize: '20px', color: '#fff' }} />
							Unfollow
						</Button>
					) : (
						<Button
							className="buttons"
							variant="contained"
							sx={{
								background: 'linear-gradient(135deg, #ff8f00 0%, #ff6f00 100%)',
								color: '#fff',
								borderRadius: '50px',
								padding: '10px 20px',
								fontWeight: 'bold',
								fontSize: '14px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0px 6px 10px rgba(255, 111, 0, 0.4)',
							}}
							onClick={() => subscribeHandler(member?._id, getMemberRefetch, agent._id)}
						>
							<FavoriteBorderIcon sx={{ marginRight: '5px', fontSize: '20px', color: '#fff' }} />
							Follow
						</Button>
					)}
				</Stack>
				{agent?.memberEmail && <strong className="namee3">email: {agent.memberEmail}</strong>}

				<strong className="namee2">address: {agent?.memberAddress ? agent.memberAddress : 'address not set'}</strong>
				<strong className="namee4">phone: {agent?.memberPhone}</strong>
			</Stack>
		);
	}
};

export default AgentCard;
