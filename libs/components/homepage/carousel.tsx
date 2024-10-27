// src/Carousel.tsx

import React, { useState, useEffect } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { fetchLatestNews, NewsArticle } from './apiService';

interface CarouselProps {
	autoPlayInterval?: number;
}

const Carousel: React.FC<CarouselProps> = ({ autoPlayInterval = 5000 }) => {
	const [items, setItems] = useState<NewsArticle[]>([]);
	const [activeIndex, setActiveIndex] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchLatestNews();
				setItems(data);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, []);

	const maxIndex = items.length - 1;

	const handleNext = () => {
		setActiveIndex((prevIndex) => (prevIndex < maxIndex ? prevIndex + 1 : 0));
	};

	const handlePrev = () => {
		setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : maxIndex));
	};

	useEffect(() => {
		if (items.length === 0) return;

		const intervalId = setInterval(handleNext, autoPlayInterval);
		return () => clearInterval(intervalId);
	}, [activeIndex, autoPlayInterval, items.length]);

	if (items.length === 0) {
		return (
			<Box
				sx={{
					width: '502px',
					height: '321px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Typography variant="caption">Loading...</Typography>
			</Box>
		);
	}

	// Use internal images as fallback
	const fallbackImages = [
		'/img/carousel/istockphoto-671217268-612x612.jpg',
		'/img/carousel/photo-1531124042451-f3ba1765072c.avif',
		'/img/carousel/istockphoto-654106834-612x612.webp',
		'/img/carousel/premium_photo-1687862745559-d6019959d481.avif',
		'/img/carousel/istockphoto-2161300392-612x612.webp',

		// Ensure these paths are correct
	];

	return (
		<Box
			sx={{
				width: '502px',
				height: '321px',
				position: 'absolute',
				top: '28px',
				left: '790px',
				overflow: 'hidden',
				borderRadius: '10px',
				boxShadow: 3,
			}}
		>
			<Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
				<Box
					component="img"
					sx={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						display: 'block',
					}}
					src={items[activeIndex].urlToImage || fallbackImages[activeIndex % fallbackImages.length]}
					alt={items[activeIndex].title}
					onError={(e: any) => {
						e.target.src = fallbackImages[activeIndex % fallbackImages.length];
					}}
				/>
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
					}}
				/>
			</Box>
			<Typography
				variant="caption"
				sx={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
					padding: 1,
					backgroundColor: '#fff', // Optional: semi-transparent background for text
					color: 'rgba(0, 0, 0, 0.85)',
					textAlign: 'center',
					fontSize: '15px',
					fontWeight: 'bold',
				}}
			>
				{items[activeIndex].title}
			</Typography>
			<Button
				onClick={handlePrev}
				sx={{
					position: 'absolute',
					top: '50%',
					left: 10,
					transform: 'translateY(-50%)',
					color: 'white',
					backgroundColor: 'rgba(0, 0, 0, 0.5)',
					borderRadius: '50%',
					minWidth: 'auto',
					padding: 1,
					'&:hover': {
						backgroundColor: 'rgba(0, 0, 0, 0.7)',
					},
				}}
			>
				<KeyboardArrowLeft />
			</Button>
			<Button
				onClick={handleNext}
				sx={{
					position: 'absolute',
					top: '50%',
					right: 10,
					transform: 'translateY(-50%)',
					color: 'white',
					backgroundColor: 'rgba(0, 0, 0, 0.5)',
					borderRadius: '50%',
					minWidth: 'auto',
					padding: 1,
					'&:hover': {
						backgroundColor: 'rgba(0, 0, 0, 0.7)',
					},
				}}
			>
				<KeyboardArrowRight />
			</Button>
		</Box>
	);
};

export default Carousel;
