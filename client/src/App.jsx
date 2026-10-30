import { useState } from 'react'
import AdminLayout from './components/AdminLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import StudentsPage from './pages/StudentsPage'
import ImportPage from './pages/ImportPage'
import PhotoValidationPage from './pages/PhotoValidationPage'
import StudentSpacePage from './pages/StudentSpacePage'

function App() {
  const [area, setArea] = useState('admin')
  const [page, setPage] = useState('login')

  if (area === 'student') {
    return <StudentSpacePage onBack={() => setArea('admin')} />
  }

  if (page === 'login') {
    return <LoginPage onLogin={() => setPage('dashboard')} onStudent={() => setArea('student')} />
  }

  const pages = {
    dashboard: <DashboardPage />,
    students: <StudentsPage />,
    import: <ImportPage />,
    validation: <PhotoValidationPage />,
  }

  return (
    <AdminLayout activePage={page} onNavigate={setPage} onStudent={() => setArea('student')} onLogout={() => setPage('login')}>
      {pages[page] || pages.dashboard}
    </AdminLayout>
  )
}

export default App
