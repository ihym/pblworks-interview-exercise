This repo is meant to be used as the interview exercise for Engineering roles in PBLWorks.

## Repo Overview

This is a Next.js project. It is using the App Router of Next.js v14. It is also using Prisma ORM along with a SQLite database that you can find at: `src/prisma/dev.db`. Finally, MUI is already setup and ready to use.

### Models

For the purposes of this exercise, we only have a very simple model: `Project`. This has an id, title, subhead and description.

### /projects

The first route is just a list of projects. It uses a server component to fetch all projects and list them in a table, sorted by id. There is also a button to create a new project via invoking a server action. This creates an empty project without a title, subhead or description, and redirects to the edit page.

### /projects/\[projectId\]

This route contains a form to edit a project. Again, it uses a server component to fetch the data. Storing the data is done by another server action.

## Setup instructions

**First of all, please fork this repo**

In order to run this app, you need to follow these steps

1. `pnpm install` to install all your dependencies
2. Create a `.env` file at the root of the project and add this line: `DATABASE_URL="file:./dev.db"`
3. `pnpm prisma migrate dev --schema src/prisma/schema.prisma` to install the prisma client and run any pending database migrations
4. `pnpm dev` to start the server
5. Visit `http://localhost:3000/projects` to get started

## Assignment

This assignment consists of two parts. The first is meant to allow you to showcase how you would structure your code, how you would break down components and how you would build a clean UI. The second is meant to show how you would approach solving a very hard problem and find creative solutions.

This assignment does not have a unique correct solution. Anyone could do things differently and still produce a really good outcome. It is meant as a starting point for the technical interview, to allow discussion over the choices you've made.

### Part 1: Build a custom header

We want you to build a header which will be rendered across both pages. Almost everything will be static data, unless noted otherwise. Here are the requirements:

1. On the left side, it should have the PBLWorks Design logo, which you will find in the `/public` folder. Clicking the logo should take you to '/projects'
2. On the right side, there should be an Avatar. Use your initials for the avatar
3. When clicking on the Avatar, a Menu should appear. All the links will be hardcode to navigate to '/'
   1. My Account
   2. Settings
   3. Avalytics
   4. Logout
4. In the center part of the header and only while editing a project, the project title should appear. This is the only non-static piece of data. Remove the title from the project page in this case.

What we are asking for this exercise is to see cleanly written code and components that are reusable and maintainable. We would also like to see how you would write tests for your UI components. Feel free to use any component that the MUI library offers.

### Part 2: Create an auto-save feature

For this part, we want you to remove entirely the "Save Project" button that exists in the edit project form. Instead, we want you to implement an auto-save feature. As the user types something in any field, it should automatically be saved to the database. It is up to you to architect this solution in any way you want.

Things to consider while working on this:

- What happens if a user types something while "save" is happening?
- What happens if a user quickly tabs between different fields and changes values almost at the same time in all of them?
- Is the rest of the UI (eg. the Project Title in the header) updated immediately?

Tests for these scenarios will also be appreciated. You can install any new packages that you may need.

## Tips

- Feel free to comment your code. It is very helpful to see your trail of thought. If you took some shortcuts to expendite this exercise, writing a comment about them will also help.
- Use small commits with helpful descriptions. This will make the evaluation of your code easier.
- We estimate that approximately 2 hours are needed for Part 1 and 5 hours for Part 2. We will not track your time and you are free to use as much time as you want for this exercise. But your time is precious and this exercise is just meant as a starting point for any discussions we will have during the interview. It doesn't need to be perfect. It just needs to showcase your talent and capabilities.
