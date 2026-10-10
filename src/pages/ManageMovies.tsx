import React, { useEffect, useState } from 'react';
import { movieService } from '../services/movieService';
import { Movie, MovieRequest, MovieStatus } from '../types';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';

const GENRES = [
  'ACTION',
  'COMEDY',
  'DRAMA',
  'HORROR',
  'ROMANCE',
  'SCI_FI',
  'THRILLER',
  'ANIMATION',
  'ADVENTURE',
  'FANTASY',
];

const INITIAL_FORM: MovieRequest = {
  title: '',
  description: '',
  duration: 120,
  language: 'English',
  genre: 'ACTION',
  releaseDate: new Date().toISOString().split('T')[0],
  status: 'NOW_SHOWING',
  posterUrl: '',
};

const ManageMovies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Search/filter state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [formData, setFormData] = useState<MovieRequest>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [modalBackendError, setModalBackendError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Confirm delete state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [deletingMovie, setDeletingMovie] = useState<Movie | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await movieService.getAll();
      setMovies(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch movies.');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingMovie(null);
    setFormData(INITIAL_FORM);
    setFormErrors({});
    setModalBackendError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (movie: Movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description,
      duration: movie.duration,
      language: movie.language,
      genre: movie.genre,
      releaseDate: movie.releaseDate,
      status: movie.status,
      posterUrl: movie.posterUrl || '',
    });
    setFormErrors({});
    setModalBackendError(null);
    setIsModalOpen(true);
  };

  const openDeleteDialog = (movie: Movie) => {
    setDeletingMovie(movie);
    setIsDeleteDialogOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description?.trim()) errors.description = 'Description is required';
    if (!formData.language.trim()) errors.language = 'Language is required';
    if (!formData.duration || formData.duration <= 0) errors.duration = 'Duration must be greater than 0';
    if (!formData.releaseDate) errors.releaseDate = 'Release date is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setModalBackendError(null);

      if (editingMovie) {
        await movieService.update(editingMovie.id, formData);
        setFeedback({ type: 'success', message: `Movie "${formData.title}" updated successfully.` });
      } else {
        await movieService.create(formData);
        setFeedback({ type: 'success', message: `Movie "${formData.title}" created successfully.` });
      }

      setIsModalOpen(false);
      await fetchMovies();
    } catch (err: any) {
      setModalBackendError(err?.response?.data?.message || 'Failed to save movie.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingMovie) return;

    try {
      setDeleting(true);
      await movieService.delete(deletingMovie.id);
      setFeedback({ type: 'success', message: `Movie "${deletingMovie.title}" deleted successfully.` });
      setIsDeleteDialogOpen(false);
      setDeletingMovie(null);
      await fetchMovies();
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || `Failed to delete movie "${deletingMovie.title}".`,
      });
      setIsDeleteDialogOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const filteredMovies = movies.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.language.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Manage Movies</h1>
          <p className="text-gray-500 mt-1">Create, update, and manage catalogue movies and screening statuses</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition cursor-pointer self-start sm:self-auto"
        >
          <span>➕</span>
          <span>Add New Movie</span>
        </button>
      </div>

      {/* Global Feedback Banner */}
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

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-72 relative">
          <input
            type="text"
            placeholder="Search by title, genre, language..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-gray-600 whitespace-nowrap">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="NOW_SHOWING">Now Showing</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="ENDED">Ended</option>
          </select>
        </div>
      </div>

      {/* Main Table or Loading/Empty State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600 font-medium">Loading movies...</span>
        </div>
      ) : error ? (
        <div className="p-8 bg-red-50 text-red-700 rounded-xl text-center">
          <p className="font-semibold mb-3">{error}</p>
          <button
            onClick={fetchMovies}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
          >
            Retry
          </button>
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="text-4xl mb-3">🎬</div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">No Movies Found</h3>
          <p className="text-gray-500 text-sm mb-4">
            {searchTerm || statusFilter !== 'ALL'
              ? 'No movies match your current search or status filter.'
              : 'The movie catalogue is empty. Get started by adding a movie!'}
          </p>
          {(searchTerm || statusFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
              }}
              className="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Movie</th>
                  <th className="px-6 py-4">Genre</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Release Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMovies.map((movie) => (
                  <tr key={movie.id} className="hover:bg-gray-50/70 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {movie.posterUrl ? (
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="w-10 h-14 object-cover rounded-md shadow-xs flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-14 bg-gray-100 rounded-md flex items-center justify-center text-lg flex-shrink-0">
                            🎬
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-gray-900">{movie.title}</div>
                          <div className="text-xs text-gray-400">{movie.language}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {movie.genre}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">{movie.duration} mins</td>
                    <td className="px-6 py-4 text-gray-500">{movie.releaseDate}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={movie.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(movie)}
                          className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteDialog(movie)}
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

      {/* Add / Edit Movie Modal */}
      <Modal
        isOpen={isModalOpen}
        title={editingMovie ? `Edit Movie: ${editingMovie.title}` : 'Add New Movie'}
        onClose={() => !submitting && setIsModalOpen(false)}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {modalBackendError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
              ⚠️ {modalBackendError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                formErrors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g. Inception"
            />
            {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description *</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                formErrors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Brief summary or synopsis..."
            />
            {formErrors.description && (
              <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Duration (minutes) *
              </label>
              <input
                type="number"
                min={1}
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  formErrors.duration ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.duration && (
                <p className="text-red-500 text-xs mt-1">{formErrors.duration}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Language *</label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  formErrors.language ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g. English, Sinhala"
              />
              {formErrors.language && (
                <p className="text-red-500 text-xs mt-1">{formErrors.language}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Genre *</label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Release Date *
              </label>
              <input
                type="date"
                value={formData.releaseDate}
                onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as MovieStatus })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="NOW_SHOWING">NOW_SHOWING</option>
                <option value="UPCOMING">UPCOMING</option>
                <option value="ENDED">ENDED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Poster URL (Optional)
            </label>
            <input
              type="url"
              value={formData.posterUrl}
              onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://example.com/poster.jpg"
            />
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
                <span>{editingMovie ? 'Update Movie' : 'Create Movie'}</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Movie"
        message={`Are you sure you want to delete "${deletingMovie?.title}"? Scheduled shows for this movie must be removed first.`}
        confirmText="Yes, Delete Movie"
        cancelText="Cancel"
        isDanger={true}
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          if (!deleting) {
            setIsDeleteDialogOpen(false);
            setDeletingMovie(null);
          }
        }}
      />
    </div>
  );
};

export default ManageMovies;
