import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import ScrollToTop from '../components/ScrollToTop'
import Home from '../pages/public/Home'
import BrowseRecipes from '../pages/public/BrowseRecipes'
import RecipeDetails from '../pages/public/RecipeDetails'
import Login from '../pages/public/Login'
import Register from '../pages/public/Register'
import NotFound from '../pages/public/NotFound'
import PaymentSuccess from '../pages/public/PaymentSuccess'
import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoute'


import DashboardOverview from '../pages/dashboard/Overview'
import MyRecipes from '../pages/dashboard/MyRecipes'
import AddRecipe from '../pages/dashboard/AddRecipe'
import MyFavorites from '../pages/dashboard/MyFavorites'
import MyPurchased from '../pages/dashboard/MyPurchased'
import Profile from '../pages/dashboard/Profile'


import ManageUsers from '../pages/admin/ManageUsers'
import ManageRecipes from '../pages/admin/ManageRecipes'
import Reports from '../pages/admin/Reports'
import Transactions from '../pages/admin/Transactions'
import AdminOverview from '../pages/admin/Overview'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <ScrollToTop />
        <MainLayout />
      </>
    ),
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'browse-recipes', element: <BrowseRecipes /> },
      { path: 'recipe/:id', element: (
          <PrivateRoute>
            <RecipeDetails />
          </PrivateRoute>
        )
      },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'payment/success', element: (
          <PrivateRoute>
            <PaymentSuccess />
          </PrivateRoute>
        )
      },
      {
        path: 'dashboard',
        element: (
          <PrivateRoute>
            <ScrollToTop />
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <DashboardOverview /> },
          { path: 'my-recipes', element: <MyRecipes /> },
          { path: 'add-recipe', element: <AddRecipe /> },
          { path: 'edit-recipe/:id', element: <AddRecipe /> },
          { path: 'favorites', element: <MyFavorites /> },
          { path: 'purchased', element: <MyPurchased /> },
          { path: 'profile', element: <Profile /> },
          
          {
            path: 'manage-users',
            element: (
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            ),
          },
          {
            path: 'manage-recipes',
            element: (
              <AdminRoute>
                <ManageRecipes />
              </AdminRoute>
            ),
          },
          {
            path: 'reports',
            element: (
              <AdminRoute>
                <Reports />
              </AdminRoute>
            ),
          },
          {
            path: 'transactions',
            element: (
              <AdminRoute>
                <Transactions />
              </AdminRoute>
            ),
          },
          {
            path: 'overview',
            element: (
              <AdminRoute>
                <AdminOverview />
              </AdminRoute>
            ),
          },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])
