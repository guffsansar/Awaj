import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminLogin.css'

const API_URL = 'http://localhost:5000/api'

function AdminLogin({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const url = isSignUp ? `${API_URL}/auth/register` : `${API_URL}/auth/login`
      const body = isSignUp ? { name, email, password } : { email, password }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }

      localStorage.setItem('admin', JSON.stringify(data))
      onLogin(data)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="login-bg-shapes">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              बिद्यार्थीको <span>आवाज</span>
            </div>
            <p className="login-subtitle">Admin Panel</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {isSignUp && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="admin@awaj.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Please wait...' : (isSignUp ? 'Create Admin Account' : 'Sign In')}
            </button>
          </form>

          <div className="login-footer">
            <p>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button className="toggle-btn" onClick={() => { setIsSignUp(!isSignUp); setError('') }}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          <div className="login-info">
            <p>🔒 Protected admin access only</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
