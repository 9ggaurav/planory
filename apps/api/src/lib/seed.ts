import { prisma } from "./prisma";

const users: string[] = ["Alice", "Bob", "Charlie", "dan"];

const boards: string[] = [
  "Web Development",
  "Artificial Intelligence",
  "Web 3",
  "Machine Learning",
];

const lists: string[] = [
  "Frontend development",
  "Backend development",
  "Mobile development",
  "A* algorithm",
  "Backtracking",
  "Logic",
  "computer vision",
  "Cryptocurrency",
  "Encryption",
  "Solana",
  "Regression",
  "Clustering",
  "SVM",
  "Classification",
];

const tasks: string[] = [
  "Build responsive navbar",
  "Create dashboard UI",
  "Design REST API",
  "Implement authentication",
  "Create login screen",
  "Integrate API",
  "Implement A* pathfinding",
  "Solve N-Queens",
  "Build Sudoku solver",
  "Practice truth tables",
  "Image preprocessing",
  "Object detection",
  "Research Bitcoin",
  "Study blockchain",
  "Implement AES",
  "Implement RSA",
  "Create Solana wallet",
  "Deploy Solana contract",
  "Train regression model",
  "Perform clustering",
  "Train SVM classifier",
  "Evaluate classification model",
];

async function main() {
  await prisma.task.deleteMany({});
  await prisma.taskList.deleteMany({});
  await prisma.board.deleteMany({});
  await prisma.user.deleteMany({});

  for (const name of users) {
    await prisma.user.create({
      data: {
        email: `${name}@email.com`,
        name,
        avatar:
          "https://imgs.search.brave.com/d4DRfwkA5hIf6QHx1BnSJiqCQPiPeIuu9gG_RhejD8E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aGFsbG9mc2VyaWVz/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyNC8xMC9TY3Jl/ZW5zaG90LTIwMjQt/MTAtMTAtMTY1MDUy/LnBuZw",
        hashedPassword: "123456",
      },
    });
  }
  const u = await prisma.user.findMany();

  for (const title of boards) {
    await prisma.board.create({
      data: {
        coverImage:
          "https://imgs.search.brave.com/d4DRfwkA5hIf6QHx1BnSJiqCQPiPeIuu9gG_RhejD8E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aGFsbG9mc2VyaWVz/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyNC8xMC9TY3Jl/ZW5zaG90LTIwMjQt/MTAtMTAtMTY1MDUy/LnBuZw",
        title,
        tag: ["seed"],
        isPublic: false,
        isTemplate: false,
        creatorId: u[Math.floor(Math.random() * u.length)]!.id,
      },
    });
  }
  const b = await prisma.board.findMany();

  for (const item of lists) {
    await prisma.taskList.create({
      data: {
        title: item,
        position: 4,
        description: `${item}-description`,
        isArchived: false,
        boardId: b[Math.floor(Math.random() * b.length)]!.id,
      },
    });
  }
  const l = await prisma.taskList.findMany();

  for (const title of tasks) {
    await prisma.task.create({
      data: {
        title,
        description: `${title}-description`,
        position: 4,
        isDone: false,
        taskListId: l[Math.floor(Math.random() * l.length)]!.id,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
