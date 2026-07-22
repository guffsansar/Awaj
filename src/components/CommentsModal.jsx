import { useState } from 'react'
import './CommentsModal.css'

function CommentsModal({ isOpen, onClose, post, onAddComment }) {
  const [comment, setComment] = useState('')
  const [anonymous, setAnonymous] = useState(false)

  if (!isOpen || !post) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (comment.trim()) {
      onAddComment(post.id, { content: comment, anonymous })
      setComment('')
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal comments-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Comments</h2>
        <div className="comments-list">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((c, idx) => (
              <div key={idx} className="comment-item">
                <div className="comment-author">
                  {c.anonymous ? (
                    <>
                      <div className="avatar small anonymous-avatar">A</div>
                      <span>Anonymous</span>
                    </>
                  ) : (
                    <>
                      <img src={c.author?.avatar || `https://ui-avatars.com/api/?name=${c.author?.name}&background=6c5ce7&color=fff`} alt="" className="avatar small" />
                      <span>{c.author?.name || 'Unknown'}</span>
                    </>
                  )}
                </div>
                <p className="comment-content">{c.content}</p>
              </div>
            ))
          ) : (
            <p className="no-comments">No comments yet. Be the first to respond!</p>
          )}
        </div>
        <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            placeholder="Write a comment or counter-statement..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
          <div className="comment-form-actions">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              <span>Post anonymously</span>
            </label>
            <button type="submit" className="btn-primary">Post</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CommentsModal
