import { Navigate, createBrowserRouter } from "react-router-dom";
import HomePage from "../../features/Home/HomePage";
import App from "../layout/App";
import ContactPage from "../../features/contact/ContactPage";
import AboutPage from "../../features/about/AboutPage";
import Product from "../../features/Product/Product";
import ProductDetails from "../../features/Product/ProductDetails";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../../features/Basket/BasketPage";
import Register from "../../features/Account/Register";
import Login from "../../features/Account/Login";
import RequireAuth from "./RequireAuth";
import Order from "../../features/orders/Orders";
import OrderDetailes from "../../features/orders/OrderDetailes";
import CheckoutWrapper from "../../features/CheckOut/CheckoutWrapper";
import Inventory from "../../features/Admin/Inventory";
import Orders from "../../features/Admin/orders/List";
import Dashboard from "../../features/Admin/dashboards/Dashboard";
import DashboardHome from "../../features/Admin/dashboards/DashboardHome";

export const router = createBrowserRouter([

    {
        path: '/',
        element: <App />,
        children: [
            {
                element: <RequireAuth />, children: [
                    { path: 'checkout', element: <CheckoutWrapper /> },
                    { path: 'order', element: <Order /> },
                    { path: 'order/:id', element: <OrderDetailes /> },


                ],
            },

          
      {
        // admin routes
        element: <RequireAuth roles={["Admin"]} />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
            children: [
              { index: true, element: <DashboardHome /> },
              { path: "inventory", element: <Inventory /> },
              { path: "orders", element: <Orders /> },
            ],
          },
        ],
      },

            { path: '', element: <HomePage /> },
            { path: 'contact', element: <ContactPage /> },
            { path: 'about', element: <AboutPage /> },
            { path: 'product', element: <Product /> },
            { path: 'product/:id', element: <ProductDetails /> },
            { path: 'server-error', element: <ServerError /> },
            { path: 'not-found', element: <NotFound /> },
            { path: '*', element: <Navigate replace to='/not-found' /> },
            { path: 'basket', element: <BasketPage /> },
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },


               
            
        ]
    }
])