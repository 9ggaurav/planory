# TaskIssueFix: Can't add a task to the inbox task list

## Problem
Adding a task to the Inbox board silently failed:

- `addNewTask.tsx` called the async `addNewTask(e)` without `await` and closed the
  form immediately, so request failures were swallowed (no feedback, form just vanished).
- `InboxProvider` replaced all local `'inbox'`-tagged tasks with its server snapshot,
  so a task created right before the snapshot fetch resolved was silently dropped.

## Fix
- `apps/web/src/features/task/components/addNewTask.tsx`
  - `onSubmit` now `await`s the add handler, only closes the form on success,
    and logs errors to the console instead of swallowing them.
- `apps/web/src/providers/inboxContext.tsx`
  - The inbox snapshot is now merged by task id, preserving any local inbox task
    that is not yet returned by the server (e.g. one just created).

Branch: `fix/inbox-add-task` (commit `79470b0`) - not merged into `main`.