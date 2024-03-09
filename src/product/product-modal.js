import { Modal, Form, Input, Button, message, InputNumber, Select, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { config } from '../utils/get-axios-config';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const ProductModal = (props) => {
	const navigate = useNavigate();

	const [categories, setCategories] = useState([]);

	const fetchCategories = async (page, size) => {
		try {
			// Выполняем GET-запрос к серверу для получения списка категорий
			const response = await axios.get(
				`http://localhost:8080/api/v1/categories?size=${100}&sort=id,desc`,
				config
			);
			setCategories(response.data.content); // Обновляем состояние списка категорий
			console.log(response.data.content);
		} catch (error) {
			if (error.response.status === 401 || error.response.status === 403) {
				navigate('/auth/authenticate');
				return;
			}
			console.error('Ошибка при загрузке категорий:', error);
		}
	};

	useEffect(() => {
		// Выполняем запрос к серверу при монтировании компонента
		fetchCategories();
	}, []);

	const handleUpdateProduct = async (updatedProduct) => {
		try {
			updatedProduct.images = updatedProduct.images === undefined ? [] : updatedProduct.images;
			const response = await axios.put(
				`http://localhost:8080/api/v1/products/${props.selectedProduct.id}`,
				updatedProduct,
				config
			);
			props.setProducts(
				props.products.map((product) =>
					product.id === props.selectedProduct.id ? response.data : product
				)
			);
			message.success('Товар успешно обновлен');
		} catch (error) {
			console.error('Ошибка при обновлении товара:', error);
			message.error('Ошибка при обновлении товара');
		}
		props.closeModal();
	};

	return (
		<>
			<Modal
				title="Редактировать товар"
				visible={props.modalVisible}
				onCancel={props.closeModal}
				footer={null}
			>
				{props.selectedProduct && (
					<Form onFinish={handleUpdateProduct}>
						<Form.Item
							label="Название товара"
							name="name"
							initialValue={props.selectedProduct.name}
							rules={[{ required: true, message: 'Пожалуйста, введите название товара' }]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							label="Цена товара"
							name="price"
							initialValue={props.selectedProduct.price}
							rules={[{ required: true, message: 'Пожалуйста, введите цену товара' }]}
						>
							<InputNumber />
						</Form.Item>
						<Form.Item
							label="Категория товара"
							name="categoryId"
							initialValue={props.selectedProduct.categoryId}
							rules={[{ required: true, message: 'Пожалуйста, выберите категорию товара' }]}
						>
							<Select>
								{categories.map((category) => (
									<Option value={category.id} key={category.id}>
										{category.name}
									</Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item
							label="Описание товара"
							name="description"
							initialValue={props.selectedProduct.description}
							rules={[{ required: true, message: 'Пожалуйста, введите описание товара' }]}
						>
							<Input.TextArea />
						</Form.Item>
						<Form.List name="images">
							{(fields, { add, remove }) => (
								<>
									{fields.map(({ key, name, ...restField }) => (
										<Space
											style={{
												display: 'flex',
												marginBottom: 8,
											}}
											align="baseline"
										>
											<Form.Item
												{...restField}
												name={[name, 'url']}
												rules={[
													{
														required: true,
														message: 'Пожалуйста, укажите ссылку на изображение',
													},
												]}
											>
												<Input placeholder="Ссылка на изображение" />
											</Form.Item>
											<MinusCircleOutlined onClick={() => remove(name)} />
										</Space>
									))}
									<Form.Item>
										<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
											Добавить изображение
										</Button>
									</Form.Item>
								</>
							)}
						</Form.List>
						<Form.Item>
							<Button type="primary" htmlType="submit">
								Сохранить
							</Button>
						</Form.Item>
					</Form>
				)}
			</Modal>
		</>
	);
};

export default ProductModal;
