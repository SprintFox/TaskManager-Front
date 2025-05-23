import { useEffect, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "./button"
import { Clock } from "lucide-react"
import { Input } from "./input"
import { cn } from "../../lib/utils"
import { format } from "date-fns"
import React from "react"

interface TimePickerProps {
  date: Date
  onTimeChange: (date: Date) => void
}

export function TimePicker({ date, onTimeChange }: TimePickerProps) {
  const [open, setOpen] = useState(false)
  const [hours, setHours] = useState<number>(date.getHours())
  const [minutes, setMinutes] = useState<number>(date.getMinutes())

  useEffect(() => {
    if (date) {
      setHours(date.getHours())
      setMinutes(date.getMinutes())
    }
  }, [date])

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHour = Number.parseInt(e.target.value) || 0
    const validHour = Math.max(0, Math.min(23, newHour))
    setHours(validHour)

    const newDate = new Date(date)
    newDate.setHours(validHour)
    newDate.setMinutes(minutes)
    onTimeChange(newDate)
  }

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinute = Number.parseInt(e.target.value) || 0
    const validMinute = Math.max(0, Math.min(59, newMinute))
    setMinutes(validMinute)

    const newDate = new Date(date)
    newDate.setHours(hours)
    newDate.setMinutes(validMinute)
    onTimeChange(newDate)
  }

  const setHour = (hour: number) => {
    setHours(hour)
    const newDate = new Date(date)
    newDate.setHours(hour)
    newDate.setMinutes(minutes)
    onTimeChange(newDate)
  }

  const setMinute = (minute: number) => {
    setMinutes(minute)
    const newDate = new Date(date)
    newDate.setHours(hours)
    newDate.setMinutes(minute)
    onTimeChange(newDate)
  }

  const timeString = format(date, "HH:mm")

  return (
    <Popover open={open} onOpenChange={setOpen}>

        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="grid gap-1 text-center">
              <div className="text-sm font-medium">Часы</div>
              <div className="flex flex-col items-center space-y-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setHour(hours < 23 ? hours + 1 : 0)}
                >
                  ▲
                </Button>
                <Input
                  className="h-9 w-16 text-center"
                  value={hours.toString().padStart(2, "0")}
                  onChange={handleHourChange}
                  min={0}
                  max={23}
                  type="number"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setHour(hours > 0 ? hours - 1 : 23)}
                >
                  ▼
                </Button>
              </div>
            </div>
            <div className="text-xl font-bold">:</div>
            <div className="grid gap-1 text-center">
              <div className="text-sm font-medium">Минуты</div>
              <div className="flex flex-col items-center space-y-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setMinute(minutes < 55 ? minutes + 5 : 0)}
                >
                  ▲
                </Button>
                <Input
                  className="h-9 w-16 text-center"
                  value={minutes.toString().padStart(2, "0")}
                  onChange={handleMinuteChange}
                  min={0}
                  max={59}
                  type="number"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setMinute(minutes > 0 ? minutes - 5 : 55)}
                >
                  ▼
                </Button>
              </div>
            </div>
          </div>
        </div>

    </Popover>
  )
}
