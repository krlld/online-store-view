import { Form, Input, Button, Typography, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { config } from '../utils/get-axios-config';

const { Title } = Typography;

const AuthPage = () => {
	const [form] = Form.useForm();
	const navigate = useNavigate();

	const handleLogin = async (values) => {
		try {
			const response = await axios.post('http://localhost:8080/api/v1/auth/authenticate', values);
			console.log(response.data);
			localStorage.setItem('token', response.data.token);
			const userdata = await axios.get('http://localhost:8080/api/v1/userdata', {
				headers: { Authorization: 'Bearer ' + response.data.token },
			});
			localStorage.setItem('userId', userdata.data.id);
			navigate('/');
			// Дополнительная обработка успешного ответа сервера
		} catch (error) {
			console.error(error);
			message.warning('Проверьте свои данные');
			// Обработка ошибки
		}
		// Очистка полей ввода после отправки формы
		form.resetFields();
	};

	return (
		<div
			style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}
		>
			<div style={{ width: '400px' }}>
				<Title level={2} style={{ textAlign: 'center', marginBottom: '2rem' }}>
					Авторизация
				</Title>
				<Form form={form} name="login" onFinish={handleLogin}>
					<Form.Item
						label="Email"
						name="email"
						rules={[{ required: true, message: 'Пожалуйста, введите email' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="Пароль"
						name="password"
						rules={[{ required: true, message: 'Пожалуйста, введите пароль' }]}
					>
						<Input.Password />
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit" style={{ width: '100%' }}>
							Войти
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
};

export default AuthPage;
