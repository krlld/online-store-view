import { useEffect, useState } from 'react';
import { Modal, Image } from 'antd';

const PriceChangeModal = (props) => {
	const [productId, setProductId] = useState(null);
	const [productName, setProductName] = useState(null);

	useEffect(() => {
		// Выполняем запрос к серверу при монтировании компонента
		if (props.modalVisible) {
			setProductId(props.selectedProduct.productDto.id);
			setProductName(props.selectedProduct.productDto.name);
			console.log(productId);
		}
	}, [props.modalVisible]);

	return (
		<>
			<Modal
				title={`График изменения цены на ${productName}`}
				visible={props.modalVisible}
				onCancel={props.closeModal}
				footer={null}
			>
				<Image
					width={400}
					src={`http://localhost:8080/api/v1/statistics/price-history/${productId}`}
				/>
			</Modal>
		</>
	);
};

export default PriceChangeModal;
