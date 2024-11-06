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
		: '/img/event.svg';

	if (!article) {
		return null; // Render nothing if the article data is missing
	}

	if (device === 'mobile') {
		return <div>COMMUNITY CARD (MOBILE)</div>;
	} else {
		return (
			<Link href={`/community/detail?articleCategory=${article.articleCategory}&id=${article._id}`} passHref>
				<Box component="div" className={vertical ? 'vertical-card' : 'horizontal-card'}>
					{vertical ? (
						<>
							<div className="community-img" style={{ backgroundImage: `url(${articleImage})` }}>
								<div>{index + 1}</div>
							</div>
							<strong>{article.articleTitle}</strong>
							<span>Free Board</span>
						</>
					) : (
						<>
							<img src={articleImage} alt={`${article.articleTitle} thumbnail`} />
							<div>
								<strong>{article.articleTitle}</strong>
								<span>
									<Moment format="DD.MM.YY">{article.createdAt}</Moment>
								</span>
							</div>
						</>
					)}
				</Box>
			</Link>
		);
	}
};

export default CommunityCard;
