import React, { useEffect, useState } from 'react';
import { showService } from '../services/showService';
import { movieService } from '../services/movieService';
import { theatreService } from '../services/theatreService';
import { Show, ShowRequest, ShowStatus, Movie, Theatre } from '../types';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const INITIAL_FORM: ShowRequest = {
  movieId: 0,
  theatreId: 0,
  showDate: new Date().toISOString().split('T')[0],
  showTime: '18:30:00',
  ticketPrice: 1000,
  status: 'SCHEDULED',
};

const ManageShows: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filters
  const [selectedMovieFilter, setSelectedMovieFilter] = useState<string>('ALL');
  const [selectedTheatreFilter, setSelectedTheatreFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const [formData, setFormData] = useState<ShowRequest>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [modalBackendError, setModalBackendError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Confirm delete state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [deletingShow, setDeletingShow] = useState<Show | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [showsData, moviesData, theatresData] = await Promise.all([
        showService.getAll(),
        movieService.getAll(),
        theatreService.getAll(),
      ]);

      setShows(showsData);
      setMovies(moviesData);
      setTheatres(theatresData);

      // Pre-select default IDs for add form if available
      if (moviesData.length > 0 && formData.movieId === 0) {
        setFormData((prev) => ({
          ...prev,
          movieId: moviesData[0].id,
          theatreId: theatresData.length > 0 ? theatresData[0].id : 0,
        }));
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load shows data.');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingShow(null);
    setFormData({
      movieId: movies.length > 0 ? movies[0].id : 0,
      theatreId: theatres.length > 0 ? theatres[0].id : 0,
      showDate: new Date().toISOString().split('T')[0],
      showTime: '18:30:00',
      ticketPrice: 1000,
      status: 'SCHEDULED',
    });
    setFormErrors({});
    setModalBackendError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (show: Show) => {
    setEditingShow(show);
    // Ensure showTime format has seconds
    let time = show.showTime || '18:30:00';
    if (time.length === 5) time = `${time}:00`;

    setFormData({
      movieId: show.movieId,
      theatreId: show.theatreId,
      showDate: show.showDate,
      showTime: time,
      ticketPrice: show.ticketPrice,
      status: show.status,
    });
    setFormErrors({});
    setModalBackendError(null);
    setIsModalOpen(true);
  };

  const openDeleteDialog = (show: Show) => {
    setDeletingShow(show);
    setIsDeleteDialogOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.movieId || formData.movieId === 0) errors.movieId = 'Please select a movie';
    if (!formData.theatreId || formData.theatreId === 0) errors.theatreId = 'Please select a theatre';
    if (!formData.showDate) errors.showDate = 'Show date is required';
    if (!formData.showTime) errors.showTime = 'Show time is required';
    if (!formData.ticketPrice || formData.ticketPrice <= 0) errors.ticketPrice = 'Price must be greater than 0';

    // Extra UX warnings for ended movie or inactive theatre
    const movie = movies.find((m) => m.id === Number(formData.movieId));
    if (movie && movie.status === 'ENDED') {
      errors.movieId = 'Cannot schedule show for a movie with status ENDED';
    }

    const theatre = theatres.find((t) => t.id === Number(formData.theatreId));
    if (theatre && theatre.status === 'INACTIVE') {
      errors.theatreId = 'Cannot schedule show in an INACTIVE theatre';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setModalBackendError(null);

      // Ensure showTime has seconds: HH:mm:ss
      let time = formData.showTime;
      if (time.length === 5) time = `${time}:00`;

      const payload: ShowRequest = {
        movieId: Number(formData.movieId),
        theatreId: Number(formData.theatreId),
        showDate: formData.showDate,
        showTime: time,
        ticketPrice: Number(formData.ticketPrice),
        status: formData.status,
      };

      if (editingShow) {
        await showService.update(editingShow.id, payload);
        setFeedback({ type: 'success', message: `Show #${editingShow.id} updated successfully.` });
      } else {
        await showService.create(payload);
        setFeedback({ type: 'success', message: 'Show scheduled successfully.' });
      }

      setIsModalOpen(false);
      await loadAllData();
    } catch (err: any) {
      setModalBackendError(
        err?.response?.data?.message ||
          'Failed to schedule show. Please check for scheduling conflicts.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingShow) return;

    try {
      setDeleting(true);
      await showService.delete(deletingShow.id);
      setFeedback({ type: 'success', message: `Show #${deletingShow.id} deleted successfully.` });
      setIsDeleteDialogOpen(false);
      setDeletingShow(null);
      await loadAllData();
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || `Failed to delete show #${deletingShow.id}.`,
      });
      setIsDeleteDialogOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const filteredShows = shows.filter((s) => {
    const matchesMovie = selectedMovieFilter === 'ALL' || s.movieId === Number(selectedMovieFilter);
    const matchesTheatre = selectedTheatreFilter === 'ALL' || s.theatreId === Number(selectedTheatreFilter);
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesDate = !dateFilter || s.showDate === dateFilter;
    return matchesMovie && matchesTheatre && matchesStatus && matchesDate;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Manage Shows</h1>
          <p className="text-gray-500 mt-1">
            Schedule movie screenings across theatres, set ticket pricing, and prevent timetable conflicts
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition cursor-pointer self-start sm:self-auto"
        >
          <span>➕</span>
          <span>Schedule New Show</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <span>{feedback.type === 'success' ? '✅' : '❌'}</span>
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-sm font-semibold opacity-70 hover:opacity-100 cursor-pointer ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Filter Movie</label>
          <select
            value={selectedMovieFilter}
            onChange={(e) => setSelectedMovieFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Movies</option>
            {movies.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Filter Theatre</label>
          <select
            value={selectedTheatreFilter}
            onChange={(e) => setSelectedTheatreFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Theatres</option>
            {theatres.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Filter Date</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Filter Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="RUNNING">Running</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Main Table or Loading/Empty State */}
      {loading ? (
        <Spinner text="Loading shows..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadAllData} />
      ) : filteredShows.length === 0 ? (
        <EmptyState
          icon="🎭"
          title="No Shows Found"
          description={
            selectedMovieFilter !== 'ALL' || selectedTheatreFilter !== 'ALL' || dateFilter || statusFilter !== 'ALL'
              ? 'No scheduled shows match your filter criteria.'
              : 'No movie shows are scheduled yet. Click "Schedule New Show" above!'
          }
          actionText={
            selectedMovieFilter !== 'ALL' || selectedTheatreFilter !== 'ALL' || dateFilter || statusFilter !== 'ALL'
              ? 'Reset All Filters'
              : 'Schedule New Show'
          }
          onAction={
            selectedMovieFilter !== 'ALL' || selectedTheatreFilter !== 'ALL' || dateFilter || statusFilter !== 'ALL'
              ? () => {
                  setSelectedMovieFilter('ALL');
                  setSelectedTheatreFilter('ALL');
                  setDateFilter('');
                  setStatusFilter('ALL');
                }
              : openAddModal
          }
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Movie</th>
                  <th className="px-6 py-4">Theatre</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredShows.map((show) => (
                  <tr key={show.id} className="hover:bg-gray-50/70 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{show.movieTitle || `Movie #${show.movieId}`}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-800 flex items-center gap-1.5">
                        <span>🏛️</span>
                        <span>{show.theatreName || `Theatre #${show.theatreId}`}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{show.showDate}</div>
                      <div className="text-xs text-gray-500">⏰ {show.showTime}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600">
                      Rs. {Number(show.ticketPrice).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={show.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(show)}
                          className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteDialog(show)}
                          className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Show Modal */}
      <Modal
        isOpen={isModalOpen}
        title={editingShow ? `Edit Show #${editingShow.id}` : 'Schedule New Show'}
        onClose={() => !submitting && setIsModalOpen(false)}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {modalBackendError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
              ⚠️ {modalBackendError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Select Movie *
            </label>
            <select
              value={formData.movieId}
              onChange={(e) => setFormData({ ...formData, movieId: Number(e.target.value) })}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${
                formErrors.movieId ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value={0}>-- Choose Movie --</option>
              {movies.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} {m.status === 'ENDED' ? ' [ENDED - Not Allowed]' : ''}
                </option>
              ))}
            </select>
            {formErrors.movieId && (
              <p className="text-red-500 text-xs mt-1">{formErrors.movieId}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Select Theatre *
            </label>
            <select
              value={formData.theatreId}
              onChange={(e) => setFormData({ ...formData, theatreId: Number(e.target.value) })}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${
                formErrors.theatreId ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value={0}>-- Choose Theatre --</option>
              {theatres.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.location}) {t.status === 'INACTIVE' ? ' [INACTIVE - Not Allowed]' : ''}
                </option>
              ))}
            </select>
            {formErrors.theatreId && (
              <p className="text-red-500 text-xs mt-1">{formErrors.theatreId}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Show Date *
              </label>
              <input
                type="date"
                value={formData.showDate}
                onChange={(e) => setFormData({ ...formData, showDate: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${
                  formErrors.showDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.showDate && (
                <p className="text-red-500 text-xs mt-1">{formErrors.showDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Show Time *
              </label>
              <input
                type="time"
                step="1"
                value={formData.showTime.substring(0, 5)}
                onChange={(e) => setFormData({ ...formData, showTime: `${e.target.value}:00` })}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${
                  formErrors.showTime ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.showTime && (
                <p className="text-red-500 text-xs mt-1">{formErrors.showTime}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Ticket Price (Rs.) *
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={formData.ticketPrice}
                onChange={(e) => setFormData({ ...formData, ticketPrice: Number(e.target.value) })}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  formErrors.ticketPrice ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.ticketPrice && (
                <p className="text-red-500 text-xs mt-1">{formErrors.ticketPrice}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ShowStatus })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="RUNNING">RUNNING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={submitting}
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingShow ? 'Update Show' : 'Create Show'}</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Show"
        message={`Are you sure you want to delete this show on ${deletingShow?.showDate} at ${deletingShow?.showTime}? Existing customer reservations for this show will be impacted.`}
        confirmText="Yes, Delete Show"
        cancelText="Cancel"
        isDanger={true}
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          if (!deleting) {
            setIsDeleteDialogOpen(false);
            setDeletingShow(null);
          }
        }}
      />
    </div>
  );
};

export default ManageShows;
