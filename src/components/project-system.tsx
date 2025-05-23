"use client"

import React from "react"

import { useEffect, useState } from "react"
import { Cross, Delete, Plus, X } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs"
import { Button } from "./ui/button"
import { Card, CardFooter } from "./ui/card"
import { CardModal } from "./card-modal"
import { BranchDTO, ProjectInfo, ProjectRole, TaskDTO, UserDTO } from "../types/ProjectDTO"
import AddBranchDialog from "./projects/add-branch-dialog"
import { projectApi } from "../services/projectMainApi"
import TaskFormDialog from "./projects/edit-task-dialog"
import BranchUserSearchDialog from "./branch/add-user-to-branch-dialog"
import { STORAGE_API_URL } from "../services/storageApi"

interface BranchProps {
  projectObj: ProjectInfo
  refresh_project: () => void
  myUsrObj: UserDTO | undefined
}

export function TabsSystem({ projectObj, refresh_project, myUsrObj }: BranchProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [tabs, setTabs] = useState<BranchDTO[]>()
  const [activeTab, setActiveTab] = useState<string>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentCard, setCurrentCard] = useState<TaskDTO | null>(null)
  const [myRole, setMyRole] = useState<String>()

  const [selectedTaskDialog, setSelectedTaskDialog] = useState<TaskDTO>();
  const [selectedBranchId, setSelectedBranchId] = useState<string>();


  const refresh_all = () => {
    setTabs(projectObj.project.branches)
    console.warn(projectObj.project.branches)
  }

  useEffect(() => {
    if (!projectObj)
      return;
    if (!myUsrObj)
      return;

    const target_user = projectObj.projectDTO.projectMembers.find(user => user.userId === myUsrObj.id);
    setMyRole(target_user?.role)
  }, [projectObj, myUsrObj])

  useEffect(() => {
    refresh_all();
  }, [projectObj])

  // Add a new tab
  const handleAddBranch = async (new_branch_name: string) => {
    if (!projectObj.projectDTO.id)
      return;
    const new_branch_obj: BranchDTO = {
      branchId: undefined,
      name: new_branch_name,
      active: undefined,
      tasks: undefined,
      statistics: undefined,
    }
    await projectApi.addBranche(projectObj.projectDTO.id, new_branch_obj);


    refresh_project();
    setShowAddDialog(false);
  }

  // Remove a tab
  const removeTab = async (branch: BranchDTO, e: React.MouseEvent) => {
    if (!projectObj.projectDTO.id)
      return;
    await projectApi.deleteProjectBranch(projectObj.projectDTO.id, branch)
    refresh_project();
  }

  // Add a new card to the active tab
  const addCard = async (project_id: number | undefined, branch_id: string | undefined) => {
    if (!project_id || !branch_id) return;
    const new_task: TaskDTO = {
      taskId: undefined,
      parentId: undefined,
      title: "Новая задача",
      description: "...",
      startDate: new Date().toLocaleDateString(),
      endDate: new Date().toLocaleDateString(),
      done: false,
      hasProblem: false,
      problemMessage: undefined,
      skillId: undefined,
      assignedTo: undefined,
      file: undefined,
    }
    await projectApi.addTaskToBranch(project_id, branch_id, new_task)
    refresh_project()
  }

  // Delete a card from the active tab
  const deleteCard = async (cardId: string, branch_id: string, task: TaskDTO, e: React.MouseEvent) => {
    if (!projectObj.projectId || !branch_id || !cardId) return;
    await projectApi.deleteTaskInBranch(projectObj.projectId, branch_id, cardId, task)
    refresh_project()
  }

  // Open modal with card data
  const openCardModal = (card: TaskDTO, branch: BranchDTO) => {
    setCurrentCard(card)
    setSelectedBranchId(branch.branchId)
    setIsModalOpen(true)
  }


  function onEdit(card: TaskDTO, branch_id: string): void {
    setSelectedTaskDialog(card);
    setSelectedBranchId(branch_id);
    setShowEditDialog(true);
  }

  function onUserToTaskConnection(task: TaskDTO, branch_id: string): void {
    setSelectedTaskDialog(task);
    setSelectedBranchId(branch_id);
    setDialogOpen(true);
  }

  async function handleEditTask(task: TaskDTO) {
    if (!task.taskId)
      return;
    if (!selectedBranchId)
      return;
    await projectApi.editTaskInBranch(projectObj.projectId, selectedBranchId, task.taskId, task)
    refresh_project();
  }

  const handleUserToTaskSelect = async (user: UserDTO) => {
    if (!selectedTaskDialog || !selectedBranchId || !projectObj.projectId || !selectedTaskDialog.taskId) {
      return;
    }
    const new_task: TaskDTO = selectedTaskDialog;
    new_task.assignedTo = user.id
    await projectApi.editTaskInBranch(projectObj.projectId, selectedBranchId, selectedTaskDialog.taskId, selectedTaskDialog)
    refresh_project();
  }

  const removeUserFromTask = async (task: TaskDTO, branch_id: string) => {
    if (!task.taskId)
      return;
    task.assignedTo = undefined
    await projectApi.editTaskInBranch(projectObj.projectId, branch_id, task.taskId, task)
    refresh_project();
  }

  const handleTaskDone = async (task: TaskDTO) => {
    if (!selectedBranchId || !projectObj.projectId || !task.taskId) {
      return;
    }
    task.done = true
    task.hasProblem = false
    await projectApi.doneTaskInBranch(projectObj.projectId, selectedBranchId, task.taskId)
    refresh_project();
  }

  const handleTaskProblem = async (task: TaskDTO) => {
    if (!selectedBranchId || !projectObj.projectId || !task.taskId) {
      return;
    }
    task.done = false
    task.hasProblem = true
    await projectApi.problemTaskInBranch(projectObj.projectId, selectedBranchId, task.taskId)
    refresh_project();
  }

  const card_style = "h-[200px] p-4 hover:shadow-md transition-shadow relative justify-between flex flex-col"

  return (
    <div className="w-full">
      <BranchUserSearchDialog open={dialogOpen} onOpenChange={setDialogOpen} onSelect={handleUserToTaskSelect} projectData={projectObj} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center border-b">
          <TabsList className="h-10 flex-grow">
            {tabs && tabs.map((tab) => (
              <React.Fragment key={tab.branchId}>
                {tab.tasks && tab.branchId && (<TabsTrigger key={tab.branchId} value={tab.branchId} className="relative px-4 py-2">
                  {tab.name}
                  {myRole && myRole !== ProjectRole.MEMBER && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTab(tab, e);
                      }}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </div>
                  )}
                </TabsTrigger>)}
              </React.Fragment>
            ))}
          </TabsList>
          {myRole && myRole !== ProjectRole.MEMBER && (<Button variant="ghost" size="icon" onClick={() => setShowAddDialog(true)} className="h-10 w-10 ml-2">
            <Plus className="h-5 w-5" />
          </Button>)}
        </div>

        {tabs && tabs.map((tab) => (
          <React.Fragment key={tab.branchId}>
            {tab.branchId && tab.tasks && (<TabsContent key={tab.branchId} value={tab.branchId} className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tab.tasks.map((card) => (
                  <Card
                    key={card.taskId}
                    className={`${card_style} ${card.done && 'bg-green-100'} ${card.hasProblem && 'bg-red-100'}`}

                  >
                    {myRole && myRole !== ProjectRole.MEMBER &&
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (card.taskId && tab.branchId) {
                            deleteCard(card.taskId, tab.branchId, card, e);
                          }
                        }}
                        className="absolute top-2 right-2 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 z-10 cursor-pointer"
                        aria-label="Удалить карточку"
                      >
                        <X className="h-3 w-3" />
                      </div>
                    }

                    {myRole && myRole !== ProjectRole.MEMBER ? 
                    (<h3 className="font-medium text-lg pr-6 cursor-pointer" onClick={() => openCardModal(card, tab)}>{card.title}</h3>) : 
                    (<React.Fragment>
                      {myUsrObj && myUsrObj.id === card.assignedTo ? (<h3 className="font-medium text-lg pr-6 cursor-pointer" onClick={() => openCardModal(card, tab)}>{card.title}</h3>) : 
                      (<h3 className="font-medium text-lg pr-6">{card.title}</h3>)}
                    </React.Fragment>)}
                    {card.problemMessage ? <div className="flex flex-col gap-0"><p className="text-muted-foreground">Ответ получен:</p><p className="font-medium text-lg pr-6">{card.problemMessage}</p></div> : <p className="text-muted-foreground">{card.description}</p>}
                    {card.assignedTo && <div className="flex flex-row"><p className="text-muted-foreground">Назначен: id{card.assignedTo}</p><Delete className="cursor-pointer" onClick={() => tab.branchId && removeUserFromTask(card, tab.branchId)} /></div>}
                    
                    {card.file && <a href={`${STORAGE_API_URL}${card.file}`} target="_blank" download={card.title} className="text-sm text-blue-500 mt-2">Прикреплен файл: скачать</a>}
                    {myRole && myRole !== ProjectRole.MEMBER &&
                      <CardFooter className="pt-2 flex flex-row gap-1 p-0">
                        <Button size="sm" onClick={() => tab.branchId && onEdit(card, tab.branchId)}>
                          Редактировать
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => tab.branchId && onUserToTaskConnection(card, tab.branchId)}>
                          Назначить человека
                        </Button>
                      </CardFooter>}

                  </Card>
                ))}
                {myRole && myRole !== ProjectRole.MEMBER && tab.branchId && (
                  <Button
                    variant="outline"
                    className="h-[200px] flex flex-col items-center justify-center border-dashed"
                    onClick={() => addCard(projectObj.projectId, tab.branchId)}
                  >
                    <Plus className="h-6 w-6 mb-2" />
                    <span>Добавить Задачу</span>
                  </Button>
                )}
              </div>
            </TabsContent>)}
          </React.Fragment>
        ))}
      </Tabs>
      {selectedTaskDialog && selectedBranchId && (
        <TaskFormDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          task={selectedTaskDialog}
          onSubmit={handleEditTask}
        />
      )}
      <AddBranchDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={handleAddBranch}
      />

      {isModalOpen && currentCard && (
        <CardModal card={currentCard} onDone={handleTaskDone} onProblem={handleTaskProblem} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  )
}
