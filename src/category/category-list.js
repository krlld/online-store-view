import { useEffect, useState } from 'react';
import { List, Pagination, Typography, Button, message, Space } from 'antd';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import axios from 'axios';
import { config } from '../utils/get-axios-config';
import { useNavigate } from 'react-router-dom';
import CategoryForm from './category-form';
import CategoryModal from './category-modal';

const { Title } = Typography;

const CategoryList = () => {
	const navigate = useNavigate();

	const [categories, setCategories] = useState([]);

	const [currentPage, setCurrentPage] = useState(1);
	const [total, setTotal] = useState(1);
	const [pageSize, setPageSize] = useState(1);

	const [modalVisible, setModalVisible] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState(null);

	const handlePageChange = (page, pageSize) => {
		setCurrentPage(page);
		setPageSize(pageSize);
		fetchCategories(page, pageSize);
		// Здесь вы можете выполнить дополнительные действия при изменении страницы, например, загрузить данные для новой страницы.
	};

	const onAdd = (category) => {
		setCategories([category, ...categories]); // Обновляем состояние списка категорий, добавляя новую категорию
	};

	useEffect(() => {
		// Выполняем запрос к серверу при монтировании компонента
		fetchCategories();
	}, []);

	const fetchCategories = async (page, size) => {
		try {
			// Выполняем GET-запрос к серверу для получения списка категорий
			const response = await axios.get(
				`http://localhost:8080/api/v1/categories?page=${page - 1}&size=${size}&sort=id,desc`,
				config
			);
			setCategories(response.data.content); // Обновляем состояние списка категорий
			setTotal(response.data.totalElements);
			setPageSize(response.data.size);
			console.log(response.data.content);
		} catch (error) {
			console.log(error);
			if (error.response.status === 401 || error.response.status === 403) {
				navigate('/auth/authenticate');
				return;
			}
			console.error('Ошибка при загрузке категорий:', error);
		}
	};

	const openModal = (category) => {
		setSelectedCategory(category);
		setModalVisible(true);
	};

	const closeModal = () => {
		setSelectedCategory(null);
		setModalVisible(false);
	};

	const deleteCategory = async (categoryId) => {
		try {
			await axios.delete(`http://localhost:8080/api/v1/categories/${categoryId}`, config);
			setCategories(categories.filter((category) => category.id !== categoryId));
			message.success('Категория успешно удалена');
		} catch (error) {
			if (error.response.status === 401 || error.response.status === 403) {
				navigate('/auth/authenticate');
				return;
			}
			console.error('Ошибка при удалении категории:', error);
			message.error('Ошибка при удалении категории');
		}
	};

	return (
		<>
			<CategoryForm onAdd={onAdd} />
			<Title level={4} style={{ textAlign: 'center' }}>
				Список категорий
			</Title>
			<List
				dataSource={categories}
				renderItem={(category) => (
					<List.Item style={{ display: 'flex', alignItems: 'center' }}>
						{category.name}
						<Space>
							<Button type="text" icon={<EditTwoTone />} onClick={() => openModal(category)} />
							<Button
								type="text"
								icon={<DeleteTwoTone twoToneColor={'red'} />}
								onClick={() => deleteCategory(category.id)}
							/>
						</Space>
					</List.Item>
				)}
			/>
			<CategoryModal
				modalVisible={modalVisible}
				closeModal={closeModal}
				selectedCategory={selectedCategory}
				categories={categories}
				setCategories={setCategories}
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

export default CategoryList;
