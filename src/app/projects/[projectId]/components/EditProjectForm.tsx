'use client'

import {
  Alert,
  AlertTitle,
  Button,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  TextField,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { Project } from '@prisma/client'
import { useState } from 'react'
import { updateProject } from '../actions/update-project'
import { useAutosave } from '../hooks/useAutosave'

type FormKeys = 'title' | 'subhead' | 'description'
type FormValues = Pick<Project, FormKeys>

export const EditProjectForm = ({ project }: { project: Project }) => {
  const initialValues: FormValues = {
    title: project.title,
    subhead: project.subhead,
    description: project.description,
  }
  const [formValues, setFormValues] = useState<FormValues>(initialValues)
  const [error, setError] = useState<unknown>(null)
  const { save, isSaving } = useAutosave({
    payload: {
      id: project.id,
      ...formValues,
    },
    onSave: async (payload) =>
      updateProject({ ...payload, lastUpdated: new Date() }),
    onSuccess: () => {
      setError(null)
    },
    onError: (err) => {
      setError(err)
    },
  })

  const updateField = (field: FormKeys, value: string) => {
    setFormValues((previousValues) => ({ ...previousValues, [field]: value }))
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    save()
  }

  return (
    <Paper component="form" onSubmit={onSubmit} sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <TextField
            fullWidth
            label="Project Title"
            value={formValues.title}
            placeholder="Enter the project title, eg. 'Power of the punch'"
            onChange={(event) => updateField('title', event.target.value)}
            onBlur={save}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          <TextField
            fullWidth
            label="Project Subhead"
            value={formValues.subhead}
            placeholder="Use a small sentence to describe the project, eg. 'Students will learn Newtons Laws while constructing a boxing glove'"
            onChange={(event) => updateField('subhead', event.target.value)}
            onBlur={save}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            label="Project Description"
            value={formValues.description}
            placeholder="Describe the project in detail (suggested length: 300 words)"
            onChange={(event) => updateField('description', event.target.value)}
            onBlur={save}
            multiline
            rows={4}
          />
        </Grid>
      </Grid>
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={(_, reason) => {
          if (reason === 'clickaway' || isSaving) {
            return
          }
          setError(null)
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          action={
            <>
              <Button
                color="inherit"
                size="small"
                onClick={save}
                disabled={isSaving}
              >
                {isSaving ? 'Retrying...' : 'Retry'}
              </Button>
              <IconButton
                aria-label="dismiss"
                color="inherit"
                size="small"
                onClick={() => setError(null)}
                disabled={isSaving}
              >
                <Close fontSize="small" />
              </IconButton>
            </>
          }
        >
          <AlertTitle>Could not save project</AlertTitle>
          {error instanceof Error
            ? error.message
            : 'Please try again in a moment.'}
        </Alert>
      </Snackbar>

      {/* hidden submit button to trigger the form submission on submit */}
      <button type="submit" hidden disabled={isSaving}></button>
    </Paper>
  )
}
