import { useEffect, useState } from 'react';
import { Modal, Pagination, Typography, List, Rate } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { config } from '../utils/get-axios-config';
import ReviewForm from './review-form';

const { Text } = Typography;

const ReviewModal = (props) => {
	const navigate = useNavigate();

	const [reviews, setReviews] = useState([]);

	const [currentPage, setCurrentPage] = useState(1);
	const [total, setTotal] = useState(1);
	const [pageSize, setPageSize] = useState(1);

	const handlePageChange = (page, pageSize) => {
		setCurrentPage(page);
		setPageSize(pageSize);
		fetchReviews(page, pageSize);
		// Здесь вы можете выполнить дополнительные действия при изменении страницы, например, загрузить данные для новой страницы.
	};

	const [productId, setProductId] = useState(null);
	const [productName, setProductName] = useState(null);
	const [totalReviews, setTotalReviews] = useState(null);
	useEffect(() => {
		// Выполняем запрос к серверу при монтировании компонента
		if (props.modalVisible) {
			setProductId(props.selectedProduct.productDto.id);
			setProductName(props.selectedProduct.productDto.name);
			setTotalReviews(props.selectedProduct.productDto.totalReviews);
			fetchReviews();
		}
	}, [props.modalVisible]);

	const onAdd = (review) => {
		setReviews([review, ...reviews]); // Обновляем состояние списка категорий, добавляя новую категорию
		incrementReviews();
		props.updateRating(productId, review.rating);
	};

	const fetchReviews = async (page, size) => {
		try {
			// Выполняем GET-запрос к серверу для получения списка категорий
			const response = await axios.get(
				`http://localhost:8080/api/v1/reviews/${props.selectedProduct.productDto.id}?page=${
					page - 1
				}&size=${size}&sort=id,desc`,
				config
			);
			setReviews(response.data.content); // Обновляем состояние списка категорий
			setTotal(response.data.totalElements);
			setPageSize(response.data.size);
			console.log(response.data.content);
		} catch (error) {
			console.log(error);
			navigate('/auth/authenticate');
			console.error('Ошибка при загрузке отзывов:', error);
		}
	};

	const incrementReviews = () => {
		setTotalReviews(totalReviews + 1);
	};

	return (
		<>
			<Modal
				title={`Отзывы к ${productName}`}
				visible={props.modalVisible}
				onCancel={props.closeModal}
				footer={null}
			>
				<ReviewForm onAdd={onAdd} productId={productId} />
				<div style={{ marginBottom: 16 }}>
					<Text strong>Общее количество отзывов: </Text>
					<Text>{totalReviews}</Text>
				</div>
				<List
					dataSource={reviews}
					renderItem={(review) => (
						<div key={review.id} style={{ marginBottom: 16 }}>
							<div>
								<Text strong>Пользователь: </Text>
								<Text>{review.userName}</Text>
							</div>
							<div>
								<Rate disabled allowHalf defaultValue={review.rating} />
							</div>
							<div>
								<Text strong>Отзыв: </Text>
								<Text>{review.content}</Text>
							</div>
						</div>
					)}
				/>
				<Pagination
					style={{ marginTop: '20px' }}
					current={currentPage}
					total={total} // Общее количество элементов, которые нужно разделить на страницы
					pageSize={pageSize} // Количество элементов на странице
					onChange={handlePageChange} // Обработчик изменения страницы
				/>
			</Modal>
		</>
	);
};

export default ReviewModal;
