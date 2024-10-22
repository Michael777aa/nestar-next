// src/apiService.ts

export interface NewsArticle {
	title: string;
	urlToImage: string;
}

// Fetch latest news articles from NewsAPI
export const fetchLatestNews = async (): Promise<NewsArticle[]> => {
	const apiKey = '13712f8a3e4d4ae98529ad0c9ce1190e'; // Replace with your NewsAPI key
	const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);

	if (!response.ok) {
		throw new Error('Network response was not ok');
	}

	const data = await response.json();
	const articles = data.articles || [];

	// Map API articles to include internal images
	return articles.map((article: any, index: number) => ({
		title: article.title || 'No Title',
		// Placeholder image URL to be replaced by the Carousel component
		urlToImage: '',
	}));
};
