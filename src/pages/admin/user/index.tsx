import { useEffect, useState } from "react";
import AdminLayout from "../_layout";
import { UserPlus, Edit, Trash2, X, Eye, EyeOff, ShieldCheck, UserCircle, Loader2, Mail, Calendar, Search, Filter, MoreVertical } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster, toast } from "sonner";

interface User {
  id: number;
  email: string;
  name?: string;
  createdAt: string;
}

// Komponen Modal Konfirmasi Hapus dengan animasi lebih smooth
const DeleteConfirmationModal = ({ 
  user, 
  onConfirm, 
  onCancel 
}: { 
  user: User;
  onConfirm: () => void; 
  onCancel: () => void; 
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    onClick={onCancel}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-50"
      >
        <Trash2 className="h-8 w-8 text-red-600" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">Konfirmasi Penghapusan</h2>
        <p className="mt-3 text-center text-gray-600">
          Anda akan menghapus user <span className="font-semibold text-gray-900">{user.name || user.email}</span>. 
          Tindakan ini tidak dapat dibatalkan.
        </p>
      </motion.div>

      <div className="mt-8 flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCancel}
          className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
        >
          Batal
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onConfirm}
          className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 font-semibold text-white shadow-lg shadow-red-500/30 transition-all hover:shadow-xl hover:shadow-red-500/40"
        >
          Ya, Hapus
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
);

// Komponen Card User untuk tampilan yang lebih menarik
const UserCard = ({ 
  user, 
  onEdit, 
  onDelete 
}: { 
  user: User; 
  onEdit: () => void; 
  onDelete: () => void; 
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl"
    >
      {/* Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-100/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      
      <div className="relative">
        {/* Avatar & Name */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-xl font-bold text-white shadow-lg">
              {(user.name || user.email).charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{user.name || "Unnamed User"}</h3>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                <Mail size={14} />
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          {/* Menu Button */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMenu(!showMenu)}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <MoreVertical size={20} />
            </motion.button>

            <AnimatePresence>
              {showMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowMenu(false)}
                  ></div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className="absolute right-0 top-12 z-20 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
                  >
                    <button
                      onClick={() => { onEdit(); setShowMenu(false); }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      <Edit size={16} />
                      <span className="font-medium">Edit User</span>
                    </button>
                    <button
                      onClick={() => { onDelete(); setShowMenu(false); }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      <span className="font-medium">Hapus User</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Date Info */}
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={14} />
          <span>Dibuat {new Date(user.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>

        {/* Admin Badge */}
        <div className="mt-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            <ShieldCheck size={14} />
            Administrator
          </span>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"></div>
    </motion.div>
  );
};

export default function UserAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // State untuk form
  const [editUser, setEditUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/user");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      toast.error("Gagal memuat data user.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetForm = () => {
    setEmail("");
    setName("");
    setPassword("");
    setShowPassword(false);
    setEditUser(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowUserModal(true);
  };
  
  const openEditModal = (user: User) => {
    setEditUser(user);
    setEmail(user.email);
    setName(user.name || "");
    setPassword("");
    setShowUserModal(true);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Email wajib diisi!");
    if (!editUser && !password) return toast.error("Password wajib diisi untuk user baru!");

    setIsSubmitting(true);
    const payload: any = { email, name };
    if (password.trim() !== "") payload.password = password;

    const method = editUser ? "PUT" : "POST";
    const url = editUser ? `/api/admin/user/${editUser.id}` : "/api/admin/user";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menyimpan user");
      }

      toast.success(editUser ? "User berhasil diperbarui!" : "User baru berhasil ditambahkan!");
      setShowUserModal(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      await fetch(`/api/admin/user/${userToDelete.id}`, { method: "DELETE" });
      toast.success(`User ${userToDelete.name || userToDelete.email} berhasil dihapus.`);
      fetchUsers();
    } catch (error) {
      toast.error("Gagal menghapus user.");
    } finally {
      setUserToDelete(null);
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Kelola User</h1>
          <p className="mt-2 text-gray-600">Manajemen akun administrator untuk dashboard</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-semibold text-emerald-700">{users.length} Total User</span>
            </div>
          </div>
        </div>
        
        <motion.button
          onClick={openAddModal}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40"
        >
          <UserPlus size={20} />
          <span>Tambah User Baru</span>
        </motion.button>
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari user berdasarkan nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
          <button
            onClick={() => setViewMode('grid')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              viewMode === 'grid'
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              viewMode === 'table'
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Table
          </button>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8"
      >
        {isLoading ? (
          viewMode === 'grid' ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 animate-pulse rounded-2xl bg-gray-100"></div>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="h-64 animate-pulse bg-gray-100"></div>
            </div>
          )
        ) : filteredUsers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-16"
          >
            <UserCircle size={64} className="text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              {searchQuery ? "Tidak ada hasil" : "Belum ada user"}
            </h3>
            <p className="mt-1 text-gray-500">
              {searchQuery ? "Coba kata kunci pencarian lain" : "Tambahkan user baru untuk memulai"}
            </p>
            {!searchQuery && (
              <motion.button
                onClick={openAddModal}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-emerald-700"
              >
                <UserPlus size={18} />
                <span>Tambah User Pertama</span>
              </motion.button>
            )}
          </motion.div>
        ) : viewMode === 'grid' ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={() => openEditModal(user)}
                  onDelete={() => setUserToDelete(user)}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Tanggal Dibuat</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-bold text-white">
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900">{user.name || "-"}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openEditModal(user)}
                          className="rounded-lg p-2 text-emerald-600 transition-colors hover:bg-emerald-50"
                        >
                          <Edit size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setUserToDelete(user)}
                          className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Modal Form */}
      <AnimatePresence>
        {showUserModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowUserModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl"
            >
              <button
                onClick={() => setShowUserModal(false)}
                className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>

              <div className="mb-8">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50">
                  <UserPlus className="h-7 w-7 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {editUser ? "Edit User" : "Tambah User Baru"}
                </h2>
                <p className="mt-2 text-gray-600">
                  {editUser ? "Perbarui informasi user di bawah ini" : "Lengkapi data user yang akan ditambahkan"}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="peer block w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 placeholder-transparent transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                    placeholder="Nama"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-4 top-3.5 origin-[0] -translate-y-7 scale-75 transform bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-emerald-600"
                  >
                    Nama Lengkap
                  </label>
                </div>

                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="peer block w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 placeholder-transparent transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                    placeholder="Email"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-4 top-3.5 origin-[0] -translate-y-7 scale-75 transform bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-emerald-600"
                  >
                    Alamat Email
                  </label>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="peer block w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 placeholder-transparent transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                    placeholder="Password"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-4 top-3.5 origin-[0] -translate-y-7 scale-75 transform bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-emerald-600"
                  >
                    {editUser ? "Password Baru (Opsional)" : "Password"}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="button"
                    onClick={() => setShowUserModal(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-6 py-3.5 font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <span>{editUser ? "Simpan Perubahan" : "Tambah User"}</span>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {userToDelete && (
          <DeleteConfirmationModal 
            user={userToDelete}
            onConfirm={handleDelete}
            onCancel={() => setUserToDelete(null)}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}