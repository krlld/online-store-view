import { useEffect, useState } from 'react';
import {
	Card,
	Row,
	Col,
	Typography,
	Carousel,
	Pagination,
	Space,
	Button,
	message,
	Rate,
	Drawer,
	FloatButton,
	Form,
	Input,
} from 'antd';
import {
	HeartOutlined,
	HeartTwoTone,
	ShoppingTwoTone,
	ShoppingOutlined,
	CommentOutlined,
	LineChartOutlined,
	SearchOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { config } from '../utils/get-axios-config';
import { useNavigate } from 'react-router-dom';
import ReviewModal from './review-modal';
import PriceChangeModal from './price-change-modal';

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

	const fetchProducts = async (page, size, query) => {
		try {
			query = query ? query : '';
			// Выполняем GET-запрос к серверу для получения списка категорий
			const response = await axios.get(
				`http://localhost:8080/api/v1/user-products/${localStorage.getItem('userId')}?page=${
					page - 1
				}&size=${size}&sort=id,desc&query=${query}`,
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

	const handleChangeFavorites = async (productId) => {
		try {
			// Выполняем GET-запрос к серверу для получения списка категорий
			await axios.patch(
				`http://localhost:8080/api/v1/favorite-items`,
				{ productId: productId, userId: localStorage.getItem('userId') },
				config
			);
			setProducts(
				products.map((product) => {
					if (product.productDto.id === productId) {
						product.isInFavorite = !product.isInFavorite;
						product.isInFavorite
							? message.success(`${product.productDto.name} добавлен в избранное`)
							: message.success(`${product.productDto.name} удален из избранного`);
					}
					return product;
				})
			);
		} catch (error) {
			console.log(error);
			if (error.status === 401 || error.status === 403) {
				navigate('/auth/authenticate');
				return;
			}
			console.error('Ошибка при загрузке продуктов:', error);
		}
		// Логика добавления товара в список избранного
		console.log(`Product ${productId} added to favorites`);
	};

	const handleAddToCart = async (productId) => {
		try {
			// Выполняем GET-запрос к серверу для получения списка категорий
			await axios.post(
				`http://localhost:8080/api/v1/cart-items`,
				{ productId: productId, userId: localStorage.getItem('userId'), quantity: 1 },
				config
			);
			setProducts(
				products.map((product) => {
					if (product.productDto.id === productId) {
						product.isInCart = true;
						message.success(`${product.productDto.name} добавлен в корзину`);
					}
					return product;
				})
			);
		} catch (error) {
			console.log(error);
			if (error.status === 401 || error.status === 403) {
				navigate('/auth/authenticate');
				return;
			}
			console.error('Ошибка при загрузке продуктов:', error);
		}
		// Логика добавления товара в корзину
		console.log(`Product ${productId} added to cart`);
	};

	const handleDeleteToCart = async (productId) => {
		try {
			// Выполняем GET-запрос к серверу для получения списка категорий
			await axios.delete(
				`http://localhost:8080/api/v1/cart-items/${localStorage.getItem('userId')}/${productId}`,
				config
			);
			setProducts(
				products.map((product) => {
					if (product.productDto.id === productId) {
						product.isInCart = false;
						message.warning(`${product.productDto.name} удален из корзины`);
					}
					return product;
				})
			);
		} catch (error) {
			console.log(error);
			if (error.status === 401 || error.status === 403) {
				navigate('/auth/authenticate');
				return;
			}
			console.error('Ошибка при загрузке продуктов:', error);
		}
		// Логика добавления товара в корзину
		console.log(`Product ${productId} deleted to cart`);
	};

	const [isModalOpen, setIsModalOpen] = useState(false);

	const [selectedProduct, setSelectedProduct] = useState(null);

	const showModal = (product) => {
		setSelectedProduct(product);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const [showPriceChange, setShowPriceChange] = useState(false);

	const onShowPriceChange = (product) => {
		setSelectedProduct(product);
		setShowPriceChange(true);
	};

	const closeShowPriceChange = () => {
		setShowPriceChange(false);
	};

	const updateRating = (productId, rating) => {
		setProducts(
			products.map((product) => {
				if (product.productDto.id === productId) {
					product.productDto.averageRating =
						(product.productDto.totalReviews * product.productDto.averageRating + rating) /
						(product.productDto.totalReviews + 1);
					product.productDto.totalReviews = product.productDto.totalReviews + 1;
					console.log(product.productDto.averageRating);
				}
				return product;
			})
		);
	};

	const [open, setOpen] = useState(false);

	const showDrawer = () => {
		setOpen(true);
	};

	const onClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Row gutter={[16, 16]}>
				{products.map((product) => (
					<Col key={product.productDto.id} xs={24} sm={12} md={8} lg={6}>
						<Card title={product.productDto.name} style={{ width: '100%' }}>
							<Carousel>
								{product.productDto.images.map((image) => (
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
							<Rate
								key={product.productDto.averageRating}
								disabled
								allowHalf
								defaultValue={product.productDto.averageRating}
							/>
							<div style={{ marginBottom: '10px' }}>
								<div>
									<Text strong>Категория: </Text>
									<Text>{product.productDto.categoryName}</Text>
								</div>
								<div>
									<Text strong>Цена: </Text>
									<Text>{product.productDto.price} BYN</Text>
								</div>
								<div>
									<Text strong>Описание: </Text>
									<Text>{product.productDto.description}</Text>
								</div>
							</div>
							<Space>
								{product.isInFavorite ? (
									<Button
										type="text"
										icon={<HeartTwoTone twoToneColor={'red'} />}
										onClick={() => handleChangeFavorites(product.productDto.id)}
									/>
								) : (
									<Button
										type="text"
										icon={<HeartOutlined />}
										onClick={() => handleChangeFavorites(product.productDto.id)}
									/>
								)}

								{product.isInCart ? (
									<Button
										type="text"
										icon={<ShoppingTwoTone twoToneColor={'red'} />}
										onClick={() => handleDeleteToCart(product.productDto.id)}
									/>
								) : (
									<Button
										type="text"
										icon={<ShoppingOutlined />}
										onClick={() => handleAddToCart(product.productDto.id)}
									/>
								)}
								<Button type="text" onClick={() => showModal(product)} icon={<CommentOutlined />} />
								<Button
									type="text"
									onClick={() => {
										onShowPriceChange(product);
									}}
									icon={<LineChartOutlined />}
								/>
							</Space>
						</Card>
					</Col>
				))}
			</Row>
			<ReviewModal
				modalVisible={isModalOpen}
				closeModal={closeModal}
				selectedProduct={selectedProduct}
				updateRating={updateRating}
			/>
			<PriceChangeModal
				modalVisible={showPriceChange}
				closeModal={closeShowPriceChange}
				selectedProduct={selectedProduct}
			/>
			<Drawer title="Поиск по товарам" onClose={onClose} open={open}>
				<Form
					onFinish={(values) => {
						fetchProducts(null, null, values.query);
					}}
				>
					<Form.Item name="query" rules={[{ message: 'Пожалуйста, введите запрос для поиска' }]}>
						<Input />
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit" style={{ width: '100%' }}>
							Искать
						</Button>
					</Form.Item>
				</Form>
			</Drawer>
			<FloatButton type="primary" icon={<SearchOutlined />} onClick={showDrawer} />
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
