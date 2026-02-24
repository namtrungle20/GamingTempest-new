import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './layout/Header/Navigation'
import HomePage from './pages/HomePage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Toàn bộ các trang nằm bên trong Navigation Layout */}
        <Route path='/' element={<Navigation />}>
          <Route index element={<HomePage />} />
          {/* Thêm các trang khác như /cart, /checkout ở đây */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App