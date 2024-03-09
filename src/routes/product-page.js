import Navbar from '../navbar';
import ProductList from '../product/product-list';

const ProductPage = () => {
	return (
		<>
			<Navbar />
			<div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
				<ProductList />
			</div>
		</>
	);
};

export default ProductPage;
