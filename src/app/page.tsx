'use client'

import { useEffect, useState } from "react";

import EditTask from "@/components/edit-task";


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

import { Plus, Trash, ListChecks, Sigma, LoaderCircle } from 'lucide-react';

import { toast } from "sonner";

import { Tasks } from "@/generated/prisma/client";

import { getTasks } from "@/actions/get-tasks-from-db";
import { newTask } from "@/actions/add-task";
import { deleteTask } from "@/actions/delete-task";
import { updateTaskStatus } from "@/actions/toggle-done";

import Filters, { FilterType } from "@/components/filters";

export default function Home() {

  const [tasks, setTasks] = useState<Tasks[]>([])
  const [task, setTask] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all')
  const [filteredTasks, setFilteredTasks] = useState<Tasks[]>(tasks)

  const handleAddTask = async () => {
    setLoading(true)

    try {
      if (!task || task.length === 0) {
        toast.error('Insira uma atividade')
        return
      }

      const createdTask = await newTask(task)

      if (!createdTask) return

      handleGetTasks()
      setTask('')
      toast.success('Tarefa adicionada com sucesso!')
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
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
    const previousTasks = [...tasks];

    try {
      if (!id) return

      setTasks((prev) => {
        const updatedTasksList = prev.map(task => {
          if (task.id === id) {
            return {
              ...task,
              done: !task.done
            }
          } else {
            return task
          }
        })

        return updatedTasksList
      })

      await updateTaskStatus(id);
    } catch (error) {
      setTasks(previousTasks)
      throw error
    }
  }

  useEffect(() => {
    handleGetTasks()
  }, [])

  useEffect(() => {
    switch (currentFilter) {
      case "all":
        setFilteredTasks(tasks)
        break

      case "pending":
        const pendingTasks = tasks.filter(task => !task.done)
        setFilteredTasks(pendingTasks)
        break

      case "completed":
        const completedTasks = tasks.filter(task => task.done)
        setFilteredTasks(completedTasks)
        break
    }
  }, [currentFilter, tasks])

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
            {loading ? <LoaderCircle className="animate-spin"/> : <Plus /> } Cadastrar
          </Button>
        </CardHeader>

        <CardContent>
          <Separator className="mb-4"/>

          <Filters currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} />

          <div  className="mt-4 border-b">
            {tasks.length === 0 && <p className="text-xs border-t py-4">Você não possui atividades cadastradas!</p>}
            {filteredTasks.map(task => (
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
                  <EditTask task={task} handleGetTasks={handleGetTasks}/>
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
