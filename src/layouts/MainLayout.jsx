import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const MainLayout = () => {
  const location = useLocation()
  const isAuthPage = ['/login', '/register'].includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />
      <main className={`flex-1 ${isAuthPage ? '' : 'pt-20'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
