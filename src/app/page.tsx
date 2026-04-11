'use client'

import { useEffect, useState } from "react";

import EditTask from "@/components/edit-task";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Plus, List, Check, ArrowDownRight, Trash, ListChecks, Sigma } from 'lucide-react';
import { toast } from "sonner";

import { Tasks } from "@/generated/prisma/client";

import { getTasks } from "@/actions/get-tasks-from-db";
import { newTask } from "@/actions/add-task";
import { deleteTask } from "@/actions/delete-task";

export default function Home() {

  const [tasks, setTasks] = useState<Tasks[]>([])
  const [task, setTask] = useState<string>('')

  const handleAddTask = async () => {
    try {
      if (!task || task.length === 0) return

      const createdTask = await newTask(task)

      if (!createdTask) return

      handleGetTasks()
      setTask('')
      toast.success('Tarefa adicionada com sucesso!')
    } catch (error) {
      throw error
    }
  }

  const handleGetTasks = async () => {
    try {
      const tasks = await getTasks()

      if (!tasks) return

      setTasks(tasks)
    } catch (error) {
      throw error
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      if (!id) return

      const deletedTask = await deleteTask(id);

      if (!deletedTask) return

      handleGetTasks()
      toast.success('Tarefa deletada com sucesso!')
    } catch (error) {
      throw error
    }
  }

  const handleToggleTask = async (id: string) => {
    try {
      if (!id) return

      const previousTasks = [...tasks];

    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    handleGetTasks()
  }, [])

  return (
    <main className="w-full h-screen bg-gray-100 flex justify-center items-center">
      <Card className="w-lg p-4">
        <CardHeader className="flex flex-row gap-2">
          <Input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Adicionar tarefa"
          />

          <Button className="cursor-pointer" onClick={handleAddTask}>
            <Plus />Cadastrar
          </Button>
        </CardHeader>

        <CardContent>
          <Separator className="mb-4"/>

          <div className="flex flex-row gap-2">
            <Badge className="cursor-pointer" variant="default"><List />Todas</Badge>
            <Badge className="cursor-pointer" variant="outline"><ArrowDownRight />Não finalizadas</Badge>
            <Badge className="cursor-pointer" variant="outline"><Check />Concluídas</Badge>
          </div>

          <div  className="mt-4 border-b">
            {tasks.map(task => (
              <div key={task.id} className="h-12 flex justify-between items-center border-t">
                <div
                  className={`w-1.5 rounded-tr-md rounded-br-md ${task.done ? 'bg-green-300' : 'bg-red-400'}`}
                  style={{ height: '85%' }}
                ></div>

                <p
                  className="flex-1 px-2 text-sm cursor-pointer hover:text-gray-700 transition"
                  onClick={() => handleToggleTask(task.id)}
                >{task.task}</p>

                <div className="flex flex-row gap-2 items-center">
                  <EditTask />
                  <Trash
                    size={16}
                    className="cursor-pointer"
                    onClick={() => handleDeleteTask(task.id)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-row justify-between mt-4">
            <div className="flex flex-row gap-2 items-center">
              <ListChecks size={18} />
              <p className="text-xs">Tarefas Concluídas (3/3)</p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="text-xs h-7 cursor-pointer" variant="outline"><Trash />Limpar tarefas concluídas</Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza que deseja excluir 2 itens?</AlertDialogTitle>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogAction>Sim</AlertDialogAction>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="w-full h-2 bg-gray-100 mt-4 rounded-md">
            <div className="h-full bg-green-500 rounded-md" style={{ width: '50%' }}></div>
          </div>

          <div className="flex flex-row gap-2 items-center justify-end mt-2">
            <Sigma size={18}/>
            <p className="text-xs">3 tarefas no total</p>
          </div>
        </CardContent>

        <div></div>
      </Card>
    </main>
  )
}
