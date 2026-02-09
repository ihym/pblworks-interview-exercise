import { EditProjectForm } from '@/app/projects/[projectId]/components/EditProjectForm/EditProjectForm'
import { prisma } from '@/prisma/prisma'
import { notFound } from 'next/navigation'

type PageProps = {
  params: Promise<{ projectId: string }>
}

export default async function Page({ params }: PageProps) {
  const { projectId } = await params
  const id = parseInt(projectId)

  const project = await prisma.project.findUnique({
    where: { id },
  })

  if (!project) {
    return notFound()
  }

  return <EditProjectForm project={project} />
}
