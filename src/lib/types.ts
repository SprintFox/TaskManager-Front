export interface User {
  user_id: number
  user_name: string
  role: string
  skillIds: number[] // Добавлено поле skillIds
}

export interface UserDto {
  email: string
  fullName: string | null
  skillIds: number[]
  avatarUrl: string | null
}

export interface Project {
  id: number
  name: string
  description: string
  skillIds: number[] // Добавлено поле skillIds
}
