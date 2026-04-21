import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTodos } from '../hooks/useTodos'
import AddTodoForm from '../components/AddTodoForm'
import TodoItem from '../components/TodoItem'

export default function DashboardPage() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const { todos, loading, error, addTodo, toggleFlag, toggleComplete, deleteTodo } = useTodos()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const handleAdd = (title) => addTodo(title, currentUser.email)

  const flaggedCount = todos.filter((t) => t.is_flagged).length
  const completedCount = todos.filter((t) => t.is_completed).length

  return (
    <div className="min-h-screen bg-slate-100">
      {/* 헤더 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-base">Team To-Do</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full truncate max-w-[200px]">
              {currentUser?.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-red-600
                         hover:bg-red-50 border border-slate-200 hover:border-red-200
                         rounded-lg transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* 통계 카드 */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="전체" value={todos.length} color="indigo" />
          <StatCard label="중요" value={flaggedCount} color="amber" />
          <StatCard label="완료" value={completedCount} color="emerald" />
        </div>

        {/* 입력 폼 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <AddTodoForm onAdd={handleAdd} />
        </div>

        {/* 할 일 목록 */}
        <div className="space-y-2">
          {loading && (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="w-7 h-7 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-slate-400">불러오는 중...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {!loading && !error && todos.length === 0 && (
            <div className="flex flex-col items-center py-16 gap-3">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-sm text-slate-400">아직 할 일이 없습니다.</p>
              <p className="text-xs text-slate-300">위 입력창에서 첫 번째 할 일을 추가해 보세요!</p>
            </div>
          )}

          {!loading && !error && todos.length > 0 && (
            <>
              {/* 플래그된 항목 구분선 */}
              {flaggedCount > 0 && (
                <div className="flex items-center gap-2 py-1">
                  <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 21V4l9-1 9 1v13l-9-1-9 1z" />
                  </svg>
                  <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">중요 항목</span>
                  <div className="flex-1 h-px bg-amber-200" />
                </div>
              )}

              {todos.map((todo, idx) => {
                // 일반 항목 구분선: 플래그 → 일반 전환 지점
                const prevIsFlagged = idx > 0 ? todos[idx - 1].is_flagged : true
                const showDivider = !todo.is_flagged && prevIsFlagged && flaggedCount > 0

                return (
                  <div key={todo.id}>
                    {showDivider && (
                      <div className="flex items-center gap-2 py-1 mt-2">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                        </svg>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">일반 항목</span>
                        <div className="flex-1 h-px bg-slate-200" />
                      </div>
                    )}
                    <TodoItem
                      todo={todo}
                      onToggleFlag={toggleFlag}
                      onToggleComplete={toggleComplete}
                      onDelete={deleteTodo}
                    />
                  </div>
                )
              })}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function StatCard({ label, value, color }) {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    amber:  'bg-amber-50  text-amber-700  border-amber-100',
    emerald:'bg-emerald-50 text-emerald-700 border-emerald-100',
  }
  return (
    <div className={`rounded-xl border px-4 py-3 text-center ${colorMap[color]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs mt-0.5 opacity-70">{label}</p>
    </div>
  )
}
