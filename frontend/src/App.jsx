import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Assessment from './pages/Assessment'
import History from './pages/History'

export default function App() {
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"          element={<Landing />} />
            <Route path="/assess"    element={<Assessment />} />
            <Route path="/history"   element={<History />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}
