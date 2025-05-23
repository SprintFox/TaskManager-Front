"use client"

import { useEffect, useState } from "react"
import { UserCircle } from "lucide-react"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import UserProfileEditor from "./users/user-profile-editor"
import { useLocation, useNavigate } from "react-router-dom"
import { UserDTO } from "../types/ProjectDTO"
import { userApi } from "../services/projectMainApi"
import { STORAGE_API_URL } from "../services/storageApi"

interface HeaderListProps {
  onLogout: () => void
  my_user: UserDTO | undefined
}

export default function Header({ onLogout, my_user }: HeaderListProps) {
  const navigate = useNavigate();
  const [showProfileEditor, setShowProfileEditor] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserDTO>()

  const location = useLocation()
  const [currentMode, setCurrentMode] = useState('user')

  useEffect(() => {
    setCurrentMode(location.pathname.startsWith('/dashboard/admin') ? 'admin' : 'user')
  }, [location])

  const handleModeChange = (value: string) => {
    if (value === "admin") {
      navigate("/dashboard/admin")
    } else {
      navigate("/dashboard/user")
    }
  }

  const updateUser = async () => {
    const refreshed_user = await userApi.getUser();
    setCurrentUser(refreshed_user)
  }

  const handleUpdateProfile = async (updatedUser: UserDTO) => {
    await userApi.editUser(updatedUser)
    const refreshed_user = await userApi.getUser();
    setCurrentUser(refreshed_user);
    setShowProfileEditor(false);
  }

  useEffect(() => { updateUser(); }, [])

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-2">
            {/* <Image src="/placeholder.svg?height=32&width=32" alt="Логотип" width={32} height={32} className="rounded" /> */}
            <span className="text-xl font-bold">Платформа</span>
          </a>
          {my_user?.globalRole === "ADMIN" && (<Tabs value={currentMode} onValueChange={handleModeChange} className="ml-6">
            <TabsList>
              <TabsTrigger value="user">Пользователь</TabsTrigger>
              <TabsTrigger value="admin">Администратор</TabsTrigger>
            </TabsList>
          </Tabs>)}
          
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="flex items-center gap-2 px-2" onClick={() => setShowProfileEditor(true)}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser?.avatarUrl ? `${STORAGE_API_URL}${currentUser?.avatarUrl}` : "/placeholder.svg"} />
              <AvatarFallback>
                <UserCircle className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <span>{currentUser?.fullName || currentUser?.email || currentUser?.login}</span>
          </Button>
          <button
            onClick={() => onLogout()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Out
          </button>
        </div>
        {currentUser && (
          <UserProfileEditor
            open={showProfileEditor}
            onOpenChange={setShowProfileEditor}
            user={currentUser}
            onSave={handleUpdateProfile}
          />
        )}

      </div>
    </header>
  )
}
