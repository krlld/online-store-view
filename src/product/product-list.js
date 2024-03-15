import { useEffect, useState } from 'react';
import { List, Pagination, Typography, Button, message } from 'antd';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import axios from 'axios';
import { config } from '../utils/get-axios-config';
import { useNavigate } from 'react-router-dom';
import ProductForm from './product-form';
import ProductModal from './product-modal';

const { Title, Text } = Typography;

const ProductList = () => {
	const navigate = useNavigate();

	const [products, setProducts] = useState([]);

	const [currentPage, setCurrentPage] = useState(1);
	const [total, setTotal] = useState(1);
	const [pageSize, setPageSize] = useState(1);

	const [modalVisible, setModalVisible] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);

	const handlePageChange = (page, pageSize) => {
		setCurrentPage(page);
		setPageSize(pageSize);
		fetchProducts(page, pageSize);
		// Здесь вы можете выполнить дополнительные действия при изменении страницы, например, загрузить данные для новой страницы.
	};

	const onAdd = (product) => {
		setProducts([product, ...products]); // Обновляем состояние списка категорий, добавляя новую категорию
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
			if (error.response.status === 401 || error.response.status === 403) {
				navigate('/auth/authenticate');
				return;
			}
			console.error('Ошибка при загрузке товаров:', error);
		}
	};

	const openModal = (product) => {
		setSelectedProduct(product);
		setModalVisible(true);
	};

	const closeModal = () => {
		setSelectedProduct(null);
		setModalVisible(false);
	};

	const deleteProduct = async (productId) => {
		try {
			await axios.delete(`http://localhost:8080/api/v1/products/${productId}`, config);
			setProducts(products.filter((product) => product.id !== productId));
			message.success('Товар успешно удален');
		} catch (error) {
			if (error.response.status === 401 || error.response.status === 403) {
				navigate('/auth/authenticate');
				return;
			}
			console.error('Ошибка при удалении товара:', error);
			message.error('Ошибка при удалении товара');
		}
	};

	return (
		<>
			<ProductForm onAdd={onAdd} />
			<Title level={4} style={{ textAlign: 'center' }}>
				Список товаров
			</Title>
			<List
				dataSource={products}
				renderItem={(product) => (
					<div key={product.id} style={{ marginBottom: 16 }}>
						<div>
							<Text strong>Название: </Text>
							<Text>{product.name}</Text>
						</div>
						<div>
							<Text strong>Категория: </Text>
							<Text>{product.categoryName}</Text>
						</div>
						<div>
							<Text strong>Цена: </Text>
							<Text>{product.price}</Text>
						</div>
						<div>
							<Text strong>Описание: </Text>
							<Text>{product.description}</Text>
						</div>
						<div>
							<Text strong>Изображения: </Text>
							<ul>
								{product.images.map((image) => (
									<li key={image.id}>{image.url}</li>
								))}
							</ul>
						</div>
						<div>
							<Button type="text" icon={<EditTwoTone />} onClick={() => openModal(product)} />
							<Button
								type="text"
								icon={<DeleteTwoTone twoToneColor={'red'} />}
								onClick={() => deleteProduct(product.id)}
							/>
						</div>
					</div>
				)}
			/>
			<ProductModal
				modalVisible={modalVisible}
				closeModal={closeModal}
				selectedProduct={selectedProduct}
				products={products}
				setProducts={setProducts}
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

export default ProductList;
