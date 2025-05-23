"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, UserCircle, X } from "lucide-react"
import { Button } from "../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"
import { Badge } from "../../components/ui/badge"
import { cn } from "../../lib/utils"

import {adminApi} from "../../services/projectMainApi.ts";


import { SkillDTO, UserDTO } from "../../types/ProjectDTO.ts"
import { storageApi, STORAGE_API_URL } from "../../services/storageApi.ts"

interface UserProfileEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserDTO
  onSave: (user: UserDTO) => void
}

export default function UserProfileEditor({ open, onOpenChange, user, onSave }: UserProfileEditorProps) {
  const [email, setEmail] = useState(user.email)
  const [fullName, setFullName] = useState(user.fullName || "")
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "")
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>(user.skillIds || [])
  const [skills, setSkills] = useState<SkillDTO[]>([])
  const [openSkillsPopover, setOpenSkillsPopover] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (open) {
      setEmail(user.email)
      setFullName(user.fullName || "")
      setAvatarUrl(user.avatarUrl || "")
      setSelectedSkillIds(user.skillIds || [])
      setEmailError("")
      loadSkills()
    }
  }, [open, user])

  const loadSkills = async () => {
    try {
      const skillsData: SkillDTO[] = await adminApi.getSkills();

      setSkills(skillsData)
    } catch (error) {
      console.error("Failed to load skills:", error)
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      return "Email обязателен"
    }
    if (!emailRegex.test(email)) {
      return "Некорректный формат email"
    }
    return ""
  }

  const saveUserData = async () => {
    const emailValidationError = validateEmail(email)
    if (emailValidationError) {
      setEmailError(emailValidationError)
      return
    }

    user.email = email;
    user.fullName = fullName || undefined;
    user.skillIds = selectedSkillIds;
    user.avatarUrl = avatarUrl || undefined;

    console.warn(user);

    onSave(user)
  }

  useEffect(() => {saveUserData();},[avatarUrl])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    saveUserData();
  }

  const toggleSkill = (skillId: number) => {
    setSelectedSkillIds((prev) => (prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]))
  }

  const removeSkill = (skillId: number) => {
    setSelectedSkillIds((prev) => prev.filter((id) => id !== skillId))
  }

  const getSkillNameById = (id: number) => {
    return skills.find((skill) => skill.id === id)?.name || `Навык ${id}`
  }

  const handleAvatarClick = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', user.id.toString());

      try {
        const response = await storageApi.uploadPhoto(formData);
        setAvatarUrl(response);
      } catch (error) {
        console.error("Ошибка при загрузке аватара:", error);
        // Здесь можно добавить уведомление об ошибке
      } finally {
        setIsUploading(false);
      }
    };

    fileInput.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Редактирование профиля</DialogTitle>
            <DialogDescription>Обновите информацию вашего профиля.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex flex-col items-center gap-4">
              <Avatar 
                className={cn(
                  "h-24 w-24 cursor-pointer",
                  isUploading && "opacity-50"
                )} 
                onClick={handleAvatarClick}
              >
                <AvatarImage src={avatarUrl ? `${STORAGE_API_URL}${avatarUrl}` : "/placeholder.svg"} alt={fullName} />
                <AvatarFallback>
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                  ) : (
                    <UserCircle className="h-16 w-16" />
                  )}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">Нажмите для загрузки фото</span>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailError("")
                }}
                placeholder="email@example.com"
              />
              {emailError && <p className="text-sm text-red-500">{emailError}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="full-name">Полное имя</Label>
              <Input
                id="full-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Иван Иванов"
              />
            </div>

            <div className="grid gap-2">
              <Label>Навыки</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedSkillIds.map((skillId) => (
                  <Badge key={skillId} variant="secondary" className="flex items-center gap-1">
                    {getSkillNameById(skillId)}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => removeSkill(skillId)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Удалить навык</span>
                    </Button>
                  </Badge>
                ))}
                {selectedSkillIds.length === 0 && (
                  <span className="text-sm text-muted-foreground">Навыки не выбраны</span>
                )}
              </div>
              <Popover open={openSkillsPopover} onOpenChange={setOpenSkillsPopover}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openSkillsPopover}
                    className="justify-between"
                  >
                    Выбрать навыки
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Поиск навыков..." />
                    <CommandList>
                      <CommandEmpty>Навыки не найдены.</CommandEmpty>
                      <CommandGroup>
                        {skills.map((skill) => (skill.id && (
                          <CommandItem
                            key={skill.id}
                            value={skill.name}
                            onSelect={() => {
                              if (!skill.id)
                                return;
                      
                              toggleSkill(skill.id)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedSkillIds.includes(skill.id) ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {skill.name}
                          </CommandItem>)
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit">Сохранить</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
