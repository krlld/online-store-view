import { Layout, Menu } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const Navbar = () => {
	return (
		<Layout>
			<Header>
				<Menu theme="dark" mode="horizontal">
					<Menu.Item key="1" icon={<HomeOutlined />}>
						<Link to="/">Главная</Link>
					</Menu.Item>
					<Menu.Item key="2" icon={<UserOutlined />}>
						<Link to="/categories">Категории</Link>
					</Menu.Item>
					<Menu.Item key="3" icon={<UserOutlined />}>
						<Link to="/products">Товары</Link>
					</Menu.Item>
				</Menu>
			</Header>
		</Layout>
	);
};

export default Navbar;
