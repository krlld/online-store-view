import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { message } from 'antd';
import AuthPage from './routes/auth-page';
import CategoryPage from './routes/category-page';
import ProductPage from './routes/product-page';
import HomePage from './routes/home-page';
import FavoritePage from './routes/favorite-page';
import CartPage from './routes/cart-page';
import ProfilePage from './routes/profile-page';
import RegisterPage from './routes/register-page';

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
		element: <CategoryPage />,
	},
	{
		path: '/products',
		element: <ProductPage />,
	},
	{
		path: '/favorites',
		element: <FavoritePage />,
	},
	{
		path: '/cart',
		element: <CartPage />,
	},
	{
		path: '/profile',
		element: <ProfilePage />,
	},
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
