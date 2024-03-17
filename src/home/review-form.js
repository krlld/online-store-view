import { Form, Input, Button, message, Rate } from 'antd';
import axios from 'axios';
import { config } from '../utils/get-axios-config';
import { useNavigate } from 'react-router-dom';

const ReviewForm = (props) => {
	const navigate = useNavigate();

	const onFinish = async (values) => {
		try {
			values.productId = props.productId;
			values.userId = localStorage.getItem('userId');
			console.log(values);
			const response = await axios.post('http://localhost:8080/api/v1/reviews', values, config);
			if (response.status !== 201) {
				message.error(response.data.message);
				return;
			}
			message.success('Отзыв успешно добавлен');
			console.log(response.data);
			props.onAdd(response.data);
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
			<Form onFinish={onFinish} style={{ marginTop: '15px' }}>
				<Form.Item
					label="Оценка"
					name="rating"
					rules={[{ required: true, message: 'Пожалуйста, выберите оценку' }]}
				>
					<Rate />
				</Form.Item>
				<Form.Item
					label="Отзыв"
					name="content"
					rules={[{ required: true, message: 'Пожалуйста, напишите отзыв' }]}
				>
					<Input.TextArea />
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" style={{ width: '100%' }}>
						Сохранить отзыв
					</Button>
				</Form.Item>
			</Form>
		</>
	);
};

export default ReviewForm;
