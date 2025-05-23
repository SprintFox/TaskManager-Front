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

interface EditProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: ProjectDTO
  onEdit: (projectId: number, newName: string, newDescription: string, project: ProjectDTO) => void
  existingProjects: ProjectDTO[]
}

export default function EditProjectDialog({
  open,
  onOpenChange,
  project,
  onEdit,
  existingProjects,
}: EditProjectDialogProps) {
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (open && project) {
      setProjectName(project.name)
      setProjectDescription(project.description)
      setError("")
    }
  }, [open, project])


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate input
    if (!projectName.trim()) {
      setError("Название проекта не может быть пустым")
      return
    }

    // Check for duplicates (excluding the current project)
    if (
      projectName.toLowerCase() !== project.name.toLowerCase() &&
      existingProjects.some((p) => p.name.toLowerCase() === projectName.toLowerCase())
    ) {
      setError("Проект с таким названием уже существует")
      return
    }

    if (!project.id) {
      setError("Проекта не существует")
      return
    }
    else {
      onEdit(project.id, projectName.trim(), projectDescription.trim(), project)
    }


  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Редактировать проект</DialogTitle>
            <DialogDescription>Обновите информацию о проекте.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-project-name">Название проекта</Label>
              <Input
                id="edit-project-name"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value)
                  setError("")
                }}
                autoFocus
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-project-description">Описание</Label>
              <Textarea
                id="edit-project-description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows={4}
              />
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
