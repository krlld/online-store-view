import { Layout, Row, Col } from 'antd';

const { Footer } = Layout;

const AppFooter = () => {
	return (
		<Footer style={{ textAlign: 'center' }}>
			<Row gutter={[16, 16]}>
				<Col span={8}>
					<h3>О нас</h3>
					<p>
						Мы - инновационная компания, специализирующаяся на разработке передовых решений в
						области технологий и программного обеспечения.
					</p>
				</Col>
				<Col span={8}>
					<h3>Контакты</h3>
					<p>Телефон: +123456789</p>
					<p>Email: info@example.com</p>
				</Col>
				<Col span={8}>
					<h3>Социальные сети</h3>
					<p>Мы в социальных сетях:</p>
					<p>Facebook, Twitter, Instagram</p>
				</Col>
			</Row>
			<p>Все права защищены © 2024 Awesome Soft</p>
		</Footer>
	);
};

export default AppFooter;
