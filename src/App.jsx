import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './layout/Header/Navigation'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/error/NotFoundPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigation />}>
          <Route index element={<HomePage />} />
        </Route>
        {/* Error 404 */}
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App