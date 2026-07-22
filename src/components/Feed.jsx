import { useState } from 'react'
import PostCard from './PostCard'
import './Feed.css'

function Feed({ posts, onComment, onReport, onPostClick }) {
  const [filter, setFilter] = useState('all')
  const [showCategorize, setShowCategorize] = useState(false)
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')

  const provinces = [
    'Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'
  ]

  const filteredPosts = posts.filter(post => {
    if (filter === 'problems' && post.type !== 'problem') return false
    if (filter === 'suggestions' && post.type !== 'suggestion') return false
    if (selectedProvince && post.province !== selectedProvince) return false
    if (selectedDistrict && post.district !== selectedDistrict) return false
    return true
  })

  const clearFilters = () => {
    setSelectedProvince('')
    setSelectedDistrict('')
    setShowCategorize(false)
  }

  return (
    <section className="feed-section">
      <div className="feed-controls">
        <div className="filter-toggles">
          <button
            className={`toggle-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`toggle-btn ${filter === 'problems' ? 'active' : ''}`}
            onClick={() => setFilter('problems')}
          >
            ⚠ Issues
          </button>
          <button
            className={`toggle-btn ${filter === 'suggestions' ? 'active' : ''}`}
            onClick={() => setFilter('suggestions')}
          >
            💡 Suggestions
          </button>
        </div>
        <div className="feed-actions">
          <button className="btn-secondary" onClick={() => setShowCategorize(!showCategorize)}>
            Categorize
          </button>
          <button className="btn-primary mobile-only" onClick={onPostClick}>
            Post Aawaj
          </button>
        </div>
      </div>

      {showCategorize && (
        <div className="categorize-panel">
          <select
            value={selectedProvince}
            onChange={(e) => {
              setSelectedProvince(e.target.value)
              setSelectedDistrict('')
            }}
          >
            <option value="">All Provinces</option>
            {provinces.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <button className="btn-text" onClick={clearFilters}>Clear</button>
        </div>
      )}

      <div className="feed-grid">
        {filteredPosts.length === 0 ? (
          <div className="empty-state">
            <p>No posts found. Be the first to share your voice!</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onComment={onComment}
              onReport={onReport}
            />
          ))
        )}
      </div>
    </section>
  )
}

export default Feed
