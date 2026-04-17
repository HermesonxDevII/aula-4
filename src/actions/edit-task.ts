'use server'

import { prisma } from "@/utils/prisma"

type EditTaskProps = {
  id: string,
  task: string
}

export const editTask = async ({ id, task }: EditTaskProps) => {
  try {
    if (!id || !task) return

    const editedTask = await prisma.tasks.update({
      where: { id: id },
      data: { task: task }
    })

    if (!editedTask) return

    return editedTask
  } catch (error) {
    throw error
  }
}
