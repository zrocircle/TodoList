import { useEffect, useState } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

const COLLECTION = 'todos'

// 정렬 규칙: 플래그 활성화 항목 최상단 → 동일 상태 내 최신순
function sortTodos(todos) {
  return [...todos].sort((a, b) => {
    if (a.is_flagged !== b.is_flagged) return b.is_flagged - a.is_flagged
    const aTime = a.created_at?.toMillis?.() ?? 0
    const bTime = b.created_at?.toMillis?.() ?? 0
    return bTime - aTime
  })
}

export function useTodos() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 실시간 구독: 컴포넌트 마운트 시 시작, 언마운트 시 자동 해제
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, COLLECTION),
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        setTodos(sortTodos(items))
        setLoading(false)
      },
      (err) => {
        console.error('Firestore onSnapshot error:', err)
        setError('데이터를 불러오는 중 오류가 발생했습니다.')
        setLoading(false)
      }
    )
    return unsub
  }, [])

  const addTodo = async (title, authorEmail) => {
    if (!title.trim()) return
    await addDoc(collection(db, COLLECTION), {
      title: title.trim(),
      is_completed: false,
      is_flagged: false,
      created_at: serverTimestamp(),
      author_email: authorEmail,
    })
  }

  const toggleFlag = async (id, current) => {
    await updateDoc(doc(db, COLLECTION, id), { is_flagged: !current })
  }

  const toggleComplete = async (id, current) => {
    await updateDoc(doc(db, COLLECTION, id), { is_completed: !current })
  }

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, COLLECTION, id))
  }

  return { todos, loading, error, addTodo, toggleFlag, toggleComplete, deleteTodo }
}
