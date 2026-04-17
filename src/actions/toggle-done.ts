'use server'

import { prisma } from "@/utils/prisma"

export const updateTaskStatus = async (id: string) => {
  try {
    const currentTask = await prisma.tasks.findUnique({
      where: { id: id }
    })

    if (!currentTask) return

    const updatedStatus = await prisma.tasks.update({
      where: { id: id },
      data: { done: !currentTask.done }
    })

    if (!updatedStatus) return

    return updatedStatus
  } catch (error) {
    throw error
  }
}
