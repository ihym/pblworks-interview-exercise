'use client'

import { createEmptyProject } from '@/app/projects/actions/create-project'
import { Add } from '@mui/icons-material'
import { Button, ButtonProps } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const CreateProjectButton = (props: ButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const onClick = async () => {
    setIsLoading(true)
    try {
      const newProject = await createEmptyProject()
      router.push(`/projects/${newProject.id}`)
    } catch (error: unknown) {
      console.error('Error while trying to create empty project', { error })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      {...props}
      loading={isLoading}
      startIcon={<Add />}
      variant="contained"
      onClick={onClick}
    >
      Create Project
    </Button>
  )
}
