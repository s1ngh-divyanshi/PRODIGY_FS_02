import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // --- AUTHENTICATION STATE ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null); 
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [successModal, setSuccessModal] = useState(false); 

  // --- VALIDATION ERROR STATES ---
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

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

  // Handles Auth Form Submission (Login & Registration)
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    try {
      if (isRegisterMode) {
        // Send both keys explicitly so it matches any backend controller setup
        await axios.post(`${AUTH_URL}/register`, { 
          username: email, 
          email: email, 
          password: password, 
          role: 'user' 
        });
        setSuccessModal(true); 
        setIsRegisterMode(false);
        setEmail('');
        setPassword('');
      } else {
        const response = await axios.post(`${AUTH_URL}/login`, { username: email, password });
        setToken(response.data.token);
        setRole(response.data.role); 
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role); 
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message || "Authentication failed.";
      const cleanMessage = serverMessage
        .replace(/^User validation failed:\s*/i, '')
        .replace(/^(email|username):\s*/i, '')
        .trim();
      
      if (serverMessage.includes('E11000') || serverMessage.toLowerCase().includes('duplicate')) {
        setEmailError('This email address is already registered.');
      } else if (serverMessage.toLowerCase().includes('password')) {
        setPasswordError(cleanMessage);
      } else {
        setEmailError(cleanMessage);
      }
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

  // Handles Employee Database Management (Add / Update)
  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editId) {
        // Update existing record
        await axios.put(`${API_URL}/${editId}`, formData, getAuthHeaders());
        setEditId(null);
      } else {
        // Create new employee
        await axios.post(API_URL, formData, getAuthHeaders());
      }
      setFormData({ name: '', position: '', department: '' });
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed to execute.");
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
  // AUTENTICATION / LANDING SCREEN
  // ==========================================
  if (!token) {
    return (
      <div className="dashboard-container auth-wrapper">
        <div className="form-card auth-card">
          <h2>{isRegisterMode ? "Create Account" : "System Login"}</h2>
          {generalError && <div className="error-banner">{generalError}</div>}
          
          <form onSubmit={handleAuthSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                style={{ borderColor: emailError ? '#ef4444' : '' }} 
                required
              />
              {emailError && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{emailError}</span>}
            </div>

            <div className="input-group" style={{ marginTop: '15px' }}>
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ borderColor: passwordError ? '#ef4444' : '' }} 
                required
              />
              {passwordError && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{passwordError}</span>}
            </div>

            <button type="submit" style={{ marginTop: '20px' }}>
              {isRegisterMode ? "Register Account" : "Login"}
            </button>
          </form>
          
          <p className="auth-toggle" onClick={() => {
            setIsRegisterMode(!isRegisterMode);
            setEmailError('');
            setPasswordError('');
            setGeneralError('');
          }}>
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
  // SECURE EMPLOYEE DASHBOARD
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
          <form onSubmit={handleEmployeeSubmit} className="employee-form">
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