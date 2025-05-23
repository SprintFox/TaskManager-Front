"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Calendar } from "../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { CalendarIcon, Clock } from "lucide-react"
import { format, setDate } from "date-fns"
import { ru } from "date-fns/locale"
import { cn } from "../../lib/utils"
import { TimePicker } from "../ui/time-field"
import { TaskDTO } from "../../types/ProjectDTO"

interface TaskFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: TaskDTO
  onSubmit: (task: TaskDTO) => void
}

export default function TaskFormDialog({ open, onOpenChange, task, onSubmit}: TaskFormDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [startTime, setStartTime] = useState<Date>(new Date())
  const [deadline, setDeadline] = useState<Date>(new Date())
  const [deadlineTime, setDeadlineTime] = useState<Date>(new Date())

  useEffect(() => {
    if (open && task) {
      setTitle(task.title || "")
      setDescription(task.description || "")
      setStartDate(new Date(task.startDate))
      setStartTime(new Date(task.startDate))
      setDeadline(new Date(task.endDate))
      setDeadlineTime(new Date(task.endDate))
    } else if (open) {
      // Set default values for new task
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)

      setTitle("")
      setDescription("")
      setStartDate(now)
      setStartTime(now)
      setDeadline(tomorrow)
      setDeadlineTime(tomorrow)
    }
  }, [open, task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Combine date and time
    const combinedStartDate = new Date(startDate)
    combinedStartDate.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0)

    const combinedDeadline = new Date(deadline)
    combinedDeadline.setHours(deadlineTime.getHours(), deadlineTime.getMinutes(), 0, 0)

    task.title = title
    task.description = description
    task.startDate = combinedStartDate.toISOString()
    task.endDate = combinedDeadline.toISOString()

    onSubmit(task)

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{"Изменить задачу"}</DialogTitle>
            <DialogDescription>
              {"Измените данные задачи."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Название</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Описание задачи</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label>Время начала</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP", { locale: ru }) : "Выберите дату"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date: React.SetStateAction<Date>) => date && setStartDate(date)}
                      initialFocus
                      required
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startTime && "text-muted-foreground",
                      )}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {startTime ? format(startTime, "HH:mm") : "Выберите время"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4">
                    <TimePicker date={startTime} onTimeChange={setStartTime} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Дедлайн</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !deadline && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deadline ? format(deadline, "PPP", { locale: ru }) : "Выберите дату"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={deadline} onSelect={(date: React.SetStateAction<Date>) => date && setDeadline(date)} className="mx-auto " locale={ru} required />

                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !deadlineTime && "text-muted-foreground",
                      )}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {deadlineTime ? format(deadlineTime, "HH:mm") : "Выберите время"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4">
                    <TimePicker date={deadlineTime} onTimeChange={setDeadlineTime} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit">{"Сохранить"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
