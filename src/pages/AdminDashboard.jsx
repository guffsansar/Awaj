import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Admin.css'

const API_URL = 'http://localhost:5000/api'

function AdminDashboard({ user, onLogout }) {
  const [stats, setStats] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const admin = localStorage.getItem('admin')
    if (!admin) {
      navigate('/admin/login')
      return
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, postsRes] = await Promise.all([
        fetch(`${API_URL}/stats`),
        fetch(`${API_URL}/posts/all`)
      ])
      const statsData = await statsRes.json()
      const postsData = await postsRes.json()
      setStats(statsData)
      setPosts(postsData.posts)
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin')
    onLogout()
    navigate('/admin/login')
  }

  const handleStatusChange = async (postId, newStatus) => {
    try {
      await fetch(`${API_URL}/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      setPosts(posts.map(p => p._id === postId ? { ...p, status: newStatus } : p))
    } catch (err) {
      console.error('Failed to update post:', err)
    }
  }

  const handleDelete = async (postId) => {
    if (!confirm('Are you sure you want to remove this post?')) return
    try {
      await fetch(`${API_URL}/posts/${postId}`, { method: 'DELETE' })
      setPosts(posts.map(p => p._id === postId ? { ...p, status: 'removed' } : p))
    } catch (err) {
      console.error('Failed to delete post:', err)
    }
  }

  const filteredPosts = posts.filter(post => {
    if (filter !== 'all' && post.status !== filter) return false
    if (search && !post.content.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">बिद्यार्थीको <span>आवाज</span></div>
          <span className="sidebar-label">Admin Panel</span>
        </div>
        <nav className="sidebar-nav">
          <a href="/admin/dashboard" className="nav-item active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Dashboard
          </a>
          <a href="/" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Back to Site
          </a>
        </nav>
        <div className="sidebar-footer">
          <div className="admin-user">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=6c5ce7&color=fff`}
              alt="Admin"
              className="admin-avatar"
            />
            <div className="admin-user-info">
              <span className="admin-name">{user?.name || 'Admin'}</span>
              <span className="admin-role">Administrator</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name || 'Admin'}</p>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <span className="stat-number">{stats?.totalPosts || 0}</span>
              <span className="stat-label">Total Posts</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <span className="stat-number">{stats?.totalUsers || 0}</span>
              <span className="stat-label">Total Users</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <span className="stat-number">{stats?.todayPosts || 0}</span>
              <span className="stat-label">Today's Posts</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-info">
              <span className="stat-number">{stats?.totalProblems || 0}</span>
              <span className="stat-label">Issues</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💡</div>
            <div className="stat-info">
              <span className="stat-number">{stats?.totalSuggestions || 0}</span>
              <span className="stat-label">Suggestions</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🗳️</div>
            <div className="stat-info">
              <span className="stat-number">{stats?.totalVotes || 0}</span>
              <span className="stat-label">Total Votes</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💬</div>
            <div className="stat-info">
              <span className="stat-number">{stats?.totalComments || 0}</span>
              <span className="stat-label">Comments</span>
            </div>
          </div>
        </div>

        <div className="admin-section">
          <div className="section-header">
            <h2>All Posts</h2>
            <div className="section-controls">
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              <div className="filter-tabs">
                <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                  All ({posts.length})
                </button>
                <button className={`filter-tab ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>
                  Active ({posts.filter(p => p.status === 'active').length})
                </button>
                <button className={`filter-tab ${filter === 'flagged' ? 'active' : ''}`} onClick={() => setFilter('flagged')}>
                  Flagged ({posts.filter(p => p.status === 'flagged').length})
                </button>
                <button className={`filter-tab ${filter === 'removed' ? 'active' : ''}`} onClick={() => setFilter('removed')}>
                  Removed ({posts.filter(p => p.status === 'removed').length})
                </button>
              </div>
            </div>
          </div>

          <div className="posts-table">
            <div className="table-header">
              <span className="col-type">Type</span>
              <span className="col-content">Content</span>
              <span className="col-location">Location</span>
              <span className="col-author">Author</span>
              <span className="col-votes">Votes</span>
              <span className="col-comments">Comments</span>
              <span className="col-date">Date</span>
              <span className="col-status">Status</span>
              <span className="col-actions">Actions</span>
            </div>
            {filteredPosts.map(post => (
              <div key={post._id} className={`table-row ${post.status}`}>
                <span className="col-type">
                  <span className={`type-badge ${post.type}`}>
                    {post.type === 'problem' ? '⚠' : '💡'}
                  </span>
                </span>
                <span className="col-content">
                  <p className="post-text">{post.content.substring(0, 80)}...</p>
                </span>
                <span className="col-location">{post.district}, {post.province}</span>
                <span className="col-author">
                  {post.anonymous ? 'Anonymous' : post.author?.name || 'Unknown'}
                </span>
                <span className="col-votes">{post.votes}</span>
                <span className="col-comments">{post.comments?.length || 0}</span>
                <span className="col-date">{timeAgo(post.created_at)}</span>
                <span className="col-status">
                  <span className={`status-badge ${post.status}`}>{post.status}</span>
                </span>
                <span className="col-actions">
                  {post.status === 'active' && (
                    <>
                      <button className="action-btn flag" onClick={() => handleStatusChange(post._id, 'flagged')} title="Flag">🚩</button>
                      <button className="action-btn remove" onClick={() => handleDelete(post._id)} title="Remove">🗑️</button>
                    </>
                  )}
                  {post.status === 'flagged' && (
                    <>
                      <button className="action-btn approve" onClick={() => handleStatusChange(post._id, 'active')} title="Approve">✅</button>
                      <button className="action-btn remove" onClick={() => handleDelete(post._id)} title="Remove">🗑️</button>
                    </>
                  )}
                  {post.status === 'removed' && (
                    <button className="action-btn restore" onClick={() => handleStatusChange(post._id, 'active')} title="Restore">♻️</button>
                  )}
                </span>
              </div>
            ))}
            {filteredPosts.length === 0 && (
              <div className="empty-state">No posts found</div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
