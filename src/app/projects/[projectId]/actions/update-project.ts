'use server'

import { prisma } from '@/prisma/prisma'
import { Project } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const updateProject = async (project: Project) => {
  const updatedProject = await prisma.project.update({
    where: { id: project.id },
    data: {
      title: project.title,
      subhead: project.subhead,
      description: project.description,
    },
  })

  revalidatePath('/projects')
  revalidatePath(`/projects/${project.id}`)

  return updatedProject
}
