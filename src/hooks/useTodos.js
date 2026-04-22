import { useEffect, useState } from 'react'
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, query, where,
} from 'firebase/firestore'
import { db } from '../firebase'

const COLLECTION = 'todos'

function sortActive(todos) {
  return [...todos].sort((a, b) => {
    if (a.is_flagged !== b.is_flagged) return b.is_flagged - a.is_flagged
    const aTime = a.created_at?.toMillis?.() ?? 0
    const bTime = b.created_at?.toMillis?.() ?? 0
    return bTime - aTime
  })
}

function sortArchive(todos) {
  return [...todos].sort((a, b) => {
    const aTime = a.completed_at?.toMillis?.() ?? 0
    const bTime = b.completed_at?.toMillis?.() ?? 0
    return bTime - aTime // 최근 완료순
  })
}

export function useTodos(categoryId) {
  const [allTodos, setAllTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!categoryId) {
      setAllTodos([])
      setLoading(false)
      return
    }
    setLoading(true)

    const q = query(
      collection(db, COLLECTION),
      where('category_id', '==', categoryId)
    )

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        setAllTodos(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      (err) => {
        console.error('Firestore onSnapshot error:', err)
        setError('데이터를 불러오는 중 오류가 발생했습니다.')
        setLoading(false)
      }
    )
    return unsub
  }, [categoryId])

  // 정렬은 훅 외부(컴포넌트)에서 필요에 따라 적용
  const activeTodos  = sortActive(allTodos.filter((t) => !t.is_completed))
  const archiveTodos = sortArchive(allTodos.filter((t) => t.is_completed))

  const addTodo = async (title, authorEmail, assignedTo = null) => {
    if (!title.trim() || !categoryId) return
    await addDoc(collection(db, COLLECTION), {
      title: title.trim(),
      is_completed: false,
      is_flagged: false,
      created_at: serverTimestamp(),
      author_email: authorEmail,
      category_id: categoryId,
      assigned_to: assignedTo,   // null = 모두에게 할당
      completed_by: null,
      completed_at: null,
    })
  }

  const toggleFlag = async (id, current) => {
    await updateDoc(doc(db, COLLECTION, id), { is_flagged: !current })
  }

  // completing: true → 완료 처리 (completed_by, completed_at 기록)
  // completing: false → 완료 취소 (null로 초기화)
  const toggleComplete = async (id, current, userEmail) => {
    const completing = !current
    await updateDoc(doc(db, COLLECTION, id), {
      is_completed: completing,
      completed_by: completing ? userEmail : null,
      completed_at: completing ? serverTimestamp() : null,
    })
  }

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, COLLECTION, id))
  }

  return {
    activeTodos, archiveTodos, loading, error,
    addTodo, toggleFlag, toggleComplete, deleteTodo,
  }
}
