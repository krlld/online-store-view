import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { message } from 'antd';
import AuthPage from './routes/auth-page';
import CategoryPage from './routes/category-page';
import ProductPage from './routes/product-page';
import HomePage from './routes/home-page';
import FavoritePage from './routes/favorite-page';
import CartPage from './routes/cart-page';
import ProfilePage from './routes/profile-page';
import RegisterPage from './routes/register-page';
import OrderPage from './routes/order-page';
import { checkUserRole } from './utils/check-user-role';
import StatisticPage from './routes/statistic-page';
import EmailPage from './routes/email-page';

message.config({
	duration: 2,
	maxCount: 1,
});

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomePage />,
	},
	{
		path: '/auth/authenticate',
		element: <AuthPage />,
	},
	{
		path: '/auth/register',
		element: <RegisterPage />,
	},
	{
		path: '/categories',
		element: checkUserRole(['ROLE_ADMIN']) ? <CategoryPage /> : <Navigate to="auth/authenticate" />,
	},
	{
		path: '/products',
		element: checkUserRole(['ROLE_ADMIN']) ? <ProductPage /> : <Navigate to="auth/authenticate" />,
	},
	{
		path: '/favorites',
		element: checkUserRole(['ROLE_ADMIN', 'ROLE_USER']) ? (
			<FavoritePage />
		) : (
			<Navigate to="auth/authenticate" />
		),
	},
	{
		path: '/cart',
		element: checkUserRole(['ROLE_ADMIN', 'ROLE_USER']) ? (
			<CartPage />
		) : (
			<Navigate to="auth/authenticate" />
		),
	},
	{
		path: '/orders',
		element: checkUserRole(['ROLE_ADMIN', 'ROLE_USER']) ? (
			<OrderPage />
		) : (
			<Navigate to="auth/authenticate" />
		),
	},
	{
		path: '/profile',
		element: checkUserRole(['ROLE_ADMIN', 'ROLE_USER']) ? (
			<ProfilePage />
		) : (
			<Navigate to="auth/authenticate" />
		),
	},
	{
		path: '/statistic',
		element: checkUserRole(['ROLE_ADMIN']) ? (
			<StatisticPage />
		) : (
			<Navigate to="auth/authenticate" />
		),
	},
	{
		path: '/emails',
		element: checkUserRole(['ROLE_ADMIN']) ? <EmailPage /> : <Navigate to="auth/authenticate" />,
	},
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
