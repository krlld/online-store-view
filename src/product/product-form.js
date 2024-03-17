import { Form, Input, InputNumber, Button, Typography, message, Select, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { config } from '../utils/get-axios-config';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const { Title } = Typography;
const { Option } = Select;

const ProductForm = (props) => {
	const [form] = Form.useForm();

	const navigate = useNavigate();

	const [categories, setCategories] = useState([]);

	useEffect(() => {
		// Выполняем запрос к серверу при монтировании компонента
		fetchCategories();
	}, []);

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

	const onFinish = async (values) => {
		try {
			values.images = values.images === undefined ? [] : values.images;
			console.log(values);
			const response = await axios.post('http://localhost:8080/api/v1/products', values, config);
			if (response.status !== 201) {
				message.error(response.data.message);
				return;
			}
			props.onAdd(response.data);
			message.success('Товар успешно добавлен');
			console.log(response.data);
			form.resetFields();
			// Дополнительная обработка успешного ответа сервера
		} catch (error) {
			console.log(error);
			if (error.response.status === 401 || error.response.status === 403) {
				navigate('/auth/authenticate');
				return;
			}
			console.error(error);
			message.error(error.response.data.message);
			// Обработка ошибки
		}
	};

	return (
		<>
			<Title level={3} style={{ textAlign: 'center' }}>
				Создать товар
			</Title>
			<Form form={form} onFinish={onFinish}>
				<Form.Item
					label="Название товара"
					name="name"
					rules={[{ required: true, message: 'Пожалуйста, введите название товара' }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Цена товара"
					name="price"
					rules={[{ required: true, message: 'Пожалуйста, введите цену товара' }]}
				>
					<InputNumber />
				</Form.Item>
				<Form.Item
					label="Категория товара"
					name="categoryId"
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
					<Button type="primary" htmlType="submit" style={{ width: '100%' }}>
						Создать товар
					</Button>
				</Form.Item>
			</Form>
		</>
	);
};

export default ProductForm;
