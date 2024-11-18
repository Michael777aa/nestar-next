import React, { useState } from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography } from '@mui/material';
import CommunityCard from './CommunityCard';
import { BoardArticle } from '../../types/board-article/board-article';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';

const CommunityBoards = () => {
	const device = useDeviceDetect();
	const [searchCommunity, setSearchCommunity] = useState({
		page: 1,
		limit: 12,
		sort: 'articleViews',
		direction: 'DESC',
		search: {},
	});

	const [newsArticles, setNewsArticles] = useState<BoardArticle[]>([]);
	const [freeArticles, setFreeArticles] = useState<BoardArticle[]>([]);

	const [humorArticles, setHumorArticles] = useState<BoardArticle[]>([]);
	const [recommendedArticles, setRecommendedArticles] = useState<BoardArticle[]>([]);

	const {
		loading: getBoardsLoading,
		data: getAgentsData,
		error: getAgentsError,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchCommunity },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
			const articles = data?.getBoardArticles?.list || [];
			console.log(
				'Categories in fetched data:',
				articles.map((article: T) => article.articleCategory),
			);

			setNewsArticles(articles.filter((article: T) => article.articleCategory === 'NEWS').slice(0, 3));
			setHumorArticles(articles.filter((article: T) => article.articleCategory === 'HUMOR').slice(0, 3));
			setRecommendedArticles(articles.filter((article: T) => article.articleCategory === 'RECOMMEND').slice(0, 3));
			setFreeArticles(articles.filter((article: T) => article.articleCategory === 'FREE').slice(0, 3));
		},
	});

	if (getBoardsLoading) return <div>Loading...</div>;
	if (getAgentsError) return <div>Error loading community boards: {getAgentsError.message}</div>;

	if (device === 'mobile') {
		return <div>COMMUNITY BOARDS (MOBILE)</div>;
	} else {
		return (
			<Stack className="community-board">
				<Stack className="container">
					<Stack>
						<Typography variant="h1">COMMUNITY BOARD HIGHLIGHTS</Typography>
					</Stack>
					<Stack className="community-main">
						<Stack className="community-left">
							<Stack className="content-top">
								<Link href="/community?articleCategory=NEWS">
									<span>News</span>
								</Link>
								<img src="/img/icons/arrowBig.svg" alt="" />
							</Stack>
							<Stack className="card-wrap">
								{newsArticles.map((article, index) => (
									<CommunityCard vertical={true} article={article} index={index} key={article._id} />
								))}
							</Stack>
						</Stack>
						<Stack className="community-left">
							<Stack className="content-top">
								<Link href="/community?articleCategory=RECOMMEND">
									<span>Recommendation</span>
								</Link>
								<img src="/img/icons/arrowBig.svg" alt="" />
							</Stack>
							<Stack className="card-wrap">
								{recommendedArticles.map((article, index) => (
									<CommunityCard vertical={true} article={article} index={index} key={article._id} />
								))}
							</Stack>
						</Stack>
						<Stack className="community-left">
							<Stack className="content-top">
								<Link href="/community?articleCategory=HUMOR">
									<span>Humour</span>
								</Link>
								<img src="/img/icons/arrowBig.svg" alt="" />
							</Stack>
							<Stack className="card-wrap">
								{humorArticles.map((article, index) => (
									<CommunityCard vertical={true} article={article} index={index} key={article._id} />
								))}
							</Stack>
						</Stack>
						<Stack className="community-right">
							<Stack className="content-top">
								<Link href="/community?articleCategory=FREE">
									<span>Free</span>
								</Link>
								<img src="/img/icons/arrowBig.svg" alt="" />
							</Stack>
							<Stack className="card-wrap vertical">
								{freeArticles.map((article, index) => (
									<CommunityCard vertical={false} article={article} index={index} key={article._id} />
								))}
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default CommunityBoards;
