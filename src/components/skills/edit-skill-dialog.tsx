"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

interface EditSkillDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  skill: string
  index: number
  onEdit: (oldSkill: string, newSkill: string, index: number) => void
  existingSkills: string[]
}

export default function EditSkillDialog({
  open,
  onOpenChange,
  skill,
  index,
  onEdit,
  existingSkills,
}: EditSkillDialogProps) {
  const [editedSkill, setEditedSkill] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      setEditedSkill(skill)
      setError("")
    }
  }, [open, skill])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate input
    if (!editedSkill.trim()) {
      setError("Skill name cannot be empty")
      return
    }

    // Check for duplicates (excluding the current skill)
    if (
      editedSkill.toLowerCase() !== skill.toLowerCase() &&
      existingSkills.some((s) => s.toLowerCase() === editedSkill.toLowerCase())
    ) {
      setError("This skill already exists")
      return
    }

    onEdit(skill, editedSkill.trim(), index)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
            <DialogDescription>Update the name of the selected skill.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-skill-name">Skill Name</Label>
              <Input
                id="edit-skill-name"
                value={editedSkill}
                onChange={(e) => {
                  setEditedSkill(e.target.value)
                  setError("")
                }}
                autoFocus
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
