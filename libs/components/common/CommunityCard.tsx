import React from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { BoardArticle } from '../../types/board-article/board-article';
import Moment from 'react-moment';
import { REACT_APP_API_URL } from '../../config';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { userVar } from '../../../apollo/store';
import { useReactiveVar } from '@apollo/client';

interface CommunityCardProps {
	boardArticle: BoardArticle;
	likeArticleHandler: any;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { boardArticle, likeArticleHandler } = props;
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const imagePath: string = boardArticle?.articleImage
		? `${REACT_APP_API_URL}/${boardArticle?.articleImage}`
		: '/img/community/communityImg.png';

	/** HANDLERS **/
	const chooseArticleHandler = (e: React.SyntheticEvent) => {
		router.push({
			pathname: '/community/detail',
			query: { articleCategory: boardArticle?.articleCategory, id: boardArticle?._id },
		});
	};

	return (
		<Stack
			sx={{
				width: 295,
				backgroundColor: '#fff',
				borderRadius: '12px',
				boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
				overflow: 'hidden',
				cursor: 'pointer',
				transition: 'transform 0.3s ease',
			}}
			onClick={chooseArticleHandler}
		>
			{/* Image Section */}
			<div
				style={{ position: 'relative' }}
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<img
					onClick={chooseArticleHandler}
					src={imagePath}
					alt="Community"
					style={{
						width: '100%',
						height: '200px',
						objectFit: 'cover',
					}}
				/>
				<IconButton
					onClick={(e: any) => likeArticleHandler(e, user, boardArticle?._id)}
					aria-label="Like this article"
					size="medium"
					sx={{
						position: 'absolute',
						right: '1rem',
						bottom: '-17px',
						backgroundColor: '#ff6b6b',
						color: '#fff',
						borderRadius: '50%',
						'&:hover': { backgroundColor: '#ff8787' },
					}}
				>
					{boardArticle?.meLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
				</IconButton>
			</div>

			{/* Content Section */}
			<Stack sx={{ padding: '16px', gap: '8px' }}>
				<Typography
					sx={{
						color: '#2E3A59',
						fontSize: '16px',
						fontWeight: '600',
					}}
				>
					{boardArticle?.articleTitle}
				</Typography>
				<Typography sx={{ color: '#6A737D', fontSize: '14px' }}>{boardArticle?.memberData?.memberNick}</Typography>
			</Stack>

			{/* Footer Section */}
			<Stack
				sx={{
					padding: '12px 16px',
					backgroundColor: '#f9f9fb',
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					fontSize: '14px',
					color: '#6A737D',
				}}
			>
				<Stack direction="row" alignItems="center" gap={1}>
					<RemoveRedEyeIcon sx={{ fontSize: '20px' }} />
					<Typography>{boardArticle?.articleViews} views</Typography>
				</Stack>
				<Moment format="MMM DD">{boardArticle?.createdAt}</Moment>
			</Stack>
		</Stack>
	);
};

export default CommunityCard;
