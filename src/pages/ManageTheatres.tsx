import React, { useEffect, useState } from 'react';
import { theatreService } from '../services/theatreService';
import { Theatre, TheatreRequest, TheatreStatus } from '../types';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const INITIAL_FORM: TheatreRequest = {
  name: '',
  location: '',
  capacity: 100,
  status: 'ACTIVE',
};

const ManageTheatres: React.FC = () => {
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Search/filter state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTheatre, setEditingTheatre] = useState<Theatre | null>(null);
  const [formData, setFormData] = useState<TheatreRequest>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [modalBackendError, setModalBackendError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Confirm delete state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [deletingTheatre, setDeletingTheatre] = useState<Theatre | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    fetchTheatres();
  }, []);

  const fetchTheatres = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await theatreService.getAll();
      setTheatres(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch theatres.');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingTheatre(null);
    setFormData(INITIAL_FORM);
    setFormErrors({});
    setModalBackendError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (theatre: Theatre) => {
    setEditingTheatre(theatre);
    setFormData({
      name: theatre.name,
      location: theatre.location,
      capacity: theatre.capacity,
      status: theatre.status,
    });
    setFormErrors({});
    setModalBackendError(null);
    setIsModalOpen(true);
  };

  const openDeleteDialog = (theatre: Theatre) => {
    setDeletingTheatre(theatre);
    setIsDeleteDialogOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Theatre name is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.capacity || formData.capacity <= 0) errors.capacity = 'Capacity must be greater than 0';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setModalBackendError(null);

      if (editingTheatre) {
        await theatreService.update(editingTheatre.id, formData);
        setFeedback({ type: 'success', message: `Theatre "${formData.name}" updated successfully.` });
      } else {
        await theatreService.create(formData);
        setFeedback({ type: 'success', message: `Theatre "${formData.name}" created successfully.` });
      }

      setIsModalOpen(false);
      await fetchTheatres();
    } catch (err: any) {
      setModalBackendError(err?.response?.data?.message || 'Failed to save theatre.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingTheatre) return;

    try {
      setDeleting(true);
      await theatreService.delete(deletingTheatre.id);
      setFeedback({ type: 'success', message: `Theatre "${deletingTheatre.name}" deleted successfully.` });
      setIsDeleteDialogOpen(false);
      setDeletingTheatre(null);
      await fetchTheatres();
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || `Failed to delete theatre "${deletingTheatre.name}".`,
      });
      setIsDeleteDialogOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const filteredTheatres = theatres.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Manage Theatres</h1>
          <p className="text-gray-500 mt-1">Configure cinema halls, locations, seating capacity, and statuses</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition cursor-pointer self-start sm:self-auto"
        >
          <span>➕</span>
          <span>Add New Theatre</span>
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

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-72 relative">
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Main Table or Loading/Empty State */}
      {loading ? (
        <Spinner text="Loading theatres..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchTheatres} />
      ) : filteredTheatres.length === 0 ? (
        <EmptyState
          icon="🏛️"
          title="No Theatres Found"
          description={
            searchTerm || statusFilter !== 'ALL'
              ? 'No theatres match your current search or status filter.'
              : 'No theatre halls are currently configured. Add one to schedule shows!'
          }
          actionText={searchTerm || statusFilter !== 'ALL' ? 'Clear Filters' : 'Add New Theatre'}
          onAction={
            searchTerm || statusFilter !== 'ALL'
              ? () => {
                  setSearchTerm('');
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
                  <th className="px-6 py-4">Theatre Name</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Capacity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTheatres.map((theatre) => (
                  <tr key={theatre.id} className="hover:bg-gray-50/70 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 flex items-center gap-2">
                        <span className="text-lg">🏛️</span>
                        <span>{theatre.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{theatre.location}</td>
                    <td className="px-6 py-4 font-semibold text-gray-700">
                      {theatre.capacity} seats
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={theatre.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(theatre)}
                          className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteDialog(theatre)}
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

      {/* Add / Edit Theatre Modal */}
      <Modal
        isOpen={isModalOpen}
        title={editingTheatre ? `Edit Theatre: ${editingTheatre.name}` : 'Add New Theatre'}
        onClose={() => !submitting && setIsModalOpen(false)}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {modalBackendError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
              ⚠️ {modalBackendError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Theatre Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                formErrors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g. Liberty Cinema"
            />
            {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                formErrors.location ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g. Colombo 03"
            />
            {formErrors.location && (
              <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Capacity (Seats) *
            </label>
            <input
              type="number"
              min={1}
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                formErrors.capacity ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {formErrors.capacity && (
              <p className="text-red-500 text-xs mt-1">{formErrors.capacity}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as TheatreStatus })
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
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
                <span>{editingTheatre ? 'Update Theatre' : 'Create Theatre'}</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Theatre"
        message={`Are you sure you want to delete "${deletingTheatre?.name}"? You cannot delete a theatre if scheduled shows exist in it.`}
        confirmText="Yes, Delete Theatre"
        cancelText="Cancel"
        isDanger={true}
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          if (!deleting) {
            setIsDeleteDialogOpen(false);
            setDeletingTheatre(null);
          }
        }}
      />
    </div>
  );
};

export default ManageTheatres;
