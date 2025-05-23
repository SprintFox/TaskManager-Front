"use client"

import type React from "react"
import { useState } from "react"
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
import { ProjectDTO } from "../../types/ProjectDTO"

interface AddBranchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (name: string) => void
}

export default function AddBranchDialog({ open, onOpenChange, onAdd }: AddBranchDialogProps) {
  const [projectName, setProjectName] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate input
    if (!projectName.trim()) {
      setError("Название проекта не может быть пустым")
      return
    }

    onAdd(projectName.trim())
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setProjectName("")

      setError("")
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Создать новую ветку</DialogTitle>
            <DialogDescription>Введите информацию для новой ветки.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project-name">Название ветки</Label>
              <Input
                id="project-name"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value)
                  setError("")
                }}
                placeholder="Новая ветка"
                autoFocus
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
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
