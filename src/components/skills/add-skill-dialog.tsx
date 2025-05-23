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
import { SkillDTO } from "../../types/ProjectDTO"

interface AddSkillDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (skill: SkillDTO) => void
  existingSkills: SkillDTO[]
}

export default function AddSkillDialog({ open, onOpenChange, onAdd, existingSkills }: AddSkillDialogProps) {
  const [newSkillName, setNewSkillName] = useState("")
  const [newSkillType, setNewSkillType] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate input
    if (!newSkillName.trim()) {
      setError("Skill name cannot be empty")
      return
    }

    if (!newSkillType.trim()) {
      setError("Skill type cannot be empty")
      return
    }

    // Check for duplicates
    if (existingSkills.some((skill) => skill.name.toLowerCase() === newSkillName.toLowerCase())) {
      setError("This skill already exists")
      return
    }

    const new_skill: SkillDTO = {
      id: undefined,
      name: newSkillName,
      type: newSkillType,
      userCount: undefined,
    }

    onAdd(new_skill)
    setNewSkillName("")
    setNewSkillType("")
    setError("")
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setNewSkillName("")
      setNewSkillType("")
      setError("")
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
            <DialogDescription>Enter the name of the skill you want to add.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="skill-name">Skill Name</Label>
              <Input
                id="skill-name"
                value={newSkillName}
                onChange={(e) => {
                  setNewSkillName(e.target.value)
                  setError("")
                }}
                placeholder="e.g., Programming"
                autoFocus
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="skill-name">Skill Type</Label>
              <Input
                id="skill-name"
                value={newSkillType}
                onChange={(e) => {
                  setNewSkillType(e.target.value)
                  setError("")
                }}
                placeholder="e.g., Programming"
                autoFocus
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Skill</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
