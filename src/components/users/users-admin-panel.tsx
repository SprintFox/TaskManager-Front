"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { toast } from "../../components/ui/use-toast"
import UsersList from "./users-list"
import EditUserDialog from "./edit-user-dialog"
import DeleteUserDialog from "./delete-user-dialog"
import type { User } from "../../lib/types"
import { adminApi } from "../../services/projectMainApi"
import { UserDTO } from "../../types/ProjectDTO"

export default function UsersAdminPanel() {
  const [users, setUsers] = useState<UserDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      setIsLoading(true)
      const usersData = await adminApi.getUsers();
      setUsers(usersData)
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить пользователей. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      })
      console.error("Failed to load users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => user.login.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleEditUser = async (updatedUser: User) => {
    try {
      await editUser(updatedUser)
      const updatedUsers = users.map((user) => (user.id === updatedUser.user_id ? updatedUser : user))
      setUsers(updatedUsers)
      toast({
        title: "Успешно",
        description: `Данные пользователя "${updatedUser.user_name}" были обновлены.`,
      })
      setShowEditDialog(false)
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить данные пользователя. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      })
      console.error("Failed to update user:", error)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId)
      const updatedUsers = users.filter((user) => user.if !== userId)
      setUsers(updatedUsers)
      toast({
        title: "Успешно",
        description: `Пользователь был удален.`,
      })
      setShowDeleteDialog(false)
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить пользователя. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      })
      console.error("Failed to delete user:", error)
    }
  }

  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    setShowEditDialog(true)
  }

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user)
    setShowDeleteDialog(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Пользователи</CardTitle>
        <CardDescription>Управление пользователями и их ролями.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="relative w-full max-w-sm">
            <Input
              placeholder="Поиск пользователей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-3"
            />
          </div>

          <UsersList users={filteredUsers} isLoading={isLoading} onEdit={openEditDialog} onDelete={openDeleteDialog} />
        </div>

        {selectedUser && (
          <>
            <EditUserDialog
              open={showEditDialog}
              onOpenChange={setShowEditDialog}
              user={selectedUser}
              onEdit={handleEditUser}
            />

            <DeleteUserDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
              user={selectedUser}
              onDelete={handleDeleteUser}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}
