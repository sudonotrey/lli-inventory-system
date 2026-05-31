import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import AdminRoute from './components/AdminRoute'

function App() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='*' element={<Navigate to='/login' />} />
    </Routes>
  )
}

export default App