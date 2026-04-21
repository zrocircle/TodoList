import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute() {
  const { currentUser, loading } = useAuth()

  // Firebase가 인증 상태를 확인하는 동안 빈 화면 유지
  // (이 처리가 없으면 새로고침 시 로그인 페이지로 잠깐 튕겼다가 돌아오는 현상 발생)
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">인증 확인 중...</p>
        </div>
      </div>
    )
  }

  return currentUser ? <Outlet /> : <Navigate to="/login" replace />
}
