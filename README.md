# Movie Booking Frontend

A modern, responsive, and full-featured cinema movie ticket booking web application built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**. The application communicates with a secure **Spring Boot 3** REST backend via JWT-authenticated API endpoints.

---

## 🔗 Repository Links

* **Frontend Repository:** [https://github.com/movie-booking-nadish/movie-booking-frontend](https://github.com/movie-booking-nadish/movie-booking-frontend)
* **Backend Repository:** [https://github.com/movie-booking-nadish/movie-booking-backend](https://github.com/movie-booking-nadish/movie-booking-backend)

---

## 🛠 Tech Stack

* **Core Framework:** React 18.3 with TypeScript 5.5
* **Build Tool & Dev Server:** Vite 5.4
* **Routing:** React Router DOM v7
* **Styling:** Tailwind CSS 3.4 with PostCSS & Autoprefixer
* **HTTP Client:** Axios 1.20
* **State & Notifications:** React Context API (AuthContext, ToastContext)

---

## ✨ Features

### 👤 Customer Features
* **Authentication & Authorization:** Secure registration and login with form validation and role-based redirects.
* **Home & Movie Showcase:** Homepage featuring current `NOW_SHOWING` blockbusters, quick highlights, and responsive navigation.
* **Movie Discovery:** Browse, search by title, and filter movies by genre, language, and release status (`NOW_SHOWING`, `UPCOMING`, `ENDED`).
* **Movie Details:** Comprehensive view featuring synopses, duration, release dates, and high-resolution official TMDB posters.
* **Theatres & Venues:** Browse active cinema venues, seating capacities, and city locations.
* **Show Scheduling & Selection:** Filter available showtimes by movie, theatre venue, and date with real-time ticket pricing.
* **Interactive Seat Selection:** Visual interactive seat grid with instant pricing calculation and seat holding.
* **Booking Checkout:** Instant reservation creation with seat confirmation and redirection to checkout.
* **Payment Processing:** Support for Card, Cash, and Online payment methods with simulated gateway approvals and failure recovery.
* **My Bookings Dashboard:** Audit past and upcoming reservations with status badges, direct "Pay Now" for pending orders, and ticket cancellation with automated seat release.

### 🛡️ Admin Features
* **Admin Dashboard (`/admin`):** Live metric cards displaying total counts for movies, theatres, shows, and customer reservations with administrative quick actions.
* **Manage Movies:** Full CRUD management (Add, Edit, Delete) using modal dialogs, status filters, input validations, and confirmation modals.
* **Manage Theatres:** Manage hall venues, seating capacities, and active/inactive operational statuses.
* **Manage Shows:** Schedule showtimes with movie and theatre pickers, date/time inputs, ticket pricing, and backend conflict detection.
* **Manage Bookings:** Inspect all customer bookings across the platform with inline status updates (`CONFIRMED`, `PENDING`, `CANCELLED`) and cancellation handling.
* **Payment Transactions (`/admin/payments`):** Real-time audit log of all transaction records, payment methods, timestamps, and gateway statuses.
* **User Management (`/admin/users`):** Audit registered users, update contact info and roles (`ADMIN`, `CUSTOMER`), and delete accounts with self-deletion protection.

---

## 📂 Folder Structure

```
movie-booking-frontend/
├── public/
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── ConfirmDialog.tsx  # Confirmation modal dialog
│   │   ├── EmptyState.tsx     # Empty state placeholder with actions
│   │   ├── ErrorMessage.tsx   # Standardized error banner with retry
│   │   ├── Footer.tsx         # Responsive site footer
│   │   ├── Layout.tsx         # Base app layout wrapper (Navbar + Footer)
│   │   ├── Modal.tsx          # Reusable modal dialog
│   │   ├── MovieCard.tsx      # Movie display card
│   │   ├── Navbar.tsx         # Responsive navbar with role-aware links
│   │   ├── ProtectedRoute.tsx # Route guard for authenticated users
│   │   ├── RoleRoute.tsx      # Route guard for role permissions (ADMIN)
│   │   ├── SeatMap.tsx        # Interactive seat selection grid
│   │   ├── Spinner.tsx        # Reusable loading indicator
│   │   └── StatusBadge.tsx    # Universal color-coded status badges
│   ├── context/               # Global state providers
│   │   ├── AuthContext.tsx    # JWT auth state, login/logout methods
│   │   └── ToastContext.tsx   # Toast notification provider & useToast hook
│   ├── pages/                 # Route view pages
│   │   ├── AdminDashboard.tsx # Overview statistics and metric cards
│   │   ├── AdminPayments.tsx  # Admin transaction audit log
│   │   ├── BookShow.tsx       # Seat booking and reservation flow
│   │   ├── Home.tsx           # Home landing page with featured movies
│   │   ├── ManageBookings.tsx # Admin bookings management
│   │   ├── ManageMovies.tsx   # Admin movie CRUD management
│   │   ├── ManageShows.tsx    # Admin show scheduling
│   │   ├── ManageTheatres.tsx # Admin theatre CRUD management
│   │   ├── ManageUsers.tsx    # Admin user profiles and roles
│   │   ├── MovieDetails.tsx   # Single movie details page
│   │   ├── Movies.tsx         # Customer movie catalog with filters
│   │   ├── MyBookings.tsx     # Customer bookings history
│   │   ├── NotAllowed.tsx     # 403 Forbidden page
│   │   ├── NotFound.tsx       # 404 Not Found page
│   │   ├── Payment.tsx        # Payment checkout and gateway simulation
│   │   ├── Shows.tsx          # Customer show listings
│   │   ├── SignIn.tsx         # User authentication login
│   │   ├── SignUp.tsx         # User account registration
│   │   └── Theatres.tsx       # Public cinema theatre list
│   ├── services/              # Axios API service clients
│   │   ├── api.ts             # Axios instance with interceptors
│   │   ├── authService.ts     # Signin and signup API calls
│   │   ├── bookingService.ts  # Booking management API calls
│   │   ├── movieService.ts    # Movie catalogue API calls
│   │   ├── paymentService.ts  # Payment processing API calls
│   │   ├── showService.ts     # Show schedules API calls
│   │   ├── theatreService.ts  # Theatre venue API calls
│   │   └── userService.ts     # User management API calls
│   ├── types/                 # TypeScript interfaces and enums
│   │   └── index.ts
│   ├── App.tsx                # Application routes and context wrappers
│   ├── index.css              # Tailwind CSS directives
│   └── main.tsx               # Application entry point
├── .env.example
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 How to Run

### 1. Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm** (v9.0.0 or higher)
* **Spring Boot Backend** running on `http://localhost:8080` (with MySQL database)

### 2. Environment Setup
Copy `.env.example` to create `.env`:
```bash
cp .env.example .env
```
Ensure `VITE_API_URL` points to your running backend:
```env
VITE_API_URL=http://localhost:8080/api
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev -- --port 3000
```
Open [http://localhost:3000](http://localhost:3000) (or [http://localhost:5173](http://localhost:5173)) in your browser.

### 5. Production Build
```bash
npm run build
```

---

## 🔑 Demo Accounts

The backend database automatically seeds initial demo accounts for immediate access:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Admin** | `admin@moviebooking.com` | `Admin@123` | Full administrative control (`/admin`) |
| **Customer** | `customer@moviebooking.com` | `Customer@123` | Ticket booking and reservations (`/movies`) |

---

## 🔐 How the JWT is Stored & Handled

* **Storage:** Upon successful authentication (`POST /api/auth/signin`), the JWT token is saved in the browser's `localStorage` under the key `'token'`, along with the serialized user profile under `'user'`.
* **Request Interceptor:** In `src/services/api.ts`, an Axios request interceptor attaches the bearer token to the HTTP `Authorization` header:
  ```ts
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  ```
* **Response Interceptor:** An Axios response interceptor monitors all responses. If an HTTP `401 Unauthorized` status is received, it automatically wipes the stored token and user data from `localStorage` and redirects the user to `/signin`.