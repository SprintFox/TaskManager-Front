"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Search, X } from "lucide-react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "../../lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { ScrollArea } from "../ui/scroll-area"

interface User {
  id: number
  login: string
  email: string
  fullName?: string
  globalRole: string
  skillIds: number[]
  createdAt: string
  avatarUrl?: string
}

interface Skill {
  id: number
  name: string
}

interface UserSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (users: User[]) => void
}

// Sample data for skills
const skills: Skill[] = [
  { id: 1, name: "JavaScript" },
  { id: 2, name: "React" },
  { id: 3, name: "TypeScript" },
  { id: 4, name: "Node.js" },
  { id: 5, name: "Python" },
  { id: 6, name: "Java" },
  { id: 7, name: "C#" },
  { id: 8, name: "PHP" },
  { id: 9, name: "SQL" },
  { id: 10, name: "MongoDB" },
  { id: 11, name: "Docker" },
  { id: 12, name: "AWS" },
  { id: 13, name: "Azure" },
  { id: 14, name: "Git" },
]

// Sample data for users
const users: User[] = [
  {
    id: 1,
    login: "john_doe",
    email: "john@example.com",
    fullName: "John Doe",
    globalRole: "Developer",
    skillIds: [1, 2, 3, 4],
    createdAt: "2023-01-15T10:30:00Z",
    avatarUrl: "https://i.pravatar.cc/150?u=john_doe",
  },
  {
    id: 2,
    login: "jane_smith",
    email: "jane@example.com",
    fullName: "Jane Smith",
    globalRole: "Designer",
    skillIds: [2, 5, 14],
    createdAt: "2023-02-20T14:45:00Z",
    avatarUrl: "https://i.pravatar.cc/150?u=jane_smith",
  },
  {
    id: 3,
    login: "alex_wilson",
    email: "alex@example.com",
    fullName: "Alex Wilson",
    globalRole: "Project Manager",
    skillIds: [9, 14],
    createdAt: "2023-03-10T09:15:00Z",
  },
  {
    id: 4,
    login: "maria_garcia",
    email: "maria@example.com",
    fullName: "Maria Garcia",
    globalRole: "DevOps Engineer",
    skillIds: [4, 11, 12, 13],
    createdAt: "2023-04-05T16:20:00Z",
    avatarUrl: "https://i.pravatar.cc/150?u=maria_garcia",
  },
  {
    id: 5,
    login: "sam_johnson",
    email: "sam@example.com",
    fullName: "Sam Johnson",
    globalRole: "Backend Developer",
    skillIds: [3, 4, 5, 9, 10],
    createdAt: "2023-05-12T11:10:00Z",
    avatarUrl: "https://i.pravatar.cc/150?u=sam_johnson",
  },
  {
    id: 6,
    login: "lisa_brown",
    email: "lisa@example.com",
    fullName: "Lisa Brown",
    globalRole: "Frontend Developer",
    skillIds: [1, 2, 3],
    createdAt: "2023-06-18T13:25:00Z",
  },
  {
    id: 7,
    login: "david_miller",
    email: "david@example.com",
    fullName: "David Miller",
    globalRole: "Full Stack Developer",
    skillIds: [1, 2, 3, 4, 9, 10],
    createdAt: "2023-07-22T15:40:00Z",
    avatarUrl: "https://i.pravatar.cc/150?u=david_miller",
  },
]

export default function UserSearchDialog({ open, onOpenChange, onSelect }: UserSearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users)
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [skillsOpen, setSkillsOpen] = useState(false)

  // Get all unique skills from the users
  const usersSkills = Array.from(new Set(users.flatMap((user) => user.skillIds)))
    .map((skillId) => skills.find((skill) => skill.id === skillId)!)
    .filter(Boolean)

  // Filter users based on search term and selected skills
  useEffect(() => {
    let result = users

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (user) =>
          user.login.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          (user.fullName && user.fullName.toLowerCase().includes(term)),
      )
    }

    // Filter by selected skills
    if (selectedSkills.length > 0) {
      const skillIds = selectedSkills.map((skill) => skill.id)
      result = result.filter((user) => skillIds.every((skillId) => user.skillIds.includes(skillId)))
    }

    setFilteredUsers(result)
  }, [searchTerm, selectedSkills])

  const toggleUserSelection = (user: User) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((u) => u.id === user.id)
      if (isSelected) {
        return prev.filter((u) => u.id !== user.id)
      } else {
        return [...prev, user]
      }
    })
  }

  const handleSkillSelect = (skill: Skill) => {
    setSelectedSkills((prev) => {
      const isSelected = prev.some((s) => s.id === skill.id)
      if (isSelected) {
        return prev.filter((s) => s.id !== skill.id)
      } else {
        return [...prev, skill]
      }
    })
  }

  const removeSkill = (skillId: number) => {
    setSelectedSkills((prev) => prev.filter((skill) => skill.id !== skillId))
  }

  const handleConfirm = () => {
    onSelect(selectedUsers)
    onOpenChange(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSearchTerm("")
      setSelectedSkills([])
      setSelectedUsers([])
    }
    onOpenChange(open)
  }

  const getInitials = (name?: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Поиск пользователей</DialogTitle>
          <DialogDescription>Найдите и выберите пользователей по навыкам и другим критериям.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по имени, логину или email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Skills filter */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Фильтр по навыкам</div>
            <Popover open={skillsOpen} onOpenChange={setSkillsOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={skillsOpen} className="w-full justify-between">
                  Выбрать навыки
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Поиск навыка..." />
                  <CommandEmpty>Навыки не найдены</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {usersSkills.map((skill) => (
                        <CommandItem
                          key={skill.id}
                          value={skill.name}
                          onSelect={() => {
                            handleSkillSelect(skill)
                            setSkillsOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedSkills.some((s) => s.id === skill.id) ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {skill.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Selected skills badges */}
            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedSkills.map((skill) => (
                  <Badge key={skill.id} variant="secondary" className="flex items-center gap-1">
                    {skill.name}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill.id)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Users list */}
          <div>
            <div className="text-sm font-medium mb-2">Результаты ({filteredUsers.length})</div>
            <ScrollArea className="h-[250px] rounded-md border">
              {filteredUsers.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">Пользователи не найдены</div>
              ) : (
                <div className="divide-y">
                  {filteredUsers.map((user) => {
                    const isSelected = selectedUsers.some((u) => u.id === user.id)
                    return (
                      <div
                        key={user.id}
                        className={cn(
                          "flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50",
                          isSelected && "bg-muted",
                        )}
                        onClick={() => toggleUserSelection(user)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatarUrl || "/placeholder.svg"} />
                            <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.fullName || user.login}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                            <div className="text-xs text-muted-foreground">{user.globalRole}</div>
                          </div>
                        </div>
                        <div>
                          <Check className={cn("h-5 w-5", isSelected ? "opacity-100" : "opacity-0")} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Selected users count */}
          {selectedUsers.length > 0 && <div className="text-sm">Выбрано пользователей: {selectedUsers.length}</div>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleConfirm} disabled={selectedUsers.length === 0}>
            Выбрать
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
