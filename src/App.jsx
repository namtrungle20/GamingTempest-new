import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomeLayout from '@/layout/HomeLayout'
import AdminRoute from '@/components/common/AdminRoute'
import AdminLayout from '@/pages/admin/layout/AdminLayout'
import PageLoader from '@/pages/loader/PageLoader'

const HomePage = lazy(() => import('@/pages/HomePage'))
const NotFoundPage = lazy(() => import('@/pages/error/NotFoundPage'))
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashBoard'))
const UserManagePage = lazy(() => import('@/pages/admin/UserManagePage'))
const SanPhamManagePage = lazy(() => import('@/pages/admin/SanPhamManagerPage'))
const ProductListPage = lazy(() => import('@/pages/ProductListPage'))
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'))

// ✅ Wrapper tái sử dụng — tránh lặp Suspense + fallback
const Page = ({ component: Component }) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomeLayout />}>
          <Route index element={<Page component={HomePage} />} />
          <Route path='/products' element={<Page component={ProductListPage} />} />
          <Route path='/products/:id' element={<Page component={ProductDetailPage} />} />
        </Route>

        <Route path='/admin' element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<Page component={AdminDashboard} />} />
          <Route path='users' element={<Page component={UserManagePage} />} />
          <Route path='products' element={<Page component={SanPhamManagePage} />} />
        </Route>

        <Route path='*' element={<Page component={NotFoundPage} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App