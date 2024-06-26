import AppFooter from '../footer';
import HomeList from '../home/home-list';
import Navbar from '../navbar';

const HomePage = () => {
	return (
		<>
			<Navbar />
			<div style={{ margin: '20px' }}>
				<HomeList />
			</div>
			<AppFooter />
		</>
	);
};

export default HomePage;
