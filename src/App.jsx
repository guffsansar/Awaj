import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Feed from './components/Feed'
import PostModal from './components/PostModal'
import AuthModal from './components/AuthModal'
import CommentsModal from './components/CommentsModal'
import Footer from './components/Footer'

const samplePosts = [
  {
    id: 1,
    type: 'problem',
    province: 'Bagmati',
    district: 'Kathmandu',
    content: 'The college library closes too early at 5 PM. Many students who travel from远 far areas cannot utilize the study space during evening hours. This affects our preparation for exams significantly.',
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

function App() {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState(samplePosts)
  const [showPostModal, setShowPostModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showCommentsModal, setShowCommentsModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

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

  const handleReport = (post) => {
    alert('Report submitted. Thank you for helping keep our community safe.')
  }

  return (
    <div className="app">
      <Navbar
        onPostClick={() => user ? setShowPostModal(true) : setShowAuthModal(true)}
        onLoginClick={() => setShowAuthModal(true)}
        user={user}
        onLogout={handleLogout}
      />
      <main>
        <Hero />
        <Feed
          posts={posts}
          onComment={handleComment}
          onReport={handleReport}
          onPostClick={() => user ? setShowPostModal(true) : setShowAuthModal(true)}
        />
      </main>
      <Footer />

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

export default App
