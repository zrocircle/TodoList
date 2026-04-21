export default function TodoItem({ todo, onToggleFlag, onToggleComplete, onDelete }) {
  const { id, title, is_completed, is_flagged, author_email, created_at } = todo

  const formattedDate = created_at
    ? new Date(created_at.toMillis()).toLocaleDateString('ko-KR', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    : ''

  // 이메일에서 @ 앞부분만 표시 (너무 길어지는 것 방지)
  const authorLabel = author_email?.split('@')[0] ?? '알 수 없음'

  return (
    <div
      className={[
        'group flex items-start gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200',
        is_flagged
          ? 'bg-amber-50 border-amber-300 shadow-sm shadow-amber-100'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm',
      ].join(' ')}
    >
      {/* 완료 체크박스 */}
      <button
        onClick={() => onToggleComplete(id, is_completed)}
        className={[
          'mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all',
          is_completed
            ? 'bg-emerald-500 border-emerald-500'
            : 'border-slate-300 hover:border-emerald-400',
        ].join(' ')}
        aria-label={is_completed ? '완료 취소' : '완료 표시'}
      >
        {is_completed && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* 내용 영역 */}
      <div className="flex-1 min-w-0">
        <p className={[
          'text-sm leading-relaxed break-words',
          is_completed ? 'line-through text-slate-400' : 'text-slate-800',
        ].join(' ')}>
          {is_flagged && (
            <span className="inline-block mr-1.5 text-xs font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-md">
              중요
            </span>
          )}
          {title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-slate-400">@{authorLabel}</span>
          {formattedDate && (
            <>
              <span className="text-xs text-slate-300">·</span>
              <span className="text-xs text-slate-400">{formattedDate}</span>
            </>
          )}
        </div>
      </div>

      {/* 액션 버튼 그룹 */}
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* 플래그 토글 */}
        <button
          onClick={() => onToggleFlag(id, is_flagged)}
          className={[
            'p-1.5 rounded-lg transition-all',
            is_flagged
              ? 'text-amber-500 bg-amber-100 hover:bg-amber-200'
              : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50',
          ].join(' ')}
          aria-label={is_flagged ? '플래그 해제' : '플래그 설정'}
        >
          <svg className="w-4 h-4" fill={is_flagged ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 21V4l9-1 9 1v13l-9-1-9 1z" />
          </svg>
        </button>

        {/* 삭제 */}
        <button
          onClick={() => onDelete(id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
          aria-label="삭제"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* 플래그 아이콘: 항상 표시 (플래그 ON 상태일 때) */}
      {is_flagged && (
        <button
          onClick={() => onToggleFlag(id, is_flagged)}
          className="p-1.5 rounded-lg text-amber-500 bg-amber-100 hover:bg-amber-200 transition-all shrink-0 group-hover:hidden"
          aria-label="플래그 해제"
        >
          <svg className="w-4 h-4" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 21V4l9-1 9 1v13l-9-1-9 1z" />
          </svg>
        </button>
      )}
    </div>
  )
}
