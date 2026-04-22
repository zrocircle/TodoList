import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function ManageMembersModal({ category, onClose, onAddMember, onRemoveMember }) {
  const { currentUser } = useAuth()
  const [emailInput, setEmailInput] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)

  const isCreator = category.created_by === currentUser.email

  const handleAdd = async () => {
    const val = emailInput.trim().toLowerCase()
    if (!val) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setEmailError('올바른 이메일 형식이 아닙니다.')
      return
    }
    if (category.members.includes(val)) {
      setEmailError('이미 멤버로 등록된 이메일입니다.')
      return
    }
    setLoading(true)
    try {
      await onAddMember(category, val)
      setEmailInput('')
      setEmailError('')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAdd() }
  }

  const handleRemove = async (email) => {
    await onRemoveMember(category, email)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">멤버 관리</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              <span className="text-indigo-600 font-medium">{category.name}</span> 카테고리
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 멤버 목록 */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            현재 멤버 ({category.members.length}명)
          </p>
          <ul className="space-y-1.5 max-h-52 overflow-y-auto">
            {category.members.map((email) => (
              <li key={email}
                className="flex items-center justify-between px-3 py-2 bg-slate-50
                           border border-slate-100 rounded-xl">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* 아바타 이니셜 */}
                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-indigo-600 uppercase">
                      {email[0]}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-slate-700 truncate">{email}</p>
                    {email === category.created_by && (
                      <p className="text-xs text-amber-600">생성자</p>
                    )}
                  </div>
                </div>

                {/* 생성자만 제거 버튼 표시 (자기 자신 제외) */}
                {isCreator && email !== category.created_by && (
                  <button
                    onClick={() => handleRemove(email)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
                    aria-label={`${email} 제거`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6h12m5-5l-4 4m0-4l4 4" />
                    </svg>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* 멤버 추가 — 생성자만 표시 */}
        {isCreator ? (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              멤버 추가
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => { setEmailInput(e.target.value); setEmailError('') }}
                onKeyDown={handleKeyDown}
                placeholder="초대할 이메일 입력"
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm
                           placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400
                           focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={handleAdd}
                disabled={loading}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300
                           text-white text-sm font-semibold rounded-xl transition-colors"
              >
                {loading
                  ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : '추가'}
              </button>
            </div>
            {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-2">
            멤버 추가/제거는 카테고리 생성자만 할 수 있습니다.
          </p>
        )}

        <button onClick={onClose}
          className="w-full py-2.5 border border-slate-200 text-slate-600 text-sm font-medium
                     rounded-xl hover:bg-slate-50 transition-colors">
          닫기
        </button>
      </div>
    </div>
  )
}
