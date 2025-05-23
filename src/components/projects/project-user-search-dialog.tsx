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
import { SkillDTO, UserDTO, ProjectRole } from "../../types/ProjectDTO"
import { adminApi } from "../../services/projectMainApi"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"



interface UserSearchDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelect: (users: UserDTO[], role: ProjectRole) => void
}


export default function UserSearchDialog({ open, onOpenChange, onSelect }: UserSearchDialogProps) {
    const [role, setRole] = useState<ProjectRole>(ProjectRole.MEMBER)

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedSkills, setSelectedSkills] = useState<SkillDTO[]>([])
    const [filteredUsers, setFilteredUsers] = useState<UserDTO[]>([])
    const [selectedUsers, setSelectedUsers] = useState<UserDTO[]>([])
    const [skillsOpen, setSkillsOpen] = useState(false)

    const [users, setUsers] = useState<UserDTO[]>();
    const [skills, setSkills] = useState<SkillDTO[]>();
    const [usersSkills, setUsersSkills] = useState<SkillDTO[]>()

    const refresh_all = async () => {
        const skills_res: SkillDTO[] = await adminApi.getSkills();
        setSkills(skills_res);
        const users_res: UserDTO[] = await adminApi.getUsers();
        setUsers(users_res);
        setUsersSkills(Array.from(new Set(users_res.flatMap((user) => user.skillIds)))
            .map((skillId) => skills_res.find((skill) => skill.id === skillId)!)
            .filter(Boolean))

        setFilteredUsers(users_res);
    }

    useEffect(() => {
        refresh_all();
    }, [])


    // Filter users based on search term and selected skills
    useEffect(() => {
        if (!users)
            return;
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

    const toggleUserSelection = (user: UserDTO) => {
        setSelectedUsers((prev) => {
            const isSelected = prev.some((u) => u.id === user.id)
            if (isSelected) {
                return prev.filter((u) => u.id !== user.id)
            } else {
                return [...prev, user]
            }
        })
    }

    const handleSkillSelect = (skill: SkillDTO) => {
        if (!skill)
            return;
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
        onSelect(selectedUsers, role)
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
                    <div className="grid gap-2">
                        <Label htmlFor="edit-user-role">Роль</Label>
                        <Select value={role} onValueChange={(value) => setRole(value as ProjectRole)}>
                            <SelectTrigger id="edit-user-role">
                                <SelectValue placeholder="Выберите роль" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="OWNER">Администратор</SelectItem>
                                <SelectItem value="MANAGER">Модератор</SelectItem>
                                <SelectItem value="MEMBER">Участник</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

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
                                            {usersSkills && usersSkills.map((skill) => (
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
                                        <X className="h-3 w-3 cursor-pointer" onClick={() => {
                                            if (!skill.id)
                                                return;
                                            removeSkill(skill.id)

                                        }} />

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
