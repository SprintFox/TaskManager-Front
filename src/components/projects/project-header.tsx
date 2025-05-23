import { ClipboardList, Plus, Projector, User, UserCircle, Users } from "lucide-react"
import { Badge } from "../ui/badge"
import { ProjectDTO, ProjectInfo, ProjectStatistics, UserDTO, ProjectMemberDTO, ProjectRole, UserProjectDTO } from "../../types/ProjectDTO"
import { useEffect, useState } from "react"
import { projectApi, projectsApi } from "../../services/projectMainApi"
import { Button } from "../ui/button"
import { BackwardIcon } from "@heroicons/react/16/solid"
import UserSearchDialog from "./project-user-search-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import React from "react"
import { STORAGE_API_URL, storageApi } from "../../services/storageApi"
import { toast } from "../ui/use-toast"
import { cn } from "../../lib/utils"

interface ProjectHeaderProps {
  projectImage: string
  projectName: string
  projectDescription: string
  projectObject: ProjectInfo
  currentRole: string
  myUser: UserDTO;
  closeProjectMenu: () => void
  refresh_project: () => void
}

export function ProjectHeader({
  projectImage,
  projectName,
  projectDescription,
  projectObject,
  currentRole,
  myUser,
  closeProjectMenu,
  refresh_project
}: Partial<ProjectHeaderProps>) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [myRole, setMyRole] = useState<String>()

  const [myRawRole, setMyRawRole] = useState<String>()


  useEffect(() => {
    if (!projectObject)
      return;
    if (!myUser)
      return;

    const target_user = projectObject.projectDTO.projectMembers.find(user => user.userId === myUser.id);
    setMyRawRole(target_user?.role.toString())
    console.warn(target_user)
    switch (target_user?.role) {
      case ProjectRole.MANAGER:
        setMyRole("Менеджер")
        break;
      case ProjectRole.MEMBER:
        setMyRole("Участник")
        break;
      case ProjectRole.OWNER:
        setMyRole("Организатор")
        break;
      default:
        break;
    }

  }, [projectObject, myUser])

  const handleUserSelect = (users: UserDTO[], role: ProjectRole) => {
    if (!projectObject?.projectDTO.id)
      return;
    users.forEach(async user => {
      if (!projectObject?.projectDTO.id)
        return;
      const updto: UserProjectDTO = {
        id: undefined,
        userId: user.id,
        projectId: projectObject?.projectDTO.id,
        projectRole: role,
      }

      await projectsApi.addUserToProject(projectObject?.projectDTO.id, updto)

      if (refresh_project)
        refresh_project();
    });
  }

  const handleRemoveUserFromProject = async (user_id: number) => {
    if (!projectObject?.projectId) {
      return;
    }
    await projectsApi.removeUserFromProject(projectObject?.projectId, user_id);
    if (refresh_project)
      refresh_project();
  }

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    const res_url = await storageApi.uploadPhoto(formData);

    if (!projectObject?.projectDTO) {
      throw new Error('Project data is undefined');
    }

    const updatedProjectDTO = {
      ...projectObject.projectDTO,
      avatarUrl: res_url
    };
    try {
      if (!projectObject?.projectDTO.id) {
        throw new Error('Project ID is undefined');
      }
      await projectsApi.editProject(updatedProjectDTO, projectObject.projectDTO.id);
      toast({
        title: "Успешно",
        description: `Проект был обновлен.`,
      })
      if (refresh_project)
      refresh_project();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить проект. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      })
      console.error("Failed to edit project:", error)
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border p-6 mb-6">
      <UserSearchDialog open={dialogOpen} onOpenChange={setDialogOpen} onSelect={handleUserSelect} />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col md:flex-col justify-between items-start md:items-center mb-2">
          <Button onClick={() => {
            if (!closeProjectMenu)
              return;
            closeProjectMenu()
          }}>
            <BackwardIcon className="mr-2 h-4 w-4" />
            Назад
          </Button>

          {myRawRole !== "MEMBER" &&
          <Button onClick={() => {
            setDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Добавить пользователя
          </Button>}
        </div>

        {/* Левая часть с изображением */}
        <div className="flex-shrink-0">
          <div className="relative h-28 w-28 rounded-full overflow-hidden border">
            <Avatar
              className={cn(
                "h-full w-full cursor-pointer"
              )}
              onClick={() => document.getElementById('fileInputProjectAva')?.click()}
            >
              <AvatarImage src={projectObject?.projectDTO.avatarUrl ? `${STORAGE_API_URL}${projectObject?.projectDTO.avatarUrl}` : "/placeholder.svg"} alt={"Project"} />
              <AvatarFallback>
                <Projector className="h-16 w-16" />
              </AvatarFallback>
            </Avatar>
            {/* <img src={projectObject?.projectDTO.avatarUrl || "/placeholder.svg"} alt={projectName} className="object-cover" onClick={() => document.getElementById('fileInputProjectAva')?.click()} /> */}
            <input
              id="fileInputProjectAva"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Центральная часть с информацией */}
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
            <h1 className="text-2xl font-bold">{projectName}</h1>
            <Badge variant="outline" className="px-3 py-1 text-sm bg-slate-50 mt-2 md:mt-0">
              {myRole}
            </Badge>
          </div>

          <p className="text-slate-700 mb-4">{projectDescription}</p>

          <div className="flex items-center text-slate-500 text-sm">
            <ClipboardList className="h-4 w-4 mr-1" />
            <span>Задач: всего - {projectObject?.project.statistics.taskCount} завершено - {projectObject?.project.statistics.completedTasksCount} проблемы - {projectObject?.project.statistics.problemTasksCount} дедлайн - {projectObject?.project.statistics.delayedTasksCount}</span>
          </div>
          <div className="flex items-center text-slate-500 text-sm">
            <Users className="h-4 w-4 mr-1" />
            <span className="flex flex-row items-center gap-3">Пользователи: {projectObject?.projectDTO.projectMembers && projectObject?.projectDTO.projectMembers.map((user) => (<React.Fragment>
              {myRawRole === "MEMBER" ? (<p>id:{user.userId} </p>) : (
                <React.Fragment>{user.userId === myUser?.id ? (<p>id:{user.userId} </p>) : (<p className="cursor-pointer" onClick={() => handleRemoveUserFromProject(user.userId)}>id:{user.userId} X </p>)} </React.Fragment>
              )}

            </React.Fragment>
            ))}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
