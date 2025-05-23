import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"
import { useLocation, useNavigate } from "react-router-dom"
import SkillsAdminPanel from "./skills/skills-admin-panel";
import UsersAdminPanel from "./users/users-admin-panel";

export default function AdminPanel() {
    const navigate = useNavigate();

    const location = useLocation()
      const [currentMode, setCurrentMode] = useState('user')
    
      useEffect(() => {
        setCurrentMode(location.pathname.startsWith('/dashboard/admin/skills') ? 'skills' : 'users')
      }, [location])
      
    return (
        <div className="container py-6">
            <h1 className="text-4xl font-bold mb-6">Панель администратора</h1>

            <div className="mb-8">
                <Tabs defaultValue="skills" className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="skills" asChild>
                            <button onClick={() => navigate("/dashboard/admin/skills")}>Навыки</button>
                        </TabsTrigger>
                        <TabsTrigger value="users" asChild>
                            <button onClick={() => navigate("/dashboard/admin/users")}>Пользователи</button>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {currentMode === "skills" ? <SkillsAdminPanel/> : <UsersAdminPanel/>}
        </div>
    )
}
