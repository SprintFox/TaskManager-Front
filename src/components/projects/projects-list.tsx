"use client"

import { Edit, Trash2, MoreHorizontal } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Skeleton } from "../../components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { ProjectDTO, ProjectInfo } from "../../types/ProjectDTO"
import { projectApi } from "../../services/projectMainApi"

interface ProjectsListProps {
  projects: ProjectDTO[]
  isLoading: boolean
  onEdit: (project: ProjectDTO) => void
  onDelete: (project: ProjectDTO) => void
  onOpen: (project: ProjectInfo) => void
}

export default function ProjectsList({ projects, isLoading, onEdit, onDelete, onOpen }: ProjectsListProps) {


  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="h-[250px]">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        У вас пока нет проектов. Создайте свой первый проект, нажав кнопку "Создать проект".
      </div>
    )
  }

  const handleOpenProject = async (project: ProjectDTO) => {
    if (!project.id)
      return;
    const res_proj = await projectApi.getProjectInfo(project.id);
    onOpen(res_proj);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <Card key={project.id} className="overflow-hidden" >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle onClick={()=>handleOpenProject(project)} className="text-xl  cursor-pointer">{project.name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Действия</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(project)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Редактировать
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(project)} className="text-red-600 focus:text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Удалить
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardDescription>{project.description}</CardDescription>
            <CardDescription>ID: {project.id}</CardDescription>
            
          </CardHeader>
          <CardFooter className="pt-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(project)}>
              Редактировать
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
