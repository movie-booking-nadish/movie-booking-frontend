import React from 'react';

interface PlaceholderProps {
  title: string;
  description: string;
}

export const PlaceholderPage: React.FC<PlaceholderProps> = ({ title, description }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-lg text-center">
      <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
      <p className="text-gray-400 max-w-xl mx-auto">{description}</p>
    </div>
  </div>
);

export const MoviesPage: React.FC = () => (
  <PlaceholderPage
    title="Now Showing & Upcoming Movies"
    description="Browse all available movies, search by title and filter by genre and status."
  />
);

export const MovieDetailsPage: React.FC = () => (
  <PlaceholderPage
    title="Movie Details"
    description="View full details for this movie and explore upcoming showtimes."
  />
);

export const TheatresPage: React.FC = () => (
  <PlaceholderPage
    title="Our Theatres"
    description="Explore cinema halls, seating capacities and locations."
  />
);

export const ShowsPage: React.FC = () => (
  <PlaceholderPage
    title="Available Shows"
    description="Find scheduled movie screenings across all theatres."
  />
);

export const SeatSelectionPage: React.FC = () => (
  <PlaceholderPage
    title="Select Your Seats"
    description="Interactive seating chart to select your seats and proceed to booking."
  />
);

export const MyBookingsPage: React.FC = () => (
  <PlaceholderPage
    title="My Bookings"
    description="View your booking history, ticket details and booking status."
  />
);

export const AdminDashboardPage: React.FC = () => (
  <PlaceholderPage
    title="Admin Dashboard"
    description="Overview of bookings, movies, shows, theatres and system metrics."
  />
);

export const AdminMoviesPage: React.FC = () => (
  <PlaceholderPage
    title="Manage Movies"
    description="Add, edit, or remove movies from the catalog."
  />
);

export const AdminTheatresPage: React.FC = () => (
  <PlaceholderPage
    title="Manage Theatres"
    description="Create and manage theatres and seating configurations."
  />
);

export const AdminShowsPage: React.FC = () => (
  <PlaceholderPage
    title="Manage Shows"
    description="Schedule movie shows, set ticket prices and manage schedules."
  />
);

export const AdminBookingsPage: React.FC = () => (
  <PlaceholderPage
    title="Manage Bookings"
    description="Review all customer bookings and manage booking statuses."
  />
);

export const AdminUsersPage: React.FC = () => (
  <PlaceholderPage
    title="Manage Users"
    description="View customer accounts and manage user roles."
  />
);
