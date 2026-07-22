import { useState } from 'react'
import './PostCard.css'

function PostCard({ post, onComment, onReport }) {
  const [upvoted, setUpvoted] = useState(false)
  const [downvoted, setDownvoted] = useState(false)
  const [votes, setVotes] = useState(post.votes || 0)

  const handleUpvote = () => {
    if (downvoted) {
      setDownvoted(false)
      setVotes(votes + 1)
    }
    setUpvoted(!upvoted)
    setVotes(upvoted ? votes - 1 : votes + 1)
  }

  const handleDownvote = () => {
    if (upvoted) {
      setUpvoted(false)
      setVotes(votes - 1)
    }
    setDownvoted(!downvoted)
    setVotes(downvoted ? votes + 1 : votes - 1)
  }

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

  return (
    <article className="post-card">
      <div className="post-header">
        <div className="post-author">
          {post.anonymous ? (
            <>
              <div className="avatar anonymous-avatar">A</div>
              <span className="author-name">Anonymous</span>
            </>
          ) : (
            <>
              <img src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.name}&background=6c5ce7&color=fff`} alt="" className="avatar" />
              <span className="author-name">{post.author?.name || 'Unknown'}</span>
            </>
          )}
        </div>
        <div className="post-meta">
          <span className={`post-type-badge ${post.type}`}>
            {post.type === 'problem' ? '⚠ Issue' : '💡 Suggestion'}
          </span>
          <span className="post-time">{timeAgo(post.created_at)}</span>
        </div>
      </div>

      <div className="post-location">
        📍 {post.district}, {post.province}
      </div>

      <div className="post-content">
        <p>{post.content}</p>
      </div>

      {post.media && post.media.length > 0 && (
        <div className="post-media">
          {post.media.map((url, idx) => (
            <img key={idx} src={url} alt="Post media" className="media-item" />
          ))}
        </div>
      )}

      <div className="post-actions">
        <div className="vote-section">
          <button className={`vote-btn ${upvoted ? 'active' : ''}`} onClick={handleUpvote}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>
          </button>
          <span className="vote-count">{votes}</span>
          <button className={`vote-btn ${downvoted ? 'active down' : ''}`} onClick={handleDownvote}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </button>
        </div>
        <button className="action-btn" onClick={() => onComment(post)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span>{post.comments?.length || 0}</span>
        </button>
        <button className="action-btn report-btn" onClick={() => onReport(post)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
            <line x1="4" y1="22" x2="4" y2="15"/>
          </svg>
        </button>
      </div>
    </article>
  )
}

export default PostCard
