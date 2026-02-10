'use client'

// Re-export next/link with 'use client' so it can be passed as a prop
// (e.g. component={NextLink}) to a Client Component. Importing directly
// from 'next/link' and passing it as a prop fails with:
// "Functions cannot be passed directly to Client Components"
// https://github.com/mui/material-ui/issues/47109#issuecomment-3450447760
export { default as NextLink } from 'next/link'
