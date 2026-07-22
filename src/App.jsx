import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Feed from './components/Feed'
import PostModal from './components/PostModal'
import AuthModal from './components/AuthModal'
import CommentsModal from './components/CommentsModal'
import Footer from './components/Footer'
import Admin from './pages/Admin'

const samplePosts = [
  {
    id: 1,
    type: 'problem',
    province: 'Bagmati',
    district: 'Kathmandu',
    content: 'The college library closes too early at 5 PM. Many students who travel from far areas cannot utilize the study space during evening hours. This affects our preparation for exams significantly.',
    anonymous: false,
    author: { name: 'Ram Thapa', avatar: null },
    votes: 42,
    comments: [
      { content: 'I agree! Evening hours are crucial for working students.', anonymous: false, author: { name: 'Sita Shrestha' } },
      { content: 'The administration should consider extending hours at least during exam season.', anonymous: true }
    ],
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 2,
    type: 'suggestion',
    province: 'Bagmati',
    district: 'Lalitpur',
    content: 'We should have a mentorship program where senior students can guide juniors. This would help reduce dropout rates and improve academic performance across the board.',
    anonymous: false,
    author: { name: 'Priya Magar', avatar: null },
    votes: 28,
    comments: [
      { content: 'Great idea! Would love to participate as a mentor.', anonymous: false, author: { name: 'Hari Bahadur' } }
    ],
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 3,
    type: 'problem',
    province: 'Gandaki',
    district: 'Pokhara',
    content: 'The computer lab equipment is outdated. We are still using computers from 2015 which cannot run modern software needed for our coursework.',
    anonymous: true,
    author: null,
    votes: 56,
    comments: [],
    created_at: new Date(Date.now() - 10800000).toISOString()
  }
]

function Home({ user, onPostClick, onLoginClick, onLogout, posts, onComment, onReport }) {
  return (
    <>
      <Hero />
      <Feed
        posts={posts}
        onComment={onComment}
        onReport={onReport}
        onPostClick={onPostClick}
      />
    </>
  )
}

function AppContent() {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState(samplePosts)
  const [showPostModal, setShowPostModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showCommentsModal, setShowCommentsModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const location = useLocation()
  const isAdmin = location.pathname === '/admin'

  const handleLogin = (userData) => {
    setUser(userData)
    setShowAuthModal(false)
  }

  const handleLogout = () => {
    setUser(null)
  }

  const handlePost = (newPost) => {
    const post = {
      id: Date.now(),
      ...newPost,
      author: user,
      votes: 0,
      comments: [],
      created_at: new Date().toISOString()
    }
    setPosts([post, ...posts])
  }

  const handleComment = (post) => {
    setSelectedPost(post)
    setShowCommentsModal(true)
  }

  const handleAddComment = (postId, comment) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...(p.comments || []), {
            ...comment,
            author: user
          }]
        }
      }
      return p
    }))
  }

  const handleReport = () => {
    alert('Report submitted. Thank you for helping keep our community safe.')
  }

  return (
    <div className="app">
      {!isAdmin && (
        <Navbar
          onPostClick={() => user ? setShowPostModal(true) : setShowAuthModal(true)}
          onLoginClick={() => setShowAuthModal(true)}
          user={user}
          onLogout={handleLogout}
        />
      )}
      <main>
        <Routes>
          <Route path="/" element={
            <Home
              user={user}
              onPostClick={() => user ? setShowPostModal(true) : setShowAuthModal(true)}
              onLoginClick={() => setShowAuthModal(true)}
              onLogout={handleLogout}
              posts={posts}
              onComment={handleComment}
              onReport={handleReport}
            />
          } />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}

      <PostModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onSubmit={handlePost}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />

      <CommentsModal
        isOpen={showCommentsModal}
        onClose={() => setShowCommentsModal(false)}
        post={selectedPost}
        onAddComment={handleAddComment}
      />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
