"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
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
import { Textarea } from "../../components/ui/textarea"
import { Badge } from "../../components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"
import { cn } from "../../lib/utils"
import type { Project } from "../../lib/types"
import { ProjectDTO } from "../../types/ProjectDTO"

interface Skill {
  id: number
  name: string
}

interface AddProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (name: string, description: string) => void
  existingProjects: ProjectDTO[]
}

export default function AddProjectDialog({ open, onOpenChange, onAdd, existingProjects }: AddProjectDialogProps) {
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate input
    if (!projectName.trim()) {
      setError("Название проекта не может быть пустым")
      return
    }

    // Check for duplicates
    if (existingProjects.some((project) => project.name.toLowerCase() === projectName.toLowerCase())) {
      setError("Проект с таким названием уже существует")
      return
    }

    onAdd(projectName.trim(), projectDescription.trim())
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setProjectName("")
      setProjectDescription("")
      setError("")
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Создать новый проект</DialogTitle>
            <DialogDescription>Введите информацию для нового проекта.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project-name">Название проекта</Label>
              <Input
                id="project-name"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value)
                  setError("")
                }}
                placeholder="Мой новый проект"
                autoFocus
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-description">Описание</Label>
              <Textarea
                id="project-description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Опишите ваш проект..."
                rows={4}
              />
            </div>
            
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit">Создать</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
