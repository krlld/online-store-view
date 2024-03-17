import { Form, Input, Button, Typography, message } from 'antd';
import axios from 'axios';
import { config } from '../utils/get-axios-config';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const CategoryForm = (props) => {
	const [form] = Form.useForm();

	const navigate = useNavigate();

	const onFinish = async (values) => {
		try {
			console.log(values);
			const response = await axios.post('http://localhost:8080/api/v1/categories', values, config);
			if (response.status !== 201) {
				message.error(response.data.message);
				return;
			}
			message.success('Категория успешно добавлена');
			console.log(response.data);
			props.onAdd(response.data);
			form.resetFields();
			// Дополнительная обработка успешного ответа сервера
		} catch (error) {
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
				Создать категорию товаров
			</Title>
			<Form form={form} name="categoryForm" onFinish={onFinish}>
				<Form.Item
					label="Название категории"
					name="name"
					rules={[{ required: true, message: 'Пожалуйста, введите название категории' }]}
				>
					<Input />
				</Form.Item>

				<Form.Item>
					<Button type="primary" htmlType="submit" style={{ width: '100%' }}>
						Создать категорию
					</Button>
				</Form.Item>
			</Form>
		</>
	);
};

export default CategoryForm;
