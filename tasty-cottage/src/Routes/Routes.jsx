import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home/Home/Home";
import Menu from "../Pages/Menu/Menu/Menu";
import Order from "../Pages/Order/Order/Order";
import Login from "../Pages/Login/Login";
import SignUp from "../Pages/SignUp/SignUp";
import PrivateRoute from "./PrivateRoute";
import Secret from "../Pages/Home/Shared/Secret/Secret";
import Dashboard from "../Layout/dashboard";
import Cart from "../Pages/Dashboard/cart/cart";
import AllUsers from "../Pages/Dashboard/AllUsers/AllUsers";
import AddItems from "../Pages/Dashboard/AddItems/AddItems";
import AdminRoute from "./AdminRoute";
import MangeItems from "../Pages/Dashboard/ManageItems/ManageItems";
import Payment from "../Pages/Dashboard/Payment/Payment";
import PaymentHistory from "../Pages/Dashboard/PaymentHistory/PaymentHistory";
import AdminHome from "../Pages/Dashboard/AdminHome/AdminHome";
import UserHome from "../Pages/Dashboard/UserHome/UserHome";
import Reservation from "../Pages/Dashboard/Reservation/Reservation";
import MyBookings from "../Pages/Dashboard/MyBookings/MyBookings";
import AddReview from "../Pages/Dashboard/AddReview/AddReview";
import ManageBookings from "../Pages/Dashboard/ManageBookings/ManageBookings";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [

      {
        path: "/",
        element: <Home></Home>
      },
      {
        path: "menu",
        element: <Menu></Menu>
      },
      {
        path: 'order/:category',
        element: <Order></Order>
      },
      {
        path: 'login',
        element: <Login></Login>
      },
      {
        path: 'signup',
        element: <SignUp></SignUp>
      },
      {
        path: 'secret',
        element: <PrivateRoute><Secret></Secret></PrivateRoute>

      }

    ]
  },

  {
    path: 'dashboard',
    element: <PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
    children: [

      
      {
        path: 'userHome',
        element: <UserHome></UserHome>
      },
      {
        path: 'cart',
        element: <Cart></Cart>
      },
      {
        path: 'payment',
        element: <Payment></Payment>
      },
      {
        path: 'paymentHistory',
        element: <PaymentHistory></PaymentHistory>
      },
      {
        path: 'reservation',
        element: <Reservation></Reservation>
      },
      {
        path: 'bookings',
        element: <MyBookings></MyBookings>
      },
      {
        path: 'review',
        element: <AddReview></AddReview>
      },

      
      {
        path: 'adminHome',
        element: <AdminRoute><AdminHome></AdminHome></AdminRoute>
      },
      {
        path: 'addItems',
        element: <AdminRoute><AddItems></AddItems></AdminRoute>

      },
      {
        path: 'manageItems',
        element: <AdminRoute><MangeItems></MangeItems></AdminRoute>

      },

      {
        path: 'users',
        element: <AdminRoute><AllUsers></AllUsers></AdminRoute>
      },
      {
        path: 'manageBookings',
        element: <AdminRoute><ManageBookings></ManageBookings></AdminRoute>
      },



    ]
  }





]);