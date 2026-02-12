import { getProject } from '@/app/projects/[projectId]/queries/get-project'

type TitlePageProps = {
  params: Promise<{ projectId: string }>
}

export default async function ProjectTitlePage({ params }: TitlePageProps) {
  const { projectId } = await params
  const project = await getProject(parseInt(projectId))
  const projectTitle = project ? project.title || 'Untitled Project' : null

  return <>{projectTitle}</>
}
