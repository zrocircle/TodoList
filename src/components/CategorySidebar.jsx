import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import ManageMembersModal from './ManageMembersModal'

const CATEGORY_COLORS = [
  'bg-indigo-500', 'bg-violet-500', 'bg-emerald-500',
  'bg-amber-500',  'bg-rose-500',   'bg-sky-500',
  'bg-pink-500',   'bg-teal-500',
]

function getCategoryColor(id) {
  // id 문자열을 숫자로 변환해 일관된 색상 할당
  const hash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return CATEGORY_COLORS[hash % CATEGORY_COLORS.length]
}

export default function CategorySidebar({
  categories, loading, selectedId, onSelect,
  onAddMember, onRemoveMember, onDelete, onCreateClick,
}) {
  const { currentUser } = useAuth()
  const [managingCategory, setManagingCategory] = useState(null)

  return (
    <>
      <aside className="w-60 shrink-0 bg-white border-r border-slate-200 flex flex-col h-full">
        <div className="px-4 pt-5 pb-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">내 카테고리</p>
        </div>

        {/* 카테고리 목록 */}
        <nav className="flex-1 overflow-y-auto px-2 space-y-0.5">
          {loading && (
            <div className="flex justify-center py-6">
              <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && categories.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-6 px-2">
              아직 카테고리가 없어요.<br />아래 버튼으로 만들어 보세요!
            </p>
          )}

          {categories.map((cat) => {
            const isSelected = cat.id === selectedId
            const isCreator = cat.created_by === currentUser.email
            const color = getCategoryColor(cat.id)

            return (
              <div key={cat.id}
                className={[
                  'group flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all',
                  isSelected
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50',
                ].join(' ')}
                onClick={() => onSelect(cat.id)}
              >
                {/* 색상 도트 */}
                <div className={`w-2 h-2 rounded-full shrink-0 ${color}`} />

                {/* 카테고리 이름 */}
                <span className="flex-1 text-sm font-medium truncate">{cat.name}</span>

                {/* 멤버 수 */}
                <span className={[
                  'text-xs shrink-0',
                  isSelected ? 'text-indigo-400' : 'text-slate-400',
                ].join(' ')}>
                  {cat.members.length}명
                </span>

                {/* 설정 버튼 — hover 또는 선택 시 표시 */}
                <button
                  onClick={(e) => { e.stopPropagation(); setManagingCategory(cat) }}
                  className={[
                    'p-1 rounded-lg transition-all shrink-0',
                    isSelected
                      ? 'text-indigo-400 hover:bg-indigo-100 opacity-100'
                      : 'text-slate-400 hover:bg-slate-200 opacity-0 group-hover:opacity-100',
                  ].join(' ')}
                  aria-label="멤버 관리"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>

                {/* 삭제 버튼 — 생성자 + hover 시만 표시 */}
                {isCreator && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(cat) }}
                    className={[
                      'p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shrink-0',
                      'opacity-0 group-hover:opacity-100',
                    ].join(' ')}
                    aria-label="카테고리 삭제"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            )
          })}
        </nav>

        {/* 새 카테고리 버튼 */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={onCreateClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4
                       text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100
                       rounded-xl border border-indigo-200 hover:border-indigo-300 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            새 카테고리
          </button>
        </div>
      </aside>

      {/* 멤버 관리 모달 */}
      {managingCategory && (
        <ManageMembersModal
          category={managingCategory}
          onClose={() => setManagingCategory(null)}
          onAddMember={onAddMember}
          onRemoveMember={onRemoveMember}
        />
      )}
    </>
  )
}
