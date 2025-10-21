import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'


//const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001'
const API_BASE = 'http://localhost:3001'

export function useStudents() {
    return useQuery({
        queryKey: ['students'],
        queryFn: async () => {
            const { data } = await axios.get(`${API_BASE}/students`)
            console.log(data)
            return data
        },
    })
}
export function useStudent(id?: number) {
  return useQuery({
    queryKey: ['student', id],
    queryFn: async () => {
      if (!id) return null
      const { data } = await axios.get(`${API_BASE}/students/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useCreateStudent() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await axios.post(`${API_BASE}/students`, payload)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] })
    },
  })
}

export function useUpdateStudent() {
  const qc = useQueryClient()

  return useMutation({
    // v5 uses an object with mutationFn
    mutationFn: async ({ id, ...payload }: any) => {
      const { data } = await axios.put(`${API_BASE}/students/${id}`, payload)
      return data
    },

    // also object form for invalidateQueries
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] })
    },
  })
}



export function useDeleteStudent() {
  const qc = useQueryClient()

  return useMutation({
    // React Query v5 requires the "mutationFn" key
    mutationFn: async (id: number) => {
      const { data } = await axios.delete(`${API_BASE}/students/${id}`)
      return data
    },

    // v5 uses an object with queryKey
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] })
    },
  })
}