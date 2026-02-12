import { CreateProjectButton } from '@/app/projects/components/CreateProjectButton'
import { ProjectsList } from '@/app/projects/components/ProjectsList'
import { prisma } from '@/prisma/prisma'
import { Stack } from '@mui/material'
import { Prisma } from '@prisma/client'

export default async function Page() {
  const projects = await prisma.project.findMany({
    orderBy: { id: Prisma.SortOrder.asc },
  })

  return (
    <Stack spacing={2}>
      <CreateProjectButton sx={{ alignSelf: 'flex-end' }} />
      <ProjectsList projects={projects} />
    </Stack>
  )
}
