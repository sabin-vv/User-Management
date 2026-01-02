
import { ToastContainer, Slide } from 'react-toastify'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes'
import Login from './pages/user/Login'
import UserHome from './pages/user/Home'
import Profile from './pages/user/Profile'
import AdminHome from './pages/admin/Home'
import AdminLogin from './pages/admin/Login'
import { useAuthInit } from './useAuthInit'

function App() {
  useAuthInit()

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
      <Routes >
        <Route path='/' element={
          <ProtectedRoutes role="user">
            <UserHome />
          </ProtectedRoutes>
        } />
        <Route path='/login' element={<Login mode="signin" />} />
        <Route path='/signup' element={<Login mode="signup" />} />
        <Route path='/user/profile' element={
          <ProtectedRoutes role="user">
            <Profile />
          </ProtectedRoutes>
        } />

        <Route path='/admin/home' element={
          <ProtectedRoutes role="admin">
            <AdminHome />
          </ProtectedRoutes>
        } />
        <Route path='/admin' element={<AdminLogin />} />
      </Routes>
    </>
  )
}

export default App
