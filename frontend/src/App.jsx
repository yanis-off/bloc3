import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import Home from './pages/public/Home'
import Films from './pages/public/Films'
import Dashboard from './pages/admin/Dashboard'
import Categories from './pages/admin/Categories'
import Rooms from './pages/admin/Rooms'
import PrivateRoute from './components/PrivateRoute'
import FilmsList from './pages/admin/films/FilmsList'
import FilmCreate from './pages/admin/films/FilmCreate'
import FilmEdit from './pages/admin/films/FilmEdit'
import ScreeningsList from './pages/admin/Screenings/ScreeningsList'
import ScreeningCreate from './pages/admin/Screenings/ScreeningCreate'
import ScreeningEdit from './pages/admin/screenings/ScreeningEdit'
import BookingsList from './pages/admin/BookingsList'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/films" element={<Films />} />

        <Route path="/admin" element={
          <PrivateRoute adminOnly={true}><Dashboard /></PrivateRoute>
        } />

        <Route path="/admin/categories" element={
          <PrivateRoute adminOnly={true}><Categories /></PrivateRoute>
        } />

        <Route path="/admin/rooms" element={
          <PrivateRoute adminOnly={true}><Rooms /></PrivateRoute>
        } />

        <Route path="/admin/films" element={
          <PrivateRoute adminOnly={true}><FilmsList /></PrivateRoute>
        } />

        <Route path="/admin/films/create" element={
          <PrivateRoute adminOnly={true}><FilmCreate /></PrivateRoute>
        } />

        <Route path="/admin/films/:id/edit" element={
          <PrivateRoute adminOnly={true}><FilmEdit /></PrivateRoute>
        } />

        <Route path="/admin/screenings" element={
          <PrivateRoute adminOnly={true}><ScreeningsList /></PrivateRoute>
        } />

        <Route path="/admin/screenings/create" element={
          <PrivateRoute adminOnly={true}><ScreeningCreate /></PrivateRoute>
        } />

        <Route path="/admin/screenings/:id/edit" element={
          <PrivateRoute adminOnly={true}><ScreeningEdit /></PrivateRoute>
        } />

        <Route path="/admin/bookings" element={
          <PrivateRoute adminOnly={true}><BookingsList /></PrivateRoute>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App