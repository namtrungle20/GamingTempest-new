import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './layout/HomeLayout'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/error/NotFoundPage'
import AdminRoute from './components/commom/AdminRoute'
import UserManagePage from './pages/admin/UserManagePage'
import AdminLayout from '@/pages/admin/layout/AdminLayout'
import AdminDashboard from '@/pages/admin/AdminDashBoard'


function App() {

  return (
    <BrowserRouter>

      <Routes>
        <Route path='/' element={<Navigation />}>
          <Route index element={<HomePage />} />
        </Route>

        <Route path='/admin' element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path='users' element={<UserManagePage />} />
        </Route>

        {/* Error 404 */}
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App