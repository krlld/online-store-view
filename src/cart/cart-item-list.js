import { useEffect, useState } from 'react';
import { List, Pagination, Typography, Button, message } from 'antd';
import {
	PlusOutlined,
	MinusOutlined,
	DeleteTwoTone,
	ShoppingCartOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { config } from '../utils/get-axios-config';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const CartItemList = () => {
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
				`http://localhost:8080/api/v1/cart-items/${localStorage.getItem('userId')}?page=${
					page - 1
				}&size=${size}&sort=id,desc`,
				config
			);
			setProducts(response.data.content); // Обновляем состояние списка категорий
			setTotal(response.data.totalElements);
			setPageSize(response.data.size);
			console.log(response.data.content);
		} catch (error) {
			if (error.response.status === 401 || error.response.status === 403) {
				navigate('/auth/authenticate');
				return;
			}
			console.error('Ошибка при загрузке товаров:', error);
		}
	};

	const handleChangeQuantity = async (productId, quantity) => {
		try {
			// Выполняем GET-запрос к серверу для получения списка категорий
			const response = await axios.post(
				`http://localhost:8080/api/v1/cart-items`,
				{ productId: productId, userId: localStorage.getItem('userId'), quantity: quantity },
				config
			);
			const name = products.filter((product) => product.productDto.id === productId)[0].productDto
				.name;
			setProducts(
				products.map((product) => {
					if (product.productDto.id === productId) {
						product.quantity = product.quantity + quantity;
					}
					return product;
				})
			);
			message.success(`В корзине ${response.data.quantity} ${name}`);
		} catch (error) {
			console.log(error);
			if (error.status === 401 || error.status === 403) {
				navigate('/auth/authenticate');
				return;
			}
			message.warning(error.response.data.message);
			console.error('Ошибка при загрузке продуктов:', error);
		}
		// Логика добавления товара в список избранного
		console.log(`Product ${productId} change from favorites`);
	};

	const handleDelete = async (productId) => {
		try {
			// Выполняем GET-запрос к серверу для получения списка категорий
			await axios.delete(
				`http://localhost:8080/api/v1/cart-items/${localStorage.getItem('userId')}/${productId}`,
				config
			);
			const name = products.filter((product) => product.productDto.id === productId)[0].productDto
				.name;
			setProducts(products.filter((product) => product.productDto.id !== productId));
			message.warning(`${name} удален из корзины`);
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

	const handleConfirm = async () => {
		try {
			// Выполняем GET-запрос к серверу для получения списка категорий
			await axios.post(
				`http://localhost:8080/api/v1/orders`,
				{
					userId: localStorage.getItem('userId'),
					deliveryAddress: localStorage.getItem('deliveryAddress'),
				},
				config
			);
			setProducts([]);
			message.success(`Заказ по адресу: ${localStorage.getItem('deliveryAddress')} оформлен`);
		} catch (error) {
			console.log(error);
			if (error.status === 401 || error.status === 403) {
				navigate('/auth/authenticate');
				return;
			}
			message.warning(error.response.data.message);
			console.error('Ошибка при загрузке продуктов:', error);
		}
	};

	return (
		<>
			<Title level={4} style={{ textAlign: 'center' }}>
				Корзина
			</Title>
			<List
				dataSource={products}
				renderItem={(product) => (
					<div style={{ marginBottom: 16 }}>
						<div>
							<Text strong>Название: </Text>
							<Text>{product.productDto.name}</Text>
						</div>
						<div>
							<Text strong>Категория: </Text>
							<Text>{product.productDto.categoryName}</Text>
						</div>
						<div>
							<Text strong>Цена: </Text>
							<Text>{product.productDto.price}</Text>
						</div>
						<div>
							<Text strong>Количество в корзине: </Text>
							<Text>{product.quantity}</Text>
						</div>
						<div>
							<Text strong>Описание: </Text>
							<Text>{product.productDto.description}</Text>
						</div>
						<div>
							<Button
								type="text"
								icon={<PlusOutlined />}
								onClick={() => handleChangeQuantity(product.productDto.id, 1)}
							/>
							<Button
								type="text"
								icon={<MinusOutlined />}
								onClick={() => handleChangeQuantity(product.productDto.id, -1)}
							/>
							<Button
								type="text"
								icon={<DeleteTwoTone twoToneColor={'red'} />}
								onClick={() => handleDelete(product.productDto.id)}
							/>
						</div>
					</div>
				)}
			/>
			<Button
				type="primary"
				icon={<ShoppingCartOutlined />}
				style={{ margin: '0 auto', marginBottom: 16 }}
				onClick={handleConfirm}
			>
				Оформить заказ
			</Button>
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

export default CartItemList;
