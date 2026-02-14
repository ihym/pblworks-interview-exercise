'use server'

import { prisma } from '@/prisma/prisma'
import { revalidatePath } from 'next/cache'

export const createEmptyProject = async () => {
  const project = await prisma.project.create({
    data: { lastUpdated: new Date() },
  })
  revalidatePath('/projects')

  return project
}
