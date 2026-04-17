import { SquarePen } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Tasks } from "@/generated/prisma/client";
import { useState } from "react";
import { toast } from "sonner";
import { editTask } from "@/actions/edit-task";

type TaskProps = {
  task: Tasks,
  handleGetTasks: () => void
}

export default function EditTask({ task, handleGetTasks }: TaskProps) {

  const [editedTask, setEditedTask] = useState<string>(task.task)

  const handleEditTask = async () => {
    if (editedTask === task.task) {
      toast.error('As informações não foram alteradas!')
      return
    }

    await editTask({id: task.id, task: editedTask})
    handleGetTasks()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SquarePen size={16} className="cursor-pointer"/>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
        </DialogHeader>

        <div className="flex flex-row gap-2">
          <Input
            placeholder="Editar Tarefa"
            value={editedTask}
            onChange={(e) => setEditedTask(e.target.value)}
            className="flex-1"
          />

          <DialogClose asChild>
            <Button
              className="cursor-pointer"
              onClick={handleEditTask}
            >Editar</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
