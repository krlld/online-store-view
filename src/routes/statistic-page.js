import { Typography } from 'antd';
import axios from 'axios';
import Navbar from '../navbar';
import { useEffect, useState } from 'react';
import { config } from '../utils/get-axios-config';

const { Title } = Typography;

const StatisticPage = () => {
	const [imageUrl, setImageUrl] = useState('');

	useEffect(() => {
		const fetchImage = async () => {
			try {
				const xhr = new XMLHttpRequest();
				xhr.responseType = 'blob'; //so you can access the response like a normal URL
				xhr.onreadystatechange = function () {
					if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
						const img = document.getElementById('image1');
						img.src = URL.createObjectURL(xhr.response); //create <img> with src set to the blob
					}
				};
				xhr.open('GET', 'http://localhost:8080/api/v1/statistics/categories-revenue', true);
				xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
				xhr.send();
			} catch (error) {
				console.error('Ошибка при получении изображения:', error);
			}
			try {
				const xhr = new XMLHttpRequest();
				xhr.responseType = 'blob'; //so you can access the response like a normal URL
				xhr.onreadystatechange = function () {
					if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
						const img = document.getElementById('image2');
						img.src = URL.createObjectURL(xhr.response); //create <img> with src set to the blob
					}
				};
				xhr.open('GET', 'http://localhost:8080/api/v1/statistics/users-expenses', true);
				xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
				xhr.send();
			} catch (error) {
				console.error('Ошибка при получении изображения:', error);
			}
		};

		fetchImage();
	}, []);

	return (
		<>
			<Navbar />
			<div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
				<Title level={4} style={{ textAlign: 'center' }}>
					Круговая диаграмма с общей выручкой по каждой из категорий
				</Title>
				<img
					style={{ boxShadow: '12px 12px 2px 1px rgba(0, 0, 255, .2)' }}
					id="image1"
					alt="Изображение"
				/>
				<Title level={4} style={{ marginTop: '46px', textAlign: 'center' }}>
					Столбчатая диаграмма с пользователями, принесшими наибольшую выручку
				</Title>
				<img
					style={{ boxShadow: '12px 12px 2px 1px rgba(0, 0, 255, .2)' }}
					id="image2"
					alt="Изображение"
				/>
			</div>
		</>
	);
};

export default StatisticPage;
