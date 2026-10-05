export type Role = 'ADMIN' | 'CUSTOMER';
export type MovieStatus = 'UPCOMING' | 'NOW_SHOWING' | 'ENDED';
export type TheatreStatus = 'ACTIVE' | 'INACTIVE';
export type ShowStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'CARD' | 'CASH' | 'ONLINE';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  fullName: string;
  email: string;
  role: Role;
}

export interface Movie {
  id: number;
  title: string;
  description?: string;
  duration: number;
  language: string;
  genre: string;
  releaseDate: string;
  status: MovieStatus;
  posterUrl?: string;
}

export interface MovieRequest {
  title: string;
  description?: string;
  duration: number;
  language: string;
  genre: string;
  releaseDate: string;
  status: MovieStatus;
  posterUrl?: string;
}

export interface Theatre {
  id: number;
  name: string;
  location: string;
  capacity: number;
  status: TheatreStatus;
}

export interface TheatreRequest {
  name: string;
  location: string;
  capacity: number;
  status: TheatreStatus;
}

export interface Show {
  id: number;
  movieId: number;
  movieTitle?: string;
  theatreId: number;
  theatreName?: string;
  showDate: string;
  showTime: string;
  ticketPrice: number;
  status: ShowStatus;
}

export interface ShowRequest {
  movieId: number;
  theatreId: number;
  showDate: string;
  showTime: string;
  ticketPrice: number;
  status: ShowStatus;
}

export interface Booking {
  id: number;
  userId?: number;
  userFullName?: string;
  showId: number;
  movieTitle?: string;
  theatreName?: string;
  showDate?: string;
  showTime?: string;
  seatNumbers: string[];
  numberOfTickets: number;
  totalAmount: number;
  bookingDate?: string;
  status: BookingStatus;
}

export interface BookingRequest {
  showId: number;
  seatNumbers: string[];
  numberOfTickets: number;
}

export interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  paymentDate?: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
}

export interface PaymentRequest {
  bookingId: number;
  paymentMethod: PaymentMethod;
}

export interface SeatAvailability {
  showId: number;
  capacity: number;
  seatsPerRow: number;
  bookedSeats: string[];
}

export interface ApiError {
  timestamp?: string;
  status: number;
  error: string;
  message: string;
  path?: string;
  fieldErrors?: Record<string, string>;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

export interface UserUpdateRequest {
  fullName: string;
  phone: string;
}
