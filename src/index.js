import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { message } from 'antd';
import AuthPage from './routes/auth-page';
import CategoryPage from './routes/category-page';
import ProductPage from './routes/product-page';
import HomePage from './routes/home-page';

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
		path: '/categories',
		element: <CategoryPage />,
	},
	{
		path: '/products',
		element: <ProductPage />,
	},
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
