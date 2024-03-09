import { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Carousel, Pagination, Space, Button } from 'antd';
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import axios from 'axios';
import { config } from '../utils/get-axios-config';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const HomeList = () => {
	const navigate = useNavigate();

	const [products, setProducts] = useState([]);

	const [currentPage, setCurrentPage] = useState(1);
	const [total, setTotal] = useState(1);
	const [pageSize, setPageSize] = useState(1);

	const handlePageChange = (page, pageSize) => {
		setCurrentPage(page);
		setPageSize(pageSize);
		fetchProducts(page, pageSize);
		// Здесь вы можете выполнить дополнительные действия при изменении страницы, например, загрузить данные для новой страницы.
	};

	useEffect(() => {
		// Выполняем запрос к серверу при монтировании компонента
		fetchProducts();
	}, []);

	const fetchProducts = async (page, size) => {
		try {
			// Выполняем GET-запрос к серверу для получения списка категорий
			const response = await axios.get(
				`http://localhost:8080/api/v1/products?page=${page - 1}&size=${size}&sort=id,desc`,
				config
			);
			setProducts(response.data.content); // Обновляем состояние списка категорий
			setTotal(response.data.totalElements);
			setPageSize(response.data.size);
			console.log(response.data.content);
		} catch (error) {
			console.log(error);
			if (error.response.status === 401 || error.response.status === 403) {
				navigate('/auth/authenticate');
				return;
			}
			console.error('Ошибка при загрузке продуктов:', error);
		}
	};

	const handleAddToFavorites = (productId) => {
		// Логика добавления товара в список избранного
		console.log(`Product ${productId} added to favorites`);
	};

	const handleAddToCart = (productId) => {
		// Логика добавления товара в корзину
		console.log(`Product ${productId} added to cart`);
	};

	return (
		<>
			<Row gutter={[16, 16]}>
				{products.map((product) => (
					<Col key={product.id} xs={24} sm={12} md={8} lg={6}>
						<Card title={product.name} style={{ width: '100%' }}>
							<Carousel>
								{product.images.map((image) => (
									<div key={image}>
										<img
											src={image.url}
											alt="Product"
											style={{
												objectFit: 'contain',
												width: '200px',
												height: '250px',
												marginBottom: '10px',
											}}
										/>
									</div>
								))}
							</Carousel>
							<div style={{ marginBottom: '10px' }}>
								<div>
									<Text strong>Категория: </Text>
									<Text>{product.categoryName}</Text>
								</div>
								<div>
									<Text strong>Цена: </Text>
									<Text>{product.price} BYN</Text>
								</div>
								<div>
									<Text strong>Описание: </Text>
									<Text>{product.description}</Text>
								</div>
							</div>
							<Space>
								<Button
									type="primary"
									icon={<HeartOutlined />}
									onClick={() => handleAddToFavorites(product.id)}
								/>
								<Button
									type="primary"
									icon={<ShoppingCartOutlined />}
									onClick={() => handleAddToCart(product.id)}
								/>
							</Space>
						</Card>
					</Col>
				))}
			</Row>
			<Pagination
				style={{ marginTop: '20px' }}
				current={currentPage}
				total={total} // Общее количество элементов, которые нужно разделить на страницы
				pageSize={pageSize} // Количество элементов на странице
				onChange={handlePageChange} // Обработчик изменения страницы
			/>
		</>
	);
};

export default HomeList;
