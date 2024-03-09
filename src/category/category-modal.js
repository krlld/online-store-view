import { Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { config } from '../utils/get-axios-config';

const CategoryModal = (props) => {
	const handleUpdateCategory = async (updatedCategory) => {
		try {
			const response = await axios.put(
				`http://localhost:8080/api/v1/categories/${props.selectedCategory.id}`,
				updatedCategory,
				config
			);
			props.setCategories(
				props.categories.map((category) =>
					category.id === props.selectedCategory.id ? response.data : category
				)
			);
			message.success('Категория успешно обновлена');
		} catch (error) {
			console.error('Ошибка при обновлении  категории:', error);
			message.error('Ошибка при обновлении категории');
		}
		props.closeModal();
	};

	return (
		<>
			<Modal
				title="Редактировать категорию"
				visible={props.modalVisible}
				onCancel={props.closeModal}
				footer={null}
			>
				{props.selectedCategory && (
					<Form onFinish={handleUpdateCategory}>
						<Form.Item
							label="Название категории"
							name="name"
							initialValue={props.selectedCategory.name}
							rules={[{ required: true, message: 'Введите название категории' }]}
						>
							<Input />
						</Form.Item>
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

export default CategoryModal;
