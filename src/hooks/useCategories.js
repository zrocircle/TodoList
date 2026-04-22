import { useEffect, useState } from 'react'
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, arrayUnion, arrayRemove, serverTimestamp, query, where,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

export function useCategories() {
  const { currentUser } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) return

    // 내가 멤버로 포함된 카테고리만 구독
    const q = query(
      collection(db, 'categories'),
      where('members', 'array-contains', currentUser.email)
    )

    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      items.sort((a, b) => (a.created_at?.toMillis() ?? 0) - (b.created_at?.toMillis() ?? 0))
      setCategories(items)
      setLoading(false)
    })

    return unsub
  }, [currentUser])

  const createCategory = async (name, additionalEmails = []) => {
    // 생성자는 자동으로 멤버에 포함, 중복 제거
    const members = [
      currentUser.email,
      ...additionalEmails
        .map((e) => e.trim().toLowerCase())
        .filter((e) => e && e !== currentUser.email),
    ]
    await addDoc(collection(db, 'categories'), {
      name: name.trim(),
      created_by: currentUser.email,
      members,
      created_at: serverTimestamp(),
    })
  }

  // 생성자 권한 확인 후 멤버 추가
  const addMember = async (category, email) => {
    if (category.created_by !== currentUser.email) return
    const normalized = email.trim().toLowerCase()
    if (!normalized || category.members.includes(normalized)) return
    await updateDoc(doc(db, 'categories', category.id), {
      members: arrayUnion(normalized),
    })
  }

  // 생성자 권한 확인 후 멤버 제거 (생성자 본인은 제거 불가)
  const removeMember = async (category, email) => {
    if (category.created_by !== currentUser.email) return
    if (email === category.created_by) return
    await updateDoc(doc(db, 'categories', category.id), {
      members: arrayRemove(email),
    })
  }

  const deleteCategory = async (category) => {
    if (category.created_by !== currentUser.email) return
    await deleteDoc(doc(db, 'categories', category.id))
  }

  return { categories, loading, createCategory, addMember, removeMember, deleteCategory }
}
