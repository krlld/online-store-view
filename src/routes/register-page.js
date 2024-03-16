import { Form, Input, Button, Typography, message } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const RegisterPage = () => {
	const [form] = Form.useForm();

	const handleLogin = async (values) => {
		try {
			const response = await axios.post('http://localhost:8080/api/v1/auth/register', values);
			console.log(response.data);
			localStorage.setItem('token', response.data.token);
			const userdata = await axios.get('http://localhost:8080/api/v1/userdata', {
				headers: { Authorization: 'Bearer ' + response.data.token },
			});
			localStorage.setItem('userId', userdata.data.id);
			window.location.href = '/';
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
					Регистрация
				</Title>
				<Form form={form} name="login" onFinish={handleLogin}>
					<Form.Item
						label="Имя пользователя"
						name="name"
						rules={[{ required: true, message: 'Пожалуйста, введите имя пользователя' }]}
					>
						<Input />
					</Form.Item>
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
							Зарегистрироваться
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
};

export default RegisterPage;
