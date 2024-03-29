import { Layout, Menu } from 'antd';
import {
	HomeOutlined,
	UserOutlined,
	TagOutlined,
	TagsOutlined,
	HeartOutlined,
	ShoppingCartOutlined,
	TruckOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { checkUserRole } from './utils/check-user-role';

const { Header } = Layout;

const Navbar = () => {
	return (
		<Layout>
			<Header>
				<Menu theme="dark" mode="horizontal">
					<Menu.Item key="1" icon={<HomeOutlined />}>
						<Link to="/">Главная</Link>
					</Menu.Item>
					{checkUserRole(['ROLE_ADMIN']) && (
						<>
							<Menu.Item key="2" icon={<TagOutlined />}>
								<Link to="/categories">Категории</Link>
							</Menu.Item>
							<Menu.Item key="3" icon={<TagsOutlined />}>
								<Link to="/products">Товары</Link>
							</Menu.Item>
						</>
					)}
					{checkUserRole(['ROLE_ADMIN', 'ROLE_USER']) && (
						<>
							<Menu.Item key="4" icon={<HeartOutlined />}>
								<Link to="/favorites">Избранное</Link>
							</Menu.Item>
							<Menu.Item key="5" icon={<ShoppingCartOutlined />}>
								<Link to="/cart">Корзина</Link>
							</Menu.Item>
							<Menu.Item key="6" icon={<TruckOutlined />}>
								<Link to="/orders">Заказы</Link>
							</Menu.Item>
							<Menu.Item key="7" icon={<UserOutlined />}>
								<Link to="/profile">Профиль</Link>
							</Menu.Item>
						</>
					)}
				</Menu>
			</Header>
		</Layout>
	);
};

export default Navbar;
