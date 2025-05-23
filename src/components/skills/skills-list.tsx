"use client"

import { Edit, Trash2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Skeleton } from "../../components/ui/skeleton"
import { SkillDTO } from "../../types/ProjectDTO"

interface SkillsListProps {
  skills: SkillDTO[]
  isLoading: boolean
  onEdit: (skill: SkillDTO, index: number) => void
  onDelete: (skill: SkillDTO, index: number) => void
}

export default function SkillsList({ skills, isLoading, onEdit, onDelete }: SkillsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (skills.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No skills found. Add your first skill to get started.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Skill Name</TableHead>
          <TableHead className="w-[120px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {skills.map((skill, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{skill.name}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(skill, index)}
                  aria-label={`Delete ${skill}`}
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
