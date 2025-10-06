export interface User {
  id: number
  name: string
  last_name?: string | null
  email: string
  role_id: number
  is_active: boolean
  created_at: string
  role?: {
    id: number
    name: string
  }
}