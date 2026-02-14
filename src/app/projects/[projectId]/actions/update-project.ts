'use server'

import { prisma } from '@/prisma/prisma'
import { Project } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const updateProject = async (project: Project) => {
  // update the project if the current lastUpdated in the db is less than the client's lastUpdated
  // avoids race conditions where multiple requests are sent at the same time
  // the last client update always wins
  const { count } = await prisma.project.updateMany({
    where: {
      id: project.id,
      lastUpdated: { lt: project.lastUpdated },
    },
    data: {
      lastUpdated: project.lastUpdated,
      title: project.title,
      subhead: project.subhead,
      description: project.description,
    },
  })

  if (count > 0) {
    revalidatePath('/projects')
    revalidatePath(`/projects/${project.id}`)
  }

  const updatedProject = await prisma.project.findUniqueOrThrow({
    where: { id: project.id },
  })

  return updatedProject
}
