import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // --- AUTHENTICATION STATE ---
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null); // NEW: Track role
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authData, setAuthData] = useState({ username: '', password: '', role: 'user' }); // Added role to form
  const [authError, setAuthError] = useState(null);
  const [successModal, setSuccessModal] = useState(false); // NEW: Custom success modal

  // --- EMPLOYEE STATE ---
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ name: '', position: '', department: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);

  // --- MODAL STATE ---
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);

  const API_URL = 'https://prodigy-fs-02-v2-133734452521.asia-south1.run.app/api/employees';
  const AUTH_URL = 'https://prodigy-fs-02-v2-133734452521.asia-south1.run.app/api/auth';

  const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${token}` } });

  useEffect(() => {
    if (token) fetchEmployees();
  }, [token]);

  const handleAuthChange = (e) => {
    setAuthData({ ...authData, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    try {
      if (isRegisterMode) {
        await axios.post(`${AUTH_URL}/register`, authData);
        setSuccessModal(true); // Trigger custom pop-up instead of alert()
        setIsRegisterMode(false);
      } else {
        const response = await axios.post(`${AUTH_URL}/login`, authData);
        setToken(response.data.token);
        setRole(response.data.role); // Save role
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role); // Persist role
      }
      setAuthData({ username: '', password: '', role: 'user' });
    } catch (err) {
      setAuthError(err.response?.data?.message || "Authentication failed.");
    }
  };

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setEmployees([]);
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL, getAuthHeaders());
      const sortedEmployees = response.data.sort((a, b) => a.name.localeCompare(b.name));
      setEmployees(sortedEmployees);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 400) handleLogout();
    }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, formData, getAuthHeaders());
        setEditId(null);
      } else {
        await axios.post(API_URL, formData, getAuthHeaders());
      }
      setFormData({ name: '', position: '', department: '' });
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save employee.");
    }
  };

  const confirmEdit = () => {
    setEditId(employeeToEdit._id);
    setFormData({ name: employeeToEdit.name, position: employeeToEdit.position, department: employeeToEdit.department });
    setEmployeeToEdit(null);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${employeeToDelete}`, getAuthHeaders());
      fetchEmployees();
    } catch (err) {
      console.error("Deletion failed:", err);
    }
    setEmployeeToDelete(null);
  };

  // ==========================================
  // LOGIN SCREEN
  // ==========================================
  if (!token) {
    return (
      <div className="dashboard-container auth-wrapper">
        <div className="form-card auth-card">
          <h2>{isRegisterMode ? "Create Account" : "System Login"}</h2>
          {authError && <div className="error-banner">{authError}</div>}
          
          <form onSubmit={handleAuthSubmit} className="employee-form auth-form">
            <input type="text" name="username" placeholder="Username" value={authData.username} onChange={handleAuthChange} required />
            <input type="password" name="password" placeholder="Password" value={authData.password} onChange={handleAuthChange} required />
            
            {/* Role Selector (Only visible during registration) */}
            {isRegisterMode && (
              <select name="role" value={authData.role} onChange={handleAuthChange} className="role-select">
                <option value="user">Standard User (View Only)</option>
                <option value="admin">Administrator (Full Access)</option>
              </select>
            )}

            <button type="submit" className="btn btn-primary">
              {isRegisterMode ? "Register" : "Login"}
            </button>
          </form>
          
          <p className="auth-toggle" onClick={() => setIsRegisterMode(!isRegisterMode)}>
            {isRegisterMode ? "Already have an account? Login here." : "Need an account? Register here."}
          </p>
        </div>

        {/* Custom Registration Success Modal */}
        {successModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h2>Success!</h2>
              <p>Your account has been created successfully. You can login now.</p>
              <button onClick={() => setSuccessModal(false)} className="btn btn-primary">Go to Login</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // SECURE DASHBOARD
  // ==========================================
  return (
    <div className="dashboard-container">
      <header className="dashboard-header flex-header">
        <div>
            <h1>Employee Management System</h1>
            <span style={{color: '#94a3b8', fontSize: '0.9rem'}}>Logged in as: <strong>{role ? role.toUpperCase() : 'USER'}</strong></span>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary logout-btn">Logout</button>
      </header>
      
      {error && <div className="error-banner">{error}</div>}

      {/* Conditionally render the Add Form ONLY if the role is 'admin' */}
      {role === 'admin' && (
        <div className="form-card">
          <form onSubmit={handleSubmit} className="employee-form">
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} required />
            <input type="text" name="position" placeholder="Position" value={formData.position} onChange={handleInputChange} required />
            <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleInputChange} required />
            <button type="submit" className="btn btn-primary">
              {editId ? 'Update Record' : 'Add Employee'}
            </button>
          </form>
        </div>
      )}

      <div className="table-card">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Department</th>
              {/* Only show Actions column header if admin */}
              {role === 'admin' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp._id}>
                  <td className="fw-bold">{emp.name}</td>
                  <td>{emp.position}</td>
                  <td>{emp.department}</td>
                  
                  {/* Only show Edit/Delete buttons if admin */}
                  {role === 'admin' && (
                    <td className="actions-cell">
                      <button onClick={() => setEmployeeToEdit(emp)} className="btn btn-secondary">Edit</button>
                      <button onClick={() => setEmployeeToDelete(emp._id)} className="btn btn-danger">Delete</button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={role === 'admin' ? "4" : "3"} className="empty-state">No employees found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals for Editing and Deleting */}
      {employeeToDelete && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Delete Record</h2>
            <p>Are you sure you want to delete this record? This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={() => setEmployeeToDelete(null)} className="btn btn-secondary">Cancel</button>
              <button onClick={confirmDelete} className="btn btn-danger">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {employeeToEdit && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Edit Record</h2>
            <p>Are you sure you want to edit the record for <strong>{employeeToEdit.name}</strong>?</p>
            <div className="modal-actions">
              <button onClick={() => setEmployeeToEdit(null)} className="btn btn-secondary">Cancel</button>
              <button onClick={confirmEdit} className="btn btn-primary">Yes, Edit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;