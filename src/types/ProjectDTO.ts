export interface ProjectDTO {
    id?: number;
    name: string;
    description: string;
    createdAt?: string;
    isActive: boolean;
    avatarUrl?: string;
    projectMembers: ProjectMemberDTO[];
}

export interface ProjectMemberDTO{
    id:number;
    userId: number;
    role: ProjectRole;
}

export interface SkillDTO{
    id?: number;
    name: string;
    type: string;
    userCount?: number;
}

export interface UserDTO{
    id: number;
    login: string;
    email: string;
    fullName?: string;
    globalRole: string;
    skillIds: number[];
    createdAt: string;
    avatarUrl?: string;
}

export interface ProjectInfo{
    projectId: number;
    projectDTO: ProjectDTO;
    project: ProjectStatistics
}

export interface ProjectStatistics{
    projectId: number;
    branches: BranchDTO[];
    statistics: TaskStatistics;
}

export interface BranchDTO{
    branchId?: string;
    name: string;
    active?: boolean;
    tasks?: TaskDTO[];
    statistics?: TaskStatistics;
}

export interface TaskStatistics{
    taskCount: number;
    completedTasksCount: number;
    delayedTasksCount: number;
    problemTasksCount: number;
}

export interface TaskContextDTO {
    projectId: number;
    branchId: string;
    task: TaskDTO;
}

export interface TaskDTO {
    taskId?: string;
    parentId?: string;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    done: boolean;
    hasProblem: boolean;
    problemMessage?: string;
    skillId?: number;
    assignedTo?: number;
    file?: string;
}

export interface UserProjectDTO {
    id?: number;
    userId: number;
    projectId: number;
    projectRole: ProjectRole;
}

export enum ProjectRole{
    OWNER="OWNER", MEMBER="MEMBER", MANAGER="MANAGER"
}