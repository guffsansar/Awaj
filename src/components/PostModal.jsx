import { useState } from 'react'
import './PostModal.css'

function PostModal({ isOpen, onClose, onSubmit }) {
  const [postType, setPostType] = useState('problem')
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [content, setContent] = useState('')
  const [anonymous, setAnonymous] = useState(false)

  const provinces = [
    'Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'
  ]

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      type: postType,
      province,
      district,
      content,
      anonymous
    })
    setContent('')
    setProvince('')
    setDistrict('')
    setAnonymous(false)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Post Aawaj</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group row">
            <label>
              <input
                type="radio"
                name="postType"
                value="problem"
                checked={postType === 'problem'}
                onChange={() => setPostType('problem')}
              />
              <span>⚠ Problem</span>
            </label>
            <label>
              <input
                type="radio"
                name="postType"
                value="suggestion"
                checked={postType === 'suggestion'}
                onChange={() => setPostType('suggestion')}
              />
              <span>💡 Suggestion</span>
            </label>
          </div>
          <div className="form-group">
            <select value={province} onChange={(e) => setProvince(e.target.value)} required>
              <option value="" disabled>Select Province</option>
              {provinces.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="District"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Describe the issue or suggestion in detail..."
              rows="5"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="anonymous"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
            <label htmlFor="anonymous">
              <span>Hide my identity (Post Anonymously)</span>
              <span className="helper-text">Checking this hides your name from the public feed.</span>
            </label>
          </div>
          <button type="submit" className="btn-primary submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default PostModal
