import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCategories } from '../hooks/useCategories'
import { useTodos } from '../hooks/useTodos'
import CategorySidebar from '../components/CategorySidebar'
import AddTodoForm from '../components/AddTodoForm'
import TodoItem from '../components/TodoItem'
import CreateCategoryModal from '../components/CreateCategoryModal'

export default function DashboardPage() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const {
    categories, loading: catLoading,
    createCategory, addMember, removeMember, deleteCategory,
  } = useCategories()

  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('active') // 'active' | 'archive'

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) ?? null

  const {
    activeTodos, archiveTodos, loading: todoLoading, error,
    addTodo, toggleFlag, toggleComplete, deleteTodo,
  } = useTodos(selectedCategoryId)

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const handleSelectCategory = (id) => {
    setSelectedCategoryId(id)
    setActiveTab('active') // 카테고리 전환 시 항상 진행 중 탭으로
    setSidebarOpen(false)
  }

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`'${cat.name}' 카테고리를 삭제할까요?\n이 카테고리의 할 일은 삭제되지 않습니다.`)) return
    await deleteCategory(cat)
    if (selectedCategoryId === cat.id) setSelectedCategoryId(null)
  }

  // completed_by를 기록하기 위해 현재 유저 이메일을 주입
  const handleToggleComplete = (id, current) => toggleComplete(id, current, currentUser.email)
  const handleAdd = (title, assignedTo) => addTodo(title, currentUser.email, assignedTo)

  const flaggedCount = activeTodos.filter((t) => t.is_flagged).length

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden">

      {/* ── 헤더 ── */}
      <header className="bg-white border-b border-slate-200 shrink-0 z-20 shadow-sm">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="sm:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              aria-label="카테고리 목록 열기"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-base">Team To-Do</span>
            {selectedCategory && (
              <span className="sm:hidden text-sm text-slate-400 truncate max-w-[120px]">
                / {selectedCategory.name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full truncate max-w-[200px]">
              {currentUser?.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600
                         hover:text-red-600 hover:bg-red-50 border border-slate-200
                         hover:border-red-200 rounded-lg transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">로그아웃</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── 바디 ── */}
      <div className="flex flex-1 overflow-hidden relative">
        {sidebarOpen && (
          <div className="sm:hidden fixed inset-0 z-10 bg-black/30" onClick={() => setSidebarOpen(false)} />
        )}

        <div className={[
          'absolute sm:relative z-20 h-full transition-transform duration-200 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0',
        ].join(' ')}>
          <CategorySidebar
            categories={categories}
            loading={catLoading}
            selectedId={selectedCategoryId}
            onSelect={handleSelectCategory}
            onAddMember={addMember}
            onRemoveMember={removeMember}
            onDelete={handleDeleteCategory}
            onCreateClick={() => setShowCreateModal(true)}
          />
        </div>

        {/* ── 메인 콘텐츠 ── */}
        <main className="flex-1 overflow-y-auto">
          {!selectedCategory ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-4">
              <div className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-slate-600 font-medium">카테고리를 선택해 주세요</p>
                <p className="text-sm text-slate-400 mt-1">
                  {categories.length === 0
                    ? '왼쪽 사이드바에서 새 카테고리를 만들어 보세요.'
                    : '왼쪽 사이드바에서 카테고리를 선택하면 할 일 목록이 표시됩니다.'}
                </p>
              </div>
              {categories.length === 0 && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm
                             font-semibold rounded-xl transition-colors shadow-sm"
                >
                  + 첫 카테고리 만들기
                </button>
              )}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

              {/* 카테고리 헤더 */}
              <div>
                <h1 className="text-xl font-bold text-slate-800">{selectedCategory.name}</h1>
                <p className="text-xs text-slate-400 mt-0.5">멤버 {selectedCategory.members.length}명 참여 중</p>
              </div>

              {/* 통계 카드 */}
              <div className="grid grid-cols-3 gap-3">
                <StatCard label="진행 중" value={activeTodos.length}  color="indigo" />
                <StatCard label="중요"    value={flaggedCount}         color="amber" />
                <StatCard label="완료"    value={archiveTodos.length}  color="emerald" />
              </div>

              {/* 탭 전환 */}
              <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                <TabButton
                  active={activeTab === 'active'}
                  onClick={() => setActiveTab('active')}
                  count={activeTodos.length}
                >
                  진행 중
                </TabButton>
                <TabButton
                  active={activeTab === 'archive'}
                  onClick={() => setActiveTab('archive')}
                  count={archiveTodos.length}
                  color="emerald"
                >
                  완료됨
                </TabButton>
              </div>

              {/* 할 일 추가 폼 — 진행 중 탭에서만 표시 */}
              {activeTab === 'active' && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <AddTodoForm
                    onAdd={handleAdd}
                    members={selectedCategory.members}
                  />
                </div>
              )}

              {/* 리스트 영역 */}
              <div className="space-y-2">
                {todoLoading && (
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

                {/* ── 진행 중 탭 ── */}
                {!todoLoading && !error && activeTab === 'active' && (
                  activeTodos.length === 0 ? (
                    <EmptyState
                      icon="todo"
                      message="진행 중인 할 일이 없습니다."
                      sub="위 입력창에서 새 할 일을 추가해 보세요!"
                    />
                  ) : (
                    <>
                      {flaggedCount > 0 && <SectionDivider color="amber" label="중요 항목" icon="flag" />}
                      {activeTodos.map((todo, idx) => {
                        const prevFlagged = idx > 0 ? activeTodos[idx - 1].is_flagged : true
                        const showDivider = !todo.is_flagged && prevFlagged && flaggedCount > 0
                        return (
                          <div key={todo.id}>
                            {showDivider && <SectionDivider color="slate" label="일반 항목" icon="list" />}
                            <TodoItem
                              todo={todo}
                              onToggleFlag={toggleFlag}
                              onToggleComplete={handleToggleComplete}
                              onDelete={deleteTodo}
                            />
                          </div>
                        )
                      })}
                    </>
                  )
                )}

                {/* ── 완료됨(아카이브) 탭 ── */}
                {!todoLoading && !error && activeTab === 'archive' && (
                  archiveTodos.length === 0 ? (
                    <EmptyState
                      icon="archive"
                      message="완료된 항목이 없습니다."
                      sub="할 일을 완료 처리하면 여기에 기록됩니다."
                    />
                  ) : (
                    <>
                      <SectionDivider color="emerald" label={`완료됨 ${archiveTodos.length}건`} icon="check" />
                      {archiveTodos.map((todo) => (
                        <TodoItem
                          key={todo.id}
                          todo={todo}
                          onToggleFlag={toggleFlag}
                          onToggleComplete={handleToggleComplete}
                          onDelete={deleteTodo}
                          isArchive
                        />
                      ))}
                    </>
                  )
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {showCreateModal && (
        <CreateCategoryModal
          onClose={() => setShowCreateModal(false)}
          onCreate={createCategory}
        />
      )}
    </div>
  )
}

// ── 서브 컴포넌트들 ─────────────────────────────────────────

function TabButton({ active, onClick, children, count, color = 'indigo' }) {
  const activeStyle = color === 'emerald'
    ? 'bg-emerald-50 text-emerald-700 shadow-sm'
    : 'bg-indigo-50 text-indigo-700 shadow-sm'
  const badgeStyle = color === 'emerald'
    ? 'bg-emerald-100 text-emerald-600'
    : 'bg-indigo-100 text-indigo-600'

  return (
    <button
      onClick={onClick}
      className={[
        'flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold transition-all',
        active ? activeStyle : 'text-slate-500 hover:text-slate-700',
      ].join(' ')}
    >
      {children}
      <span className={[
        'text-xs px-1.5 py-0.5 rounded-full font-bold',
        active ? badgeStyle : 'bg-slate-100 text-slate-400',
      ].join(' ')}>
        {count}
      </span>
    </button>
  )
}

function SectionDivider({ color, label, icon }) {
  const styles = {
    amber:   { text: 'text-amber-600',  line: 'bg-amber-200',  icon: 'text-amber-500' },
    slate:   { text: 'text-slate-400',  line: 'bg-slate-200',  icon: 'text-slate-400' },
    emerald: { text: 'text-emerald-600',line: 'bg-emerald-200',icon: 'text-emerald-500' },
  }
  const s = styles[color]
  const icons = {
    flag:  'M3 21V4l9-1 9 1v13l-9-1-9 1z',
    list:  'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2',
    check: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  }
  const filled = icon === 'flag'

  return (
    <div className="flex items-center gap-2 py-1 mt-1">
      <svg className={`w-3.5 h-3.5 ${s.icon}`} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons[icon]} />
      </svg>
      <span className={`text-xs font-semibold uppercase tracking-wide ${s.text}`}>{label}</span>
      <div className={`flex-1 h-px ${s.line}`} />
    </div>
  )
}

function EmptyState({ icon, message, sub }) {
  const icons = {
    todo:    'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    archive: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
  }
  return (
    <div className="flex flex-col items-center py-16 gap-3">
      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
        <svg className="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icons[icon]} />
        </svg>
      </div>
      <p className="text-sm text-slate-400">{message}</p>
      {sub && <p className="text-xs text-slate-300">{sub}</p>}
    </div>
  )
}

function StatCard({ label, value, color }) {
  const colorMap = {
    indigo:  'bg-indigo-50  text-indigo-700  border-indigo-100',
    amber:   'bg-amber-50   text-amber-700   border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  }
  return (
    <div className={`rounded-xl border px-4 py-3 text-center ${colorMap[color]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs mt-0.5 opacity-70">{label}</p>
    </div>
  )
}
