import { useEffect, useState } from 'react';
import { Typography, Input, Button } from 'antd';
import axios from 'axios';
import { config } from '../utils/get-axios-config';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const ProfileData = () => {
	const navigate = useNavigate();

	const [userdata, setUserdata] = useState({});

	useEffect(() => {
		// Выполняем запрос к серверу при монтировании компонента
		fetchUserdata();
	}, []);

	const fetchUserdata = async (page, size) => {
		try {
			// Выполняем GET-запрос к серверу для получения списка категорий
			const response = await axios.get(`http://localhost:8080/api/v1/userdata`, config);
			setUserdata(response.data);
			console.log(response.data);
		} catch (error) {
			if (error.response.status === 401 || error.response.status === 403) {
				navigate('/auth/authenticate');
				return;
			}
			console.error('Ошибка при загрузке:', error);
		}
	};

	const changeDeliveryAddress = (value) => {
		localStorage.setItem('deliveryAddress', value.target.value);
		console.log(value.target.value);
	};

	const logout = () => {
		localStorage.removeItem('userId');
		localStorage.removeItem('token');
		window.location.href = '/';
	};

	return (
		<>
			<Title level={4} style={{ textAlign: 'center' }}>
				Профиль
			</Title>
			<div style={{ marginBottom: 16 }}>
				<div>
					<Text strong>Имя: </Text>
					<Text>{userdata.name}</Text>
				</div>
				<div>
					<Text strong>Email: </Text>
					<Text>{userdata.email}</Text>
				</div>
				<div>
					<Input
						type="primary"
						size="small"
						addonBefore="Адрес доставки"
						defaultValue={localStorage.getItem('deliveryAddress')}
						style={{ marginBottom: '15px' }}
						onChangeCapture={changeDeliveryAddress}
					/>
				</div>
				<div>
					<Button type="primary" onClick={logout}>
						Выйти
					</Button>
				</div>
			</div>
		</>
	);
};

export default ProfileData;
