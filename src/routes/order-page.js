import Navbar from '../navbar';
import OrderList from '../order/order-list';

const OrderPage = () => {
	return (
		<>
			<Navbar />
			<div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
				<OrderList />
			</div>
		</>
	);
};

export default OrderPage;
