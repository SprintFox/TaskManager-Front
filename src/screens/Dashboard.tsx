import { useAuth } from '../context/AuthContext.tsx';
import { useEffect, useState } from "react"
import Header from "../components/header.tsx"
import React from 'react';
import { ThemeProvider } from '../lib/theme-provider.tsx';
import { useLocation, useNavigate } from "react-router-dom"
import AdminPanel from '../components/admin.tsx';
import ProjectsPanel from '../components/projects/projects-panel.tsx';
import { ProjectDTO, ProjectInfo, UserDTO } from '../types/ProjectDTO.ts';
import { TabsSystem } from '../components/project-system.tsx';
import { api, projectApi, userApi } from '../services/projectMainApi.ts';
import { ProjectHeader } from '../components/projects/project-header.tsx';

export default function Dashboard() {

  const [myUser, setMyUser] = useState<UserDTO>();

  const navigate = useNavigate();
  const { token, setToken } = useAuth();

  const [projectObject, setProjectObject] = useState<ProjectInfo>();

  const handleSignOut = () => {
    setToken(null);
    navigate('/login');
  };

  const location = useLocation()
  const [currentMode, setCurrentMode] = useState<string>('user')

  useEffect(() => {
    setCurrentMode(location.pathname.startsWith('/dashboard/admin') ? 'admin' : 'user')
  }, [location])

  const openProjectPage = (project: ProjectInfo) => {
    setProjectObject(project);
  }

  const handleCloseProject = () => {
    setProjectObject(undefined);
  }

  const handleRefreshProject = async () => {
    if (!projectObject?.projectDTO.id)
      return
    const updated_project: ProjectInfo = await projectApi.getProjectInfo(projectObject?.projectDTO.id)
    setProjectObject(updated_project);
  }

  useEffect(() => {
    const checkToken = async () => {
      api.get('/user').then((response)=>{
        console.warn(response.status)
        if (response.status === 403 || response.status === 401)
          handleSignOut();
      }).catch((reason)=>{
        if (reason.status === 403 || reason.status === 401)
          handleSignOut();
      });
      
    }
    checkToken();

    const getMyUser = async () => {
      const userdata = await userApi.getUser();
      setMyUser(userdata);
    }
    getMyUser();
  }, [])

  return (
    <React.Fragment>
      <ThemeProvider>
        <Header onLogout={handleSignOut} my_user={myUser} />

        {projectObject ? (
          <React.Fragment>
            <ProjectHeader refresh_project={handleRefreshProject} closeProjectMenu={handleCloseProject} projectName={projectObject.projectDTO.name} projectDescription={projectObject.projectDTO.description} projectImage={projectObject.projectDTO.avatarUrl} projectObject={projectObject} myUser={myUser}></ProjectHeader>
            <TabsSystem projectObj={projectObject} refresh_project={handleRefreshProject} myUsrObj={myUser}/>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {currentMode === 'user' ? (<ProjectsPanel onProjectsOpen={(project) => openProjectPage(project)} />) : (<AdminPanel />)}
          </React.Fragment>
        )
        }
      </ThemeProvider>
    </React.Fragment>
  );
}