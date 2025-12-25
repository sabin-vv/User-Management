import { useCallback, useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import AdminNavbar from "../../components/Navbar/AdminNavbar"
import { authFetch } from "../../utils/authFetch"
import styles from "./Home.module.css"
import swal from "sweetalert2"

function AdminHome() {
    const dispatch = useDispatch()
    const { accessToken } = useSelector((state) => state.auth)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState("")
    const [form, setForm] = useState({ id: null, name: "", email: "", password: "", role: "user" })
    const isEdit = useMemo(() => !!form.id, [form.id])

    const headers = useMemo(() => ({
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
    }), [accessToken])

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true)
            const res = await authFetch("http://localhost:5000/api/admin/users", { headers }, dispatch)
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Failed to load users")
            setUsers(data.users || [])
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }, [headers, dispatch])

    useEffect(() => {
        if (accessToken) fetchUsers()
    }, [accessToken, fetchUsers])

    const resetForm = () => setForm({ id: null, name: "", email: "", password: "", role: "user" })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const body = JSON.stringify({ name: form.name, email: form.email, role: form.role, ...(isEdit ? {} : { password: form.password }) })
            const url = isEdit ? `http://localhost:5000/api/admin/users/${form.id}` : "http://localhost:5000/api/admin/users"
            const method = isEdit ? "PUT" : "POST"
            const res = await authFetch(url, { method, headers, body }, dispatch)
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Save failed")
            toast.success(isEdit ? "User updated" : "User created")
            resetForm()
            fetchUsers()
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    const startEdit = (user) => {
        setForm({ id: user.id || user._id, name: user.name, email: user.email, password: "", role: user.role })
    }

    const handleDelete = async (id) => {
        const result = await swal.fire({
            title: "Do you want to delete the User?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
        })
        if (!result.isConfirmed) {
            return
        }
        try {
            setLoading(true)
            const res = await authFetch(`http://localhost:5000/api/admin/users/${id}`, { method: "DELETE", headers }, dispatch)
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Delete failed")
            toast.success("User deleted")
            fetchUsers()
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    const filteredUsers = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return users
        return users.filter((u) =>
            (u.name && u.name.toLowerCase().includes(q)) ||
            (u.email && u.email.toLowerCase().includes(q)) ||
            (u.role && u.role.toLowerCase().includes(q))
        )
    }, [users, query])

    return (
        <div className={styles.main}>
            <AdminNavbar />
            <div className={styles.container}>
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.title}>Manage Users</h2>
                    </div>
                    <form onSubmit={handleSubmit} className={styles.formGrid}>
                        <div className={styles.field}>
                            <label className={styles.label}>Name</label>
                            <input className={styles.input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Email</label>
                            <input className={styles.input} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                        </div>
                        {!isEdit && (
                            <div className={styles.field}>
                                <label className={styles.label}>Password</label>
                                <input className={styles.input} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                            </div>
                        )}
                        <div className={styles.field}>
                            <label className={styles.label}>Role</label>
                            <select className={styles.select} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className={styles.actionsInline}>
                            <button type="submit" disabled={loading} className={styles.submitButton}>
                                {isEdit ? "Update" : "Create"}
                            </button>
                            {isEdit && (
                                <button type="button" onClick={resetForm} className={styles.cancelButton}>Cancel</button>
                            )}
                        </div>
                    </form>
                </section>

                <section className={styles.section}>
                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by name, email, or role"
                            className={styles.searchInput}
                            aria-label="Search users"
                        />
                        {query && (
                            <button type="button" className={styles.clearButton} onClick={() => setQuery("")}>Clear</button>
                        )}
                    </div>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr className={styles.theadRow}>
                                    <th className={styles.th}>Name</th>
                                    <th className={styles.th}>Email</th>
                                    <th className={styles.th}>Role</th>
                                    <th className={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((u) => (
                                    <tr key={u.id || u._id} className={styles.tbodyRow}>
                                        <td className={styles.td}>{u.name}</td>
                                        <td className={styles.td}>{u.email}</td>
                                        <td className={styles.td}>{u.role}</td>
                                        <td className={styles.td}>
                                            <button onClick={() => startEdit(u)} className={styles.actionButton} style={{ marginRight: 8 }}>Edit</button>
                                            <button onClick={() => handleDelete(u.id || u._id)} className={styles.deleteButton}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {loading && <p className={styles.loading}>Loading...</p>}
                </section>
            </div>
        </div>
    )
}

export default AdminHome
