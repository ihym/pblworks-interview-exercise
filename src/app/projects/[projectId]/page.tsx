import { EditProjectForm } from './components/EditProjectForm'
import { getProject } from './queries/get-project'
import { notFound } from 'next/navigation'

type PageProps = {
  params: Promise<{ projectId: string }>
}

export default async function Page({ params }: PageProps) {
  const { projectId } = await params
  const project = await getProject(parseInt(projectId))

  if (!project) {
    return notFound()
  }

  return <EditProjectForm project={project} />
}
