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
const CheckoutPage = lazy(() => import('@/pages/CheckOutPage'))
const PaymentReturn = lazy(() => import('@/pages/PaymentReturnPage'))
const DonHangManagerPage = lazy(() => import('@/pages/admin/DonHangManagerPage'))
const MyOrdersPage = lazy(() => import('@/pages/MyOrdersPage'))
const PaymentResultPage = lazy(() => import('@/pages/PaymentResultPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const DanhGiaManagerPage = lazy(() => import('@/pages/admin/DanhGiaManager'))
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'))


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
          <Route path="/donhang" element={<Page component={MyOrdersPage} />} />
          <Route path="/profile" element={<Page component={ProfilePage} />} />
          <Route path='/checkout' element={<Page component={CheckoutPage} />} />
          <Route path="/thanhtoan/return" element={<Page component={PaymentReturn} />} />
          <Route path='/payment/result' element={<Page component={PaymentResultPage} />} />
          <Route path="/forgot-password" element={<Page component={ForgotPasswordPage} />} />
          <Route path="/reset-password" element={<Page component={ResetPasswordPage} />} />
        </Route>

        <Route path='/admin' element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<Page component={AdminDashboard} />} />
          <Route path="orders" element={<Page component={DonHangManagerPage} />} />
          <Route path='users' element={<Page component={UserManagePage} />} />
          <Route path='products' element={<Page component={SanPhamManagePage} />} />
          <Route path='danhgia' element={<Page component={DanhGiaManagerPage} />} />
        </Route>

        <Route path='*' element={<Page component={NotFoundPage} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App