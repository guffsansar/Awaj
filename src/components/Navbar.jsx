import { useState } from 'react'
import './Navbar.css'

function Navbar({ onPostClick, onLoginClick, user, onLogout }) {
  const [lang, setLang] = useState('EN')

  const toggleLang = () => {
    setLang(lang === 'EN' ? 'NP' : 'EN')
  }

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="logo">
          बिद्यार्थीको <span>आवाज</span>
        </div>
        <div className="brand-sub">Bidyarthiko Aawaj</div>
      </div>
      <div className="navbar-actions">
        <button className="lang-toggle" onClick={toggleLang} title="Toggle Language">
          {lang}
        </button>
        <button className="btn-primary desktop-only" onClick={onPostClick}>
          Post Aawaj
        </button>
        {user ? (
          <div className="user-section">
            <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=6c5ce7&color=fff`} alt="Avatar" className="avatar" />
            <button className="btn-text" onClick={onLogout}>Logout</button>
          </div>
        ) : (
          <button className="btn-outline" onClick={onLoginClick}>
            Log In / Sign Up
          </button>
        )}
      </div>
    </header>
  )
}

export default Navbar
