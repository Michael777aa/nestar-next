import React from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Box } from '@mui/material';
import Moment from 'react-moment';
import { BoardArticle } from '../../types/board-article/board-article';

interface CommunityCardProps {
	vertical: boolean;
	article: BoardArticle;
	index: number;
}

const CommunityCard = ({ vertical, article, index }: CommunityCardProps) => {
	const device = useDeviceDetect();
	const articleImage = article?.articleImage
		? `${process.env.REACT_APP_API_URL}/${article.articleImage}`
		: '/img/events/SPORTS.webp';

	if (!article) {
		return null;
	}

	if (device === 'mobile') {
		return <div>COMMUNITY CARD (MOBILE)</div>;
	} else {
		return (
			<Link href={`/community/detail?articleCategory=${article.articleCategory}&id=${article._id}`} passHref>
				<Box component="div" className={vertical ? 'vertical-card' : 'horizontal-card'}>
					{vertical ? (
						<>
							<div className="community-img" style={{ backgroundImage: `url(${articleImage})` }}></div>
							<strong>{article.articleTitle}</strong>

							<span className="time">
								<Moment format="DD.MM.YY">{article.createdAt}</Moment>
							</span>
						</>
					) : (
						<>
							<img src={articleImage} alt={`${article.articleTitle} thumbnail`} />

							<strong>{article.articleTitle}</strong>

							<span>
								<Moment format="DD.MM.YY">{article.createdAt}</Moment>
							</span>
						</>
					)}
				</Box>
			</Link>
		);
	}
};

export default CommunityCard;
