## Solution

The goal of the solution is to tackle exactly the problems mentioned while keeping the minimum overhead in terms of dependencies. This means using the built-in tools for fetching and mutations, like RSC and server actions respectively.
Try running `pnpm install --force` if you face issues with prisma migrations.

### Part 1

Leveraged parallel routing to conditionally render a title to the layout when on the `/projects/[projectId]` route.
Had to apply some hacks due to the soft navigation persisting existing slots, even if they don't match the current URL. [source](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes#behavior)
This means going from `/projects/[projectId]` to `/projects` or `/` didn't work as expected without providing the catch-all segment and explicit page for the root.

### Part 2

> Is the rest of the UI (eg. the Project Title in the header) updated immediately?

The UI (header title) updates when the project gets saved. Save fires on blur/submit/unmount. This decision was purely based on what I consider the best UX, not as a way to limit unnecessary requests.

> What happens if a user types something while "save" is happening?

> What happens if a user quickly tabs between different fields and changes values almost at the same time in all of them?

These are effectively the same problem.
The problem is that multiple requests will be fired to the backend, and might get processed in reverse order of their trigger timing. A debounce solution is nice-to-have (didn't consider worth implementing given the saving strategy) but doesn't solve the problem. Same with aborting/ignoring previous requests (implemented in the `useAutosave` hook).
We need to ensure that the last one (from the client's perspective) wins. For that reason I introduced `lasUpdated` in the Project entity, so that I only update it if the existing `lasUpdated` is less than the incoming.

Interesting fact: Server actions are processed in order. The client currently dispatches and awaits them one at a time. This could be a potential solution to our race condition problem although it's an implementation detail that might change in the future. [source](https://nextjs.org/docs/app/getting-started/updating-data#invoking-server-functions)

### Issues

- Very quick navigation from `/projects/[projectId]` to `/projects` while the update action is pending might show stale data until the action finishes. SWR or tanstack query would make this trivial (easy optimistic updates + rollbacks). Still thinking how I would be happy doing it with RSC and the built-in primitives.
- Going from field editing (before committing) to closing the tab loses the state completely. Didn't handle it in the context of the assignment.

### Potential improvements

- Suspense on the page level to show some fallback skeleton for the list and the form view while fetching.
- Table pagination
- Add project title in the URL for better UX (eg `projects/{title}-{id}`), in which case we should prevent empty titles.
- Ideally I would implement autosave only on edit mode. Create mode would have a save button. On create mode, in case of navigating away from a dirty form, I would show a confirmation dialog. Interesting [talk](https://youtu.be/nTr21kgCFF4?t=2897) on the topic.
