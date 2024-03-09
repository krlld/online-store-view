import CategoryList from '../category/category-list';
import Navbar from '../navbar';

const CategoryPage = () => {
	return (
		<>
			<Navbar />
			<div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
				<CategoryList />
			</div>
		</>
	);
};

export default CategoryPage;
