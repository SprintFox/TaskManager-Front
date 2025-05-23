"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { toast } from "../../components/ui/use-toast"

import SkillsList from "./skills-list"
import AddSkillDialog from "./add-skill-dialog"
import DeleteSkillDialog from "./delete-skill-dialog"
import { adminApi } from "../../services/projectMainApi"
import { SkillDTO } from "../../types/ProjectDTO"

export default function SkillsAdminPanel() {
  const [skills, setSkills] = useState<SkillDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<SkillDTO>()
  const [selectedIndex, setSelectedIndex] = useState(-1)

  useEffect(() => {
    loadSkills()
  }, [])

  async function loadSkills() {
    try {
      setIsLoading(true)
      const skillsData = await adminApi.getSkills()
      setSkills(skillsData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load skills. Please try again.",
        variant: "destructive",
      })
      console.error("Failed to load skills:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredSkills = skills.filter((skill) => skill.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleAddSkill = async (newSkill: SkillDTO) => {
    try {

      await adminApi.addSkill(newSkill)
      const refreshed_skills = await adminApi.getSkills();
      setSkills(refreshed_skills)
      toast({
        title: "Success",
        description: `Skill "${newSkill.name}" has been added.`,
      })
      setShowAddDialog(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add skill. Please try again.",
        variant: "destructive",
      })
      console.error("Failed to add skill:", error)
    }
  }

  const handleDeleteSkill = async (skill: SkillDTO) => {
    try {
      if (!skill.id)
        return;
      await adminApi.deleteSkill(skill.id)
      const updatedSkills = await adminApi.getSkills()
      setSkills(updatedSkills)
      toast({
        title: "Success",
        description: `Skill "${skill}" has been deleted.`,
      })
      setShowDeleteDialog(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete skill. Please try again.",
        variant: "destructive",
      })
      console.error("Failed to delete skill:", error)
    }
  }

  const openEditDialog = (skill: SkillDTO, index: number) => {
    setSelectedSkill(skill)
    setSelectedIndex(index)
    setShowEditDialog(true)
  }

  const openDeleteDialog = (skill: SkillDTO, index: number) => {
    setSelectedSkill(skill)
    setSelectedIndex(index)
    setShowDeleteDialog(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>Manage the skills available in your application.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative w-full max-w-sm">
              <Input
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-3"
              />
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
          </div>

          <SkillsList
            skills={filteredSkills}
            isLoading={isLoading}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        </div>

        <AddSkillDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAdd={handleAddSkill}
          existingSkills={skills}
        />
        {selectedSkill && (<DeleteSkillDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          skill={selectedSkill}
          index={selectedIndex}
          onDelete={handleDeleteSkill}
        />)}

      </CardContent>
    </Card>
  )
}
