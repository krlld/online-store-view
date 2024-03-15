import FavoriteList from '../favorite/favorite-list';
import Navbar from '../navbar';

const FavoritePage = () => {
	return (
		<>
			<Navbar />
			<div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
				<FavoriteList />
			</div>
		</>
	);
};

export default FavoritePage;
