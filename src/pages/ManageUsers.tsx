import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { User, UserUpdateRequest, Role } from '../types';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const ManageUsers: React.FC = () => {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserUpdateRequest>({
    fullName: '',
    phone: '',
    role: 'CUSTOMER',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [modalBackendError, setModalBackendError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Delete State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAll();
      setUsers(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (targetUser: User) => {
    setEditingUser(targetUser);
    setFormData({
      fullName: targetUser.fullName,
      phone: targetUser.phone || '',
      role: targetUser.role,
    });
    setFormErrors({});
    setModalBackendError(null);
    setIsModalOpen(true);
  };

  const openDeleteDialog = (targetUser: User) => {
    if (targetUser.id === currentUser?.id) {
      setFeedback({
        type: 'error',
        message: 'You cannot delete your own active administrator account.',
      });
      return;
    }
    setDeletingUser(targetUser);
    setIsDeleteDialogOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !editingUser) return;

    try {
      setSubmitting(true);
      setModalBackendError(null);

      await userService.update(editingUser.id, formData);
      setFeedback({
        type: 'success',
        message: `User "${formData.fullName}" updated successfully.`,
      });

      setIsModalOpen(false);
      await fetchUsers();
    } catch (err: any) {
      setModalBackendError(err?.response?.data?.message || 'Failed to update user profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;

    try {
      setDeleting(true);
      await userService.delete(deletingUser.id);
      setFeedback({
        type: 'success',
        message: `User "${deletingUser.fullName}" deleted successfully.`,
      });
      setIsDeleteDialogOpen(false);
      setDeletingUser(null);
      await fetchUsers();
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || `Failed to delete user "${deletingUser.fullName}".`,
      });
      setIsDeleteDialogOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone || '').includes(searchTerm);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Manage Users</h1>
          <p className="text-gray-500 mt-1">
            Review registered accounts, modify roles, and manage permissions
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="px-3.5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer self-start sm:self-auto shadow-xs"
        >
          🔄 Refresh
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

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-gray-600 whitespace-nowrap">Role:</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="CUSTOMER">CUSTOMER</option>
          </select>
        </div>
      </div>

      {/* Main Table or Loading/Empty State */}
      {loading ? (
        <Spinner text="Loading users..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchUsers} />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No Users Found"
          description={
            searchTerm || roleFilter !== 'ALL'
              ? 'No registered users match your search or filter.'
              : 'No users found in the system.'
          }
          actionText={searchTerm || roleFilter !== 'ALL' ? 'Clear Filters' : undefined}
          onAction={
            searchTerm || roleFilter !== 'ALL'
              ? () => {
                  setSearchTerm('');
                  setRoleFilter('ALL');
                }
              : undefined
          }
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((targetUser) => {
                  const isCurrentAccount = targetUser.id === currentUser?.id;

                  return (
                    <tr key={targetUser.id} className="hover:bg-gray-50/70 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 flex items-center gap-2">
                          <span>{targetUser.fullName}</span>
                          {isCurrentAccount && (
                            <span className="px-2 py-0.5 text-[10px] bg-indigo-100 text-indigo-700 font-bold rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">{targetUser.email}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {targetUser.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                            targetUser.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {targetUser.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {targetUser.createdAt
                          ? new Date(targetUser.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(targetUser)}
                            className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition cursor-pointer"
                          >
                            Edit
                          </button>
                          {isCurrentAccount ? (
                            <span
                              className="px-3 py-1.5 text-xs font-semibold text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
                              title="You cannot delete your own account"
                            >
                              Protected
                            </span>
                          ) : (
                            <button
                              onClick={() => openDeleteDialog(targetUser)}
                              className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg transition cursor-pointer"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        title={`Edit User: ${editingUser?.fullName || ''}`}
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
              Email Address
            </label>
            <input
              type="text"
              disabled
              value={editingUser?.email || ''}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                formErrors.fullName ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {formErrors.fullName && (
              <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Phone Number *
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                formErrors.phone ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Role *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="ADMIN">ADMIN</option>
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
                  <span>Updating...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete User Account"
        message={`Are you sure you want to delete user "${deletingUser?.fullName}" (${deletingUser?.email})? This action cannot be reversed.`}
        confirmText="Yes, Delete User"
        cancelText="Cancel"
        isDanger={true}
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          if (!deleting) {
            setIsDeleteDialogOpen(false);
            setDeletingUser(null);
          }
        }}
      />
    </div>
  );
};

export default ManageUsers;
