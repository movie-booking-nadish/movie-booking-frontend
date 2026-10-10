import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import Theatres from './pages/Theatres';
import Shows from './pages/Shows';
import BookShow from './pages/BookShow';
import MyBookings from './pages/MyBookings';
import PaymentPage from './pages/Payment';
import AdminDashboard from './pages/AdminDashboard';
import ManageMovies from './pages/ManageMovies';
import ManageTheatres from './pages/ManageTheatres';
import ManageShows from './pages/ManageShows';
import NotAllowed from './pages/NotAllowed';
import NotFound from './pages/NotFound';
import {
  AdminBookingsPage,
  AdminUsersPage,
} from './pages/Placeholders';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public authentication pages */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Main layout with Navbar and Footer */}
          <Route element={<Layout />}>
            {/* Public browsing routes */}
            <Route path="/" element={<Navigate to="/movies" replace />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="/theatres" element={<Theatres />} />

            {/* Customer protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/shows" element={<Shows />} />
              <Route path="/shows/:id/book" element={<BookShow />} />
              <Route path="/shows/:id/seats" element={<BookShow />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/bookings/:id/payment" element={<PaymentPage />} />
            </Route>

            {/* Admin protected routes */}
            <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/movies" element={<ManageMovies />} />
              <Route path="/admin/theatres" element={<ManageTheatres />} />
              <Route path="/admin/shows" element={<ManageShows />} />
              <Route path="/admin/bookings" element={<AdminBookingsPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
            </Route>

            <Route path="/not-allowed" element={<NotAllowed />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
