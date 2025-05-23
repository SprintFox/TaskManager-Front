"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { toast } from "../../components/ui/use-toast"
import { projectsApi, userApi } from "../../services/projectMainApi"
import ProjectsList from "./projects-list"
import AddProjectDialog from "./add-project-dialog"
import EditProjectDialog from "./edit-project-dialog"
import DeleteProjectDialog from "./delete-project-dialog"
import { ProjectDTO, ProjectInfo, TaskDTO } from "../../types/ProjectDTO"
import { format, addDays, parseISO, isWithinInterval, isSameDay } from "date-fns"
import { ru } from 'date-fns/locale'

interface ProjectsProps {
  onProjectsOpen: (project: ProjectInfo) => void
}


export default function ProjectsPanel({ onProjectsOpen }: ProjectsProps) {
  const [projects, setProjects] = useState<ProjectDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ProjectDTO | null>(null)

  const [tasks, setTasks] = useState<TaskDTO[]>()

  useEffect(() => {
    loadProjects()
    loadTasks()
  }, [])

  const loadTasks = async () => {
    const myTasks = await userApi.getTasks();
    setTasks(myTasks)
  }

  async function loadProjects() {
    try {
      setIsLoading(true)
      const projectsData = await projectsApi.getProjects()
      setProjects(projectsData)
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить проекты. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      })
      console.error("Failed to load projects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddProject = async (name: string, description: string) => {
    try {

      const newProjectObj: ProjectDTO = {
        id: undefined,
        name: name,
        description: description,
        createdAt: undefined,
        isActive: true,
        avatarUrl: undefined,
        projectMembers: [],
      }

      await projectsApi.addProject(newProjectObj)
      const updatedProjects = await projectsApi.getProjects();
      setProjects(updatedProjects)
      toast({
        title: "Успешно",
        description: `Проект "${name}" был создан.`,
      })
      setShowAddDialog(false)
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать проект. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      })
      console.error("Failed to add project:", error)
    }
  }

  const handleEditProject = async (projectId: number, newName: string, newDescription: string, project: ProjectDTO) => {
    try {
      project.name = newName;
      project.description = newDescription;

      await projectsApi.editProject(project, projectId)
      const updatedProjects = await projectsApi.getProjects();
      setProjects(updatedProjects)
      toast({
        title: "Успешно",
        description: `Проект был обновлен.`,
      })
      setShowEditDialog(false)
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить проект. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      })
      console.error("Failed to edit project:", error)
    }
  }

  const handleDeleteProject = async (projectId: number) => {
    try {
      await projectsApi.deleteProject(projectId)
      const updatedProjects = projects.filter((project) => project.id !== projectId)
      setProjects(updatedProjects)
      toast({
        title: "Успешно",
        description: `Проект был удален.`,
      })
      setShowDeleteDialog(false)
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить проект. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      })
      console.error("Failed to delete project:", error)
    }
  }

  const openEditDialog = (project: ProjectDTO) => {
    setSelectedProject(project)
    setShowEditDialog(true)
  }

  const openDeleteDialog = (project: ProjectDTO) => {
    setSelectedProject(project)
    setShowDeleteDialog(true)
  }
  const [currentDate, setCurrentDate] = useState(new Date())
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(currentDate, i)
    return {
      date,
      dayName: format(date, "EEE", { locale: ru }),
      dayNumber: format(date, "d"),
      month: format(date, "MMM", { locale: ru }),
    }
  })
  const isTaskOnDay = (task: TaskDTO, date: Date) => {
    const startDate = parseISO(task.startDate)
    const endDate = parseISO(task.endDate)

    return isWithinInterval(date, { start: startDate, end: endDate })
  }

  const getTaskPositionData = (task: TaskDTO) => {
    const startDate = parseISO(task.startDate)
    const endDate = parseISO(task.endDate)

    const startIndex = days.findIndex((day) => isSameDay(day.date, startDate) || day.date > startDate)

    const endIndex = days.findIndex((day) => isSameDay(day.date, endDate) || day.date > endDate)

    const span =
      endIndex === -1
        ? days.length - startIndex
        : isSameDay(days[endIndex].date, endDate)
          ? endIndex - startIndex + 1
          : endIndex - startIndex

    return {
      startIndex: Math.max(0, startIndex),
      span: Math.min(span, days.length - Math.max(0, startIndex)),
    }
  }
  const getTaskColor = () => {
    const colors = [
      { bg: "#ECFDF5", text: "#065F46", border: "#10B981" }, // Green
      { bg: "#EFF6FF", text: "#1E40AF", border: "#3B82F6" }, // Blue
      { bg: "#FEF2F2", text: "#991B1B", border: "#EF4444" }, // Red
      { bg: "#FFF7ED", text: "#9A3412", border: "#F97316" }, // Orange
      { bg: "#F5F3FF", text: "#5B21B6", border: "#8B5CF6" }, // Purple
      { bg: "#ECFEFF", text: "#155E75", border: "#06B6D4" }, // Cyan
      { bg: "#FFFBEB", text: "#92400E", border: "#F59E0B" }, // Amber
      { bg: "#F0FDF4", text: "#166534", border: "#22C55E" }, // Emerald
      { bg: "#F0FDFA", text: "#115E59", border: "#14B8A6" }, // Teal
      { bg: "#FDF4FF", text: "#831843", border: "#D946EF" }, // Fuchsia
    ]


    return colors[Math.floor(Math.random()*colors.length)]
  }

  return (
    <div className="container py-10 flex flex-col gap-1">
      {/* <CardModal card={currentCard} onDone={handleTaskDone} onProblem={handleTaskProblem} onClose={() => setIsModalOpen(false)} /> */}

      <h2 className="text-3xl font-bold mb-8">Мои проекты</h2>
      <Card>
        <CardHeader>
          <CardTitle>Планы</CardTitle>
          <CardDescription>Просматривайте свои планы на ближайшую неделю</CardDescription>
        </CardHeader>
        <CardContent className="container mx-auto p-4 max-w-7xl">
          {/* Days header */}
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-2 mb-4">
            {days.map((day, index) => (
              <div key={index} className="text-center">
                <div className="font-medium">{day.dayName}</div>
                <div className="text-sm text-muted-foreground">
                  {day.dayNumber} {day.month}
                </div>
              </div>
            ))}
          </div>
          <div className="hidden sm:grid sm:grid-cols-7 gap-2 mb-8">
            {days.map((day, dayIndex) => (
              <Card key={dayIndex} className="min-h-[200px] p-2 relative">
                <div className="task-container space-y-2">
                  {tasks && tasks.map((task, index) => {
                    if (isTaskOnDay(task, day.date)) {
                      const { startIndex, span } = getTaskPositionData(task)
                      const taskColor = getTaskColor()

                      // Only render the task on its start day
                      if (task.taskId && startIndex === dayIndex) {
                        const taskStyle = span > 1 ? { gridColumn: `span ${span}` } : {}

                        return (
                          <div
                            key={task.taskId}
                            className={`
                          task p-1.5 rounded-md text-xs font-medium
                          ${span > 1 ? "absolute left-0 right-0 z-10" : ""}
                        `}
                            style={{
                              ...taskStyle,
                              backgroundColor: taskColor.bg,
                              color: taskColor.text,
                              borderLeft: `3px solid ${taskColor.border}`,
                              top: `${(index - 1) * 28 + 28}px`,
                              width: span > 1 ? `calc(${span * 100}% - ${(span - 1) * 8}px)` : "auto",
                              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                            }}
                          >
                            {task.title}
                          </div>
                        )
                      }
                    }
                    return null
                  })}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Проекты</CardTitle>
          <CardDescription>Управляйте своими проектами.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div className="relative w-full max-w-sm">
                <Input
                  placeholder="Поиск проектов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-3"
                />
              </div>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Создать проект
              </Button>
            </div>

            <ProjectsList
              projects={filteredProjects}
              isLoading={isLoading}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
              onOpen={onProjectsOpen}
            />
          </div>

          <AddProjectDialog
            open={showAddDialog}
            onOpenChange={setShowAddDialog}
            onAdd={handleAddProject}
            existingProjects={projects}
          />

          {selectedProject && (
            <>
              <EditProjectDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                project={selectedProject}
                onEdit={handleEditProject}
                existingProjects={projects}
              />

              <DeleteProjectDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                project={selectedProject}
                onDelete={handleDeleteProject}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
