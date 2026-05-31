import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage  from './pages/DashboardPage'
import CategoriesPage from './pages/CategoriesPage'
import SuppliersPage  from './pages/SuppliersPage'
import UnitsPage      from './pages/UnitsPage'
import ProductsPage   from './pages/ProductsPage'
import ReportsPage    from './pages/ReportsPage'
import MainLayout     from './components/MainLayout'
import AdminRoute from './components/AdminRoute'

function App() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route
        path='/'
        element={
          <AdminRoute>
            <MainLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to='/dashboard' />} />
        <Route path='dashboard' element={<DashboardPage />} />
        <Route path='categories' element={<CategoriesPage />} />
        <Route path='suppliers'  element={<SuppliersPage />} />
        <Route path='units'      element={<UnitsPage />} />
        <Route path='products'   element={<ProductsPage />} />
        <Route path='reports'    element={<ReportsPage />} />
      </Route>
      <Route path='*' element={<Navigate to='/login' />} />
    </Routes>
  )
}

export default App