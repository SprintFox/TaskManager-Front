"use client"

import { Edit, Trash2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Skeleton } from "../../components/ui/skeleton"
import { Badge } from "../../components/ui/badge"
import { useEffect, useState } from "react"
import { adminApi } from "../../services/projectMainApi"
import { SkillDTO, UserDTO } from "../../types/ProjectDTO"

interface UsersListProps {
  users: UserDTO[]
  isLoading: boolean
  onEdit: (user: UserDTO) => void
  onDelete: (user: UserDTO) => void
}

export default function UsersList({ users, isLoading, onEdit, onDelete }: UsersListProps) {
  const [skills, setSkills] = useState<SkillDTO[]>([])
  const [loadingSkills, setLoadingSkills] = useState(true)

  useEffect(() => {
    async function loadSkills() {
      try {
        const skillsData = await adminApi.getSkills();
        setSkills(skillsData)
      } catch (error) {
        console.error("Failed to load skills:", error)
      } finally {
        setLoadingSkills(false)
      }
    }

    loadSkills()
  }, [])

  const getSkillName = (skillId: number) => {
    console.warn(skills);
    // Индексы в массиве начинаются с 0, а skillId с 1
    return skills[skillId - 1] || `Навык ${skillId}`
  }

  if (isLoading || loadingSkills) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">Пользователи не найдены.</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Имя пользователя</TableHead>
          <TableHead>Роль</TableHead>
          <TableHead>Навыки</TableHead>
          <TableHead className="w-[120px] text-right">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.id}</TableCell>
            <TableCell className="font-medium">{user.login}</TableCell>
            <TableCell>
              <Badge variant={user.globalRole === "admin" ? "default" : "secondary"}>{user.globalRole}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {user.skillIds && user.skillIds.length > 0 ? (
                  user.skillIds.map((skillId) => (
                    <Badge key={skillId} variant="outline">
                      {/* {getSkillName(skillId)} */}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">Нет навыков</span>
                )}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(user)}
                  aria-label={`Изменить роль ${user.login}`}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(user)}
                  aria-label={`Удалить пользователя ${user.login}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
