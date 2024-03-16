import { useEffect, useState } from 'react';
import { List, Pagination, Typography, Button, message } from 'antd';
import { CarTwoTone, CheckCircleTwoTone } from '@ant-design/icons';
import axios from 'axios';
import { config } from '../utils/get-axios-config';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const OrderList = () => {
	const navigate = useNavigate();

	const [orders, setOrders] = useState([]);

	const [currentPage, setCurrentPage] = useState(1);
	const [total, setTotal] = useState(1);
	const [pageSize, setPageSize] = useState(1);

	const handlePageChange = (page, pageSize) => {
		setCurrentPage(page);
		setPageSize(pageSize);
		fetchOrders(page, pageSize);
		// Здесь вы можете выполнить дополнительные действия при изменении страницы, например, загрузить данные для новой страницы.
	};

	useEffect(() => {
		// Выполняем запрос к серверу при монтировании компонента
		fetchOrders();
	}, []);

	const fetchOrders = async (page, size) => {
		try {
			// Выполняем GET-запрос к серверу для получения списка категорий
			const response = await axios.get(
				`http://localhost:8080/api/v1/orders/${localStorage.getItem('userId')}?page=${
					page - 1
				}&size=${size}&sort=id,desc`,
				config
			);
			setOrders(response.data.content); // Обновляем состояние списка категорий
			setTotal(response.data.totalElements);
			setPageSize(response.data.size);
			console.log(response.data.content);
		} catch (error) {
			if (error.response.status === 401 || error.response.status === 403) {
				navigate('/auth/authenticate');
				return;
			}
			console.error('Ошибка при загрузке заказов:', error);
		}
	};

	const confirmDelivery = async (orderId) => {
		try {
			await axios.patch(`http://localhost:8080/api/v1/orders/${orderId}`, {}, config);
			setOrders(
				orders.map((order) => {
					if (order.id === orderId) {
						order.orderStatusName = 'DELIVERED';
					}
					return order;
				})
			);
			message.success('Получение заказа подтверждено');
		} catch (error) {
			if (error.response.status === 401 || error.response.status === 403) {
				navigate('/auth/authenticate');
				return;
			}
		}
	};

	return (
		<>
			<Title level={4} style={{ textAlign: 'center' }}>
				Список заказов
			</Title>
			<List
				dataSource={orders}
				renderItem={(order) => (
					<div key={order.id} style={{ marginBottom: 16 }}>
						<div>
							<Text strong>Дата заказа: </Text>
							<Text>{order.date}</Text>
						</div>
						<div>
							<Text strong>Адрес заказа: </Text>
							<Text>{order.deliveryAddress}</Text>
						</div>
						<div>
							<Text strong>Общая стоимость: </Text>
							<Text>{order.total}</Text>
						</div>
						<div>
							<Text strong>Товары: </Text>
							<ul>
								{order.orderItemDtos.map((item) => (
									<li key={item.id}>
										<div>
											<Text strong>Название: </Text>
											<Text>{item.productName}</Text>
										</div>
										<div>
											<Text strong>Категория: </Text>
											<Text>{item.categoryName}</Text>
										</div>
										<div>
											<Text strong>Цена: </Text>
											<Text>{item.price}</Text>
										</div>
										<div>
											<Text strong>Количество: </Text>
											<Text>{item.quantity}</Text>
										</div>
									</li>
								))}
							</ul>
						</div>
						<div>
							{order.orderStatusName === 'ON_WAY' ? (
								<Button
									type="dashed"
									icon={<CarTwoTone />}
									onClick={() => confirmDelivery(order.id)}
								>
									Подтвердить доставку
								</Button>
							) : (
								<Button type="text" icon={<CheckCircleTwoTone twoToneColor={'66FF00'} />} disabled>
									Заказ доставлен
								</Button>
							)}
						</div>
					</div>
				)}
			/>
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

export default OrderList;
