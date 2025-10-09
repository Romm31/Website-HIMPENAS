import { useEffect, useState } from "react";
import AdminLayout from "../_layout";
import { UserPlus, Edit, Trash2, X, Eye, EyeOff, ShieldCheck, UserCircle, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster, toast } from "sonner";

interface User {
  id: number;
  email: string;
  name?: string;
  createdAt: string;
}

// Komponen Modal Konfirmasi Hapus
const DeleteConfirmationModal = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void; }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-2xl"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <Trash2 className="h-6 w-6 text-red-600" />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-gray-800">Hapus User</h2>
      <p className="mt-2 text-gray-500">Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.</p>
      <div className="mt-8 flex justify-center gap-4">
        <button onClick={onCancel} className="rounded-lg border px-5 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50">
          Batal
        </button>
        <button onClick={onConfirm} className="rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700">
          Ya, Hapus
        </button>
      </div>
    </motion.div>
  </motion.div>
);

export default function UserAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
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
    setPassword(""); // Kosongkan password saat edit
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

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Kelola User</h1>
          <p className="mt-1 text-gray-500">Manajemen akun administrator untuk dashboard.</p>
        </div>
        <motion.button
          onClick={openAddModal}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 rounded-lg bg-emerald-dark px-4 py-2.5 font-semibold text-white shadow-sm transition-all hover:shadow-md"
        >
          <UserPlus size={18} /> Tambah User
        </motion.button>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nama</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Tanggal Dibuat</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={4} className="whitespace-nowrap px-6 py-4"><div className="h-6 w-full animate-pulse rounded-md bg-gray-200"></div></td>
                </tr>
              ))
            ) : users.length === 0 ? (
                <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-500">
                        <UserCircle size={40} className="mx-auto text-gray-300" />
                        <p className="mt-2">Belum ada user yang ditambahkan.</p>
                    </td>
                </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">{user.name || "-"}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("id-ID", { day: '2-digit', month: 'long', year: 'numeric' })}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-4">
                      <button onClick={() => openEditModal(user)} className="text-sky-600 transition hover:text-sky-800"><Edit size={18} /></button>
                      <button onClick={() => setUserToDelete(user)} className="text-red-600 transition hover:text-red-800"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showUserModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-md rounded-xl bg-white p-8 shadow-2xl"
            >
              <button onClick={() => setShowUserModal(false)} className="absolute top-4 right-4 text-gray-400 transition hover:text-gray-600"><X /></button>
              <h2 className="text-2xl font-bold text-gray-800">{editUser ? "Edit User" : "Tambah User Baru"}</h2>
              <p className="mt-1 text-gray-500">Isi detail user di bawah ini.</p>
              
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="relative">
                  <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="peer block w-full appearance-none rounded-md border border-gray-300 bg-transparent px-3 py-3 placeholder-transparent focus:border-emerald-dark focus:outline-none focus:ring-0" placeholder="Nama" />
                  <label htmlFor="name" className="absolute left-3 top-3 origin-[0] -translate-y-5 scale-75 transform bg-white px-1 text-gray-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-emerald-dark">Nama Lengkap</label>
                </div>
                <div className="relative">
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="peer block w-full appearance-none rounded-md border border-gray-300 bg-transparent px-3 py-3 placeholder-transparent focus:border-emerald-dark focus:outline-none focus:ring-0" placeholder="Email" />
                  <label htmlFor="email" className="absolute left-3 top-3 origin-[0] -translate-y-5 scale-75 transform bg-white px-1 text-gray-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-emerald-dark">Alamat Email</label>
                </div>
                <div className="relative">
                  <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="peer block w-full appearance-none rounded-md border border-gray-300 bg-transparent px-3 py-3 placeholder-transparent focus:border-emerald-dark focus:outline-none focus:ring-0" placeholder="Password" />
                  <label htmlFor="password" className="absolute left-3 top-3 origin-[0] -translate-y-5 scale-75 transform bg-white px-1 text-gray-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-emerald-dark">
                    {editUser ? "Password Baru (Opsional)" : "Password"}
                  </label>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-dark px-4 py-3 font-semibold text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? <><Loader2 className="animate-spin" size={20}/> Memproses...</> : (editUser ? "Simpan Perubahan" : "Tambah User")}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {userToDelete && (
            <DeleteConfirmationModal 
                onConfirm={handleDelete}
                onCancel={() => setUserToDelete(null)}
            />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}