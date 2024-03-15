import CartItemList from '../cart/cart-item-list';
import Navbar from '../navbar';

const CartPage = () => {
	return (
		<>
			<Navbar />
			<div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
				<CartItemList />
			</div>
		</>
	);
};

export default CartPage;
