"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Upload } from "lucide-react"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { TaskDTO } from "../types/ProjectDTO"
import { Button } from "./ui/button"
import { projectApi } from "../services/projectMainApi"
import { storageApi } from "../services/storageApi"

interface CardModalProps {
  card: TaskDTO
  onDone: (card: TaskDTO) => void
  onProblem: (card: TaskDTO) => void
  onClose: () => void
}

export function CardModal({ card, onDone, onProblem, onClose }: CardModalProps) {
  const [editedCard, setEditedCard] = useState<TaskDTO>({ ...card })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      const response = await storageApi.uploadPhoto(formData);
      setEditedCard({...editedCard, file: response})
    }
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedCard({
      ...editedCard,
      problemMessage: e.target.value,
    })
    console.warn(editedCard)
  }

  const handleProblem = () => {
    onProblem(editedCard)
  }

  const handleDone = () => {
    onDone(editedCard)
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const removeFile = () => {
    setEditedCard({
      ...editedCard,
      file: undefined,
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Задача</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">{card.title}</Label>
          </div>

          <div>
            <Label htmlFor="description">{card.description}</Label>
          </div>

          <div>
            <Label htmlFor="content">Проблема (при наличии)</Label>
            <Textarea
              id="content"
              value={editedCard.problemMessage}
              onChange={handleContentChange}
              className="min-h-[200px]"
              placeholder="Введите текст..."
            />
          </div>

          <div>
            <Label>Файл</Label>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

            {editedCard.file ? (
              <div className="flex items-center mt-2 p-2 border rounded">
                <span className="flex-grow truncate">{editedCard.file}</span>
                <Button variant="ghost" size="icon" onClick={removeFile} className="ml-2">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={triggerFileInput} className="w-full mt-2">
                <Upload className="h-4 w-4 mr-2" />
                Прикрепить файл
              </Button>
            )}
          </div>

          <div className="flex gap-2 mt-6 justify-between">
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <div className="flex gap-2">
            <Button onClick={handleProblem}>Возникла проблема</Button>
            <Button onClick={handleDone}>Выполнено</Button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
