import { SquarePen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function EditTask() {
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
          <Input placeholder="Editar Tarefa" className="flex-1"/>
          <Button className="cursor-pointer">Editar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
