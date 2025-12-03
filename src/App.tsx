import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Dashboard } from './pages/Dashboard'
import { Upload } from './pages/Upload'
import { Schedule } from './pages/Schedule'
import { Settings } from './pages/Settings'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { TermsOfService } from './pages/TermsOfService'
import { Contact } from './pages/Contact'
import { Support } from './pages/Support'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { UploadProvider } from './contexts/UploadContext'

function App() {
  return (
    <UploadProvider>
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#242A45',
            color: '#F2F4F8',
            border: '1px solid rgba(80, 227, 194, 0.3)',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: 500,
          },
          success: {
            style: {
              background: '#242A45',
              color: '#F2F4F8',
              border: '1px solid #50E3C2',
              boxShadow: '0 0 12px rgba(80, 227, 194, 0.25)',
            },
            iconTheme: {
              primary: '#50E3C2',
              secondary: '#242A45',
            },
          },
          error: {
            style: {
              background: '#242A45',
              color: '#F2F4F8',
              border: '1px solid #FF6B6B',
              boxShadow: '0 0 12px rgba(255, 107, 107, 0.25)',
            },
            iconTheme: {
              primary: '#FF6B6B',
              secondary: '#242A45',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/support" element={<Support />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </UploadProvider>
  )
}

export default App
