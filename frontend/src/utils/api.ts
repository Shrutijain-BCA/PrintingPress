// src/utils/api.ts
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

console.log("BASE:", import.meta.env.VITE_API_URL)

function getToken(): string | null {
  return localStorage.getItem('printify_token')
}

async function request<T>(method: string, path: string, body?: object): Promise<T> {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`)
  return data as T
}

async function uploadFiles<T>(path: string, formData: FormData): Promise<T> {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: formData,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || `Upload failed (${res.status})`)
  return data as T
}

export const api = {
  get:    <T>(path: string)                 => request<T>('GET',    path),
  post:   <T>(path: string, body: object)   => request<T>('POST',   path, body),
  put:    <T>(path: string, body: object)   => request<T>('PUT',    path, body),
  patch:  <T>(path: string, body: object)   => request<T>('PATCH',  path, body),
  delete: <T>(path: string)                 => request<T>('DELETE',  path),
  upload: <T>(path: string, form: FormData) => uploadFiles<T>(path, form),
}
