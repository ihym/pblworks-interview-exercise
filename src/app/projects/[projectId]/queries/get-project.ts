import { cache } from 'react'
import { prisma } from '@/prisma/prisma'

export const getProject = cache(async (id: number) => {
  return prisma.project.findUnique({ where: { id } })
})
