function formatDate(timestamp) {
  if (!timestamp) return ''
  return new Date(timestamp.toMillis()).toLocaleString('ko-KR', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function shortEmail(email) {
  return email?.split('@')[0] ?? '알 수 없음'
}

export default function TodoItem({ todo, onToggleFlag, onToggleComplete, onDelete, isArchive = false }) {
  const {
    id, title, is_completed, is_flagged,
    author_email, created_at,
    completed_by, completed_at,
    assigned_to,
  } = todo

  return (
    <div className={[
      'group flex items-start gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200',
      isArchive
        ? 'bg-slate-50 border-slate-200 opacity-75'
        : is_flagged
          ? 'bg-amber-50 border-amber-300 shadow-sm shadow-amber-100'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm',
    ].join(' ')}>

      {/* 완료 토글 버튼 */}
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

      {/* 본문 영역 */}
      <div className="flex-1 min-w-0 space-y-1.5">
        {/* 제목 */}
        <p className={[
          'text-sm leading-relaxed break-words',
          is_completed ? 'line-through text-slate-400' : 'text-slate-800',
        ].join(' ')}>
          {!isArchive && is_flagged && (
            <span className="inline-block mr-1.5 text-xs font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-md">
              중요
            </span>
          )}
          {title}
        </p>

        {/* 메타 정보 행 */}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          {/* 생성자 */}
          <MetaChip icon="author">
            작성 <span className="font-medium text-slate-500">@{shortEmail(author_email)}</span>
          </MetaChip>

          {/* 생성 시각 */}
          {created_at && (
            <MetaChip icon="clock">
              {formatDate(created_at)}
            </MetaChip>
          )}

          {/* 담당자 */}
          <MetaChip icon="assign" highlight={!!assigned_to}>
            {assigned_to
              ? <><span className="font-medium text-indigo-600">@{shortEmail(assigned_to)}</span> 담당</>
              : '모두 담당'}
          </MetaChip>
        </div>

        {/* 완료 정보 (아카이브 전용) */}
        {isArchive && completed_by && (
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-0.5 border-t border-slate-200/80">
            <MetaChip icon="check" color="emerald">
              완료 <span className="font-medium text-emerald-600">@{shortEmail(completed_by)}</span>
            </MetaChip>
            {completed_at && (
              <MetaChip icon="clock" color="emerald">
                {formatDate(completed_at)}
              </MetaChip>
            )}
          </div>
        )}
      </div>

      {/* 액션 버튼 그룹 */}
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* 플래그 — 아카이브에서는 숨김 */}
        {!isArchive && (
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21V4l9-1 9 1v13l-9-1-9 1z" />
            </svg>
          </button>
        )}

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

      {/* 플래그 상시 표시 (활성 상태 + 플래그 ON) */}
      {!isArchive && is_flagged && (
        <button
          onClick={() => onToggleFlag(id, is_flagged)}
          className="p-1.5 rounded-lg text-amber-500 bg-amber-100 hover:bg-amber-200
                     transition-all shrink-0 group-hover:hidden"
          aria-label="플래그 해제"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 21V4l9-1 9 1v13l-9-1-9 1z" />
          </svg>
        </button>
      )}
    </div>
  )
}

// 작은 메타 정보 칩 컴포넌트
function MetaChip({ icon, children, highlight = false, color = 'slate' }) {
  const icons = {
    author: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    clock:  'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    assign: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    check:  'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  }
  const textColor = color === 'emerald' ? 'text-emerald-500' : 'text-slate-400'

  return (
    <span className={`inline-flex items-center gap-1 text-xs ${textColor}`}>
      <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons[icon]} />
      </svg>
      {children}
    </span>
  )
}
