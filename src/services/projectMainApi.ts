import axios from 'axios';
import {BranchDTO, ProjectDTO, ProjectInfo, ProjectMemberDTO, ProjectStatistics, SkillDTO, TaskDTO, TaskStatistics, UserDTO, UserProjectDTO} from "../types/ProjectDTO.ts";

// const AUTH_API_URL = 'http://172.24.22.109:8080';
const AUTH_API_URL = 'http://localhost:8000';

export const api = axios.create({
    baseURL: AUTH_API_URL,
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json; charset=utf-8'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const projectApi = {
    async getProjectInfo(project_id: number): Promise<ProjectInfo> {
        const response = await api.get(`/project/${project_id}`);
        return response.data;
    },

    async addBranche(project_id: number,branch: BranchDTO): Promise<boolean> {
        const response = await api.post(`/project/${project_id}/branch`, branch);
        return response.data;
    },

    async editProjectBranch(project_id: number, edited_branch: BranchDTO): Promise<boolean>{
        const response = await api.post(`/project/${project_id}/branch/edit`, edited_branch);
        return response.data;
    },

    async deleteProjectBranch(project_id: number, branch_to_delete: BranchDTO): Promise<boolean>{
        const response = await api.post(`/project/${project_id}/branch/delete`, branch_to_delete);
        return response.data;
    },

    async addTaskToBranch(project_id: number, branch_id: string, task: TaskDTO): Promise<boolean>{
        const response = await api.post(`/project/${project_id}/branch/${branch_id}`, task);
        return response.data;
    },

    async editTaskInBranch(project_id: number, branch_id: string, task_id: string, task: TaskDTO): Promise<boolean>{
        const response = await api.post(`/project/${project_id}/branch/${branch_id}/task/${task_id}`, task);
        return response.data;
    },

    async deleteTaskInBranch(project_id: number, branch_id: string, task_id: string, task: TaskDTO): Promise<boolean>{
        const response = await api.post(`/project/${project_id}/branch/${branch_id}/task/${task_id}/delete`, task);
        return response.data;
    },

    async doneTaskInBranch(project_id: number, branch_id: string, task_id: string): Promise<boolean>{
        const response = await api.post(`/project/${project_id}/branch/${branch_id}/task/${task_id}/done`);
        return response.data;
    },

    async problemTaskInBranch(project_id: number, branch_id: string, task_id: string): Promise<boolean>{
        const response = await api.post(`/project/${project_id}/branch/${branch_id}/task/${task_id}/problem`);
        return response.data;
    },

    async getStatsForProject(project_id: number): Promise<TaskStatistics>{
        const response = await api.post(`/project/${project_id}`);
        return response.data;
    },
}

export const projectsApi = {
    async getProjects(): Promise<ProjectDTO[]> {
        const response = await api.get('/projects/list');
        return response.data;
    },

    async addProject(projectDTO:ProjectDTO): Promise<ProjectDTO> {
        const response = await api.post(`/projects`, projectDTO);
        return response.data;
    },

    async editProject(projectDTO:ProjectDTO, project_id: number): Promise<ProjectDTO> {
        const response = await api.post(`/projects/${project_id}/edit`, projectDTO);
        return response.data;
    },

    async deleteProject(project_id: number): Promise<ProjectDTO> {
        const response = await api.post(`/projects/${project_id}/delete`);
        return response.data;
    },

    async addUserToProject(project_id: number, userProjectDto: UserProjectDTO): Promise<ProjectDTO> {
        const response = await api.post(`/projects/${project_id}/users`, userProjectDto);
        return response.data;
    },

    async removeUserFromProject(project_id: number, user_id: number): Promise<ProjectDTO> {
        const response = await api.post(`/projects/${project_id}/users/${user_id}`);
        return response.data;
    },

    async modifyUserInProject(project_id: number, user_id: number, userDto: ProjectMemberDTO): Promise<ProjectDTO> {
        const response = await api.post(`/projects/${project_id}/users/${user_id}/edit`, userDto);
        return response.data;
    },
};

export const userApi = {
    async getUser(): Promise<UserDTO> {
        const response = await api.get('/user');
        return response.data;
    },

    async editUser(user: UserDTO): Promise<UserDTO> {
        const response = await api.post('/user/edit', user);
        return response.data;
    },

    async getTasks(): Promise<TaskDTO[]> {
        const response = await api.get('/user/tasks');
        return response.data;
    },
}

export const adminApi = {
    async getSkills(): Promise<SkillDTO[]> {
        const response = await api.get('/admin/skills');
        return response.data;
    },

    async addSkill(skill:SkillDTO): Promise<SkillDTO[]> {
        const response = await api.post('/admin/skills', skill);
        return response.data;
    },

    async deleteSkill(skill_id: number): Promise<SkillDTO[]> {
        const response = await api.get(`/admin/skills/${skill_id}/delete`);
        return response.data;
    },

    async getUsers(): Promise<UserDTO[]> {
        const response = await api.get('/admin/user');
        return response.data;
    },

    async editUser(user_id: number, user_role: string): Promise<SkillDTO[]> {
        const response = await api.post(`/admin/user/${user_id}?role=${user_role}`);
        return response.data;
    },

    async deleteUser(user_id: number): Promise<SkillDTO[]> {
        const response = await api.post(`/admin/user/${user_id}/delete`);
        return response.data;
    }
}

