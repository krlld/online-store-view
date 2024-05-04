import Navbar from '../navbar';
import { Form, Input, Button, Typography, message } from 'antd';
import axios from 'axios';
import { config } from '../utils/get-axios-config';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const EmailPage = () => {
	const [form] = Form.useForm();

	const navigate = useNavigate();

	const onFinish = async (values) => {
		try {
			console.log(values);
			const response = await axios.post('http://localhost:8080/api/v1/emails', values, config);

			message.success('Сообщения успешно отправлены');
			console.log(response.data);
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
			<Navbar />
			<div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
				<Title level={3} style={{ textAlign: 'center' }}>
					Отправить сообщения всем клиентам
				</Title>
				<Form form={form} name="categoryForm" onFinish={onFinish}>
					<Form.Item
						label="Тема сообщения"
						name="subject"
						rules={[{ required: true, message: 'Пожалуйста, введите тему сообщения' }]}
					>
						<Input.TextArea />
					</Form.Item>
					<Form.Item
						label="Текст сообщения"
						name="text"
						rules={[{ required: true, message: 'Пожалуйста, введите текст сообщения' }]}
					>
						<Input.TextArea />
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit" style={{ width: '100%' }}>
							Отправить
						</Button>
					</Form.Item>
				</Form>
			</div>
		</>
	);
};

export default EmailPage;
