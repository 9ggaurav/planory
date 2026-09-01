import { prisma } from "./prisma";

/** Auto-created by the old get-or-create inbox-board endpoint. */
export function isLegacyInboxBoard(board: {
  title: string;
  tag: string[];
}): boolean {
  return board.title === "Inbox" && board.tag.includes("inbox");
}

export function legacyInboxBoardWhere(userId: number) {
  return {
    creatorId: userId,
    title: "Inbox",
    tag: { has: "inbox" },
  };
}

/**
 * Move tasks off leftover "Inbox" boards onto the user (taskListId = null),
 * then delete those boards so they never appear in the workspace.
 */
export async function migrateLegacyInboxBoards(userId: number): Promise<void> {
  const boards = await prisma.board.findMany({
    where: legacyInboxBoardWhere(userId),
    select: { id: true },
  });

  if (boards.length === 0) return;

  const boardIds = boards.map((board) => board.id);

  await prisma.$transaction(async (tx) => {
    const lists = await tx.taskList.findMany({
      where: { boardId: { in: boardIds } },
      select: { id: true },
    });
    const listIds = lists.map((list) => list.id);

    const lastInbox = await tx.task.findFirst({
      where: { userId, taskListId: null },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    let cursor = lastInbox?.position ?? 0;

    if (listIds.length > 0) {
      const leftoverTasks = await tx.task.findMany({
        where: { taskListId: { in: listIds } },
        orderBy: { position: "asc" },
        select: { id: true },
      });

      for (const task of leftoverTasks) {
        cursor += 1000;
        await tx.task.update({
          where: { id: task.id },
          data: {
            taskListId: null,
            userId,
            position: cursor,
          },
        });
      }
    }

    await tx.board.deleteMany({
      where: { id: { in: boardIds } },
    });
  });
}
