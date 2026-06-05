import type { userBoard as userBoardType, Tasklist as tasklistType, inboxTask as inboxTaskType } from "@repo/shared";

// Mock Data

export const boards: userBoardType[] = [
  {
    id: "1",
    title: "Alpha",
    coverImage: '/cover.jpg',
    tag: "military",
    isTemplate: true,
    isPublic: true,
    creator: "me",
    created_at: "2026-04-25T10:00:00Z",
    updated_at: 'now'
  },
  {
    id: "2",
    title: "MK ultra",
    coverImage: '/cover2.jpg',
    tag: "TOP-SECRET",
    isTemplate: false,
    isPublic: false,
    creator: "illuminati",
    created_at: "2026-04-25T10:00:00Z",
    updated_at: 'now'
  }
];

// 8 Sample Tasklists (Distributed across Board 1 and Board 2)
export const taskLists: tasklistType[] = [
  // Board 1: Alpha
  { id: "tl-1", title: "Backlog", position: 1, description: "Incoming features and ideas", isArchieved: false, boardId: "1", createdAt: "2026-04-25T11:00:00Z", updatedAt: null },
  { id: "tl-2", title: "In Progress", position: 2, description: "Active operational tasks", isArchieved: false, boardId: "1", createdAt: "2026-04-25T11:05:00Z", updatedAt: null },
  { id: "tl-3", title: "Review", position: 3, description: "Awaiting final approval", isArchieved: false, boardId: "1", createdAt: "2026-04-25T11:10:00Z", updatedAt: null },
  { id: "tl-4", title: "Completed", position: 4, description: "Successfully deployed assets", isArchieved: false, boardId: "1", createdAt: "2026-04-25T11:15:00Z", updatedAt: null },
  
  // Board 2: MK ultra
  { id: "tl-5", title: "Research & Design", position: 1, description: "Classified telemetry and mental models", isArchieved: false, boardId: "2", createdAt: "2026-04-25T12:00:00Z", updatedAt: null },
  { id: "tl-6", title: "Field Testing", position: 2, description: "Active psychological experiments", isArchieved: false, boardId: "2", createdAt: "2026-04-25T12:05:00Z", updatedAt: null },
  { id: "tl-7", title: "Analysis", position: 3, description: "Processing experimental feedback loops", isArchieved: false, boardId: "2", createdAt: "2026-04-25T12:10:00Z", updatedAt: null },
  { id: "tl-8", title: "Archived Protocol", position: 4, description: "Decommissioned experiments", isArchieved: true, boardId: "2", createdAt: "2026-04-25T12:15:00Z", updatedAt: null }
];

// 52 Sample Tasks (Includes 7 'inbox' tasks and distributed tasks across tl-1 through tl-8)
export const tasks: inboxTaskType[] = [
  // --- 7 Inbox Tasks (No explicit boardId/taskListId or explicitly set to 'inbox') ---
  { id: "t-inbox-1", position: 1, title: "Review morning intel brief", taskListId: "inbox", boardId: "1", description: "Quick scan of tactical updates", isDone: false, createdAt: "2026-06-01T08:00:00Z" },
  { id: "t-inbox-2", position: 2, title: "Draft emergency response plan", taskListId: "inbox", boardId: "1", description: "Outline steps for unexpected downtime", isDone: false, createdAt: "2026-06-01T08:30:00Z" },
  { id: "t-inbox-3", position: 3, title: "Sync local encrypted databases", taskListId: "inbox", boardId: "2", description: "Ensure peer node replication is green", isDone: true, createdAt: "2026-06-01T09:00:00Z" },
  { id: "t-inbox-4", position: 4, title: "Schedule debrief with Commander", taskListId: "inbox", boardId: "1", description: "Align on Q2 deliverables", isDone: false, createdAt: "2026-06-02T10:00:00Z" },
  { id: "t-inbox-5", position: 5, title: "Audit security key rotation", taskListId: "inbox", boardId: "2", description: "Check if secret keys expired", isDone: false, createdAt: "2026-06-02T11:15:00Z" },
  { id: "t-inbox-6", position: 6, title: "Clean up local build cache", taskListId: "inbox", boardId: "1", description: "Free up disk space for incoming payloads", isDone: true, createdAt: "2026-06-03T14:20:00Z" },
  { id: "t-inbox-7", position: 7, title: "Verify signal frequencies", taskListId: "inbox", boardId: "2", description: "Check channels for interference", isDone: false, createdAt: "2026-06-04T07:45:00Z" },

  // --- Board 1: Alpha Tasks ---
  // List: tl-1 (Backlog)
  { id: "t-1", position: 1, title: "Refactor communication protocols", taskListId: "tl-1", boardId: "1", description: "Upgrade to TLS 1.4 equivalent mocks", isDone: false, createdAt: "2026-05-01T09:00:00Z" },
  { id: "t-2", position: 2, title: "Design map overlay UI", taskListId: "tl-1", boardId: "1", description: "Render multi-layered vector terrain maps", isDone: false, createdAt: "2026-05-01T09:30:00Z" },
  { id: "t-3", position: 3, title: "Incorporate weather telemetry data", taskListId: "tl-1", boardId: "1", description: "Hook up real-time environmental APIs", isDone: false, createdAt: "2026-05-01T10:00:00Z" },
  { id: "t-4", position: 4, title: "Setup automated backup triggers", taskListId: "tl-1", boardId: "1", description: "Nightly cron for saving application state", isDone: false, createdAt: "2026-05-02T11:00:00Z" },
  { id: "t-5", position: 5, title: "Investigate drop-rate anomalies", taskListId: "tl-1", boardId: "1", description: "Some mock data reports missing packages", isDone: true, createdAt: "2026-05-02T14:00:00Z" },
  { id: "t-6", position: 6, title: "Optimize map canvas rendering", taskListId: "tl-1", boardId: "1", description: "Keep it smooth at 60 FPS under high loads", isDone: false, createdAt: "2026-05-03T12:00:00Z" },

  // List: tl-2 (In Progress)
  { id: "t-7", position: 1, title: "Calibrate GPS simulation matrix", taskListId: "tl-2", boardId: "1", description: "Adjust standard lat/long deviation markers", isDone: false, createdAt: "2026-05-04T09:00:00Z" },
  { id: "t-8", position: 2, title: "Deploy secure firewall walls", taskListId: "tl-2", boardId: "1", description: "Prevent cross-origin data contamination", isDone: false, createdAt: "2026-05-04T10:15:00Z" },
  { id: "t-9", position: 3, title: "Refine user roles & permissions", taskListId: "tl-2", boardId: "1", description: "Differentiate squad leaders from standard operatives", isDone: false, createdAt: "2026-05-05T13:00:00Z" },
  { id: "t-10", position: 4, title: "Establish radio link mockup", taskListId: "tl-2", boardId: "1", description: "Create mock WebSocket channels for live chatting", isDone: false, createdAt: "2026-05-05T15:45:00Z" },
  { id: "t-11", position: 5, title: "Implement dark mode styling", taskListId: "tl-2", boardId: "1", description: "Tactical night vision theme execution", isDone: false, createdAt: "2026-05-06T16:20:00Z" },

  // List: tl-3 (Review)
  { id: "t-12", position: 1, title: "Integrate biometric authentication logic", taskListId: "tl-3", boardId: "1", description: "Awaiting PR approval on simulated facial scan", isDone: false, createdAt: "2026-05-07T08:00:00Z" },
  { id: "t-13", position: 2, title: "Update README with architectural diagrams", taskListId: "tl-3", boardId: "1", description: "Documentation ready for team review", isDone: false, createdAt: "2026-05-07T11:00:00Z" },
  { id: "t-14", position: 3, title: "Validate end-to-end data pipelines", taskListId: "tl-3", boardId: "1", description: "Ensure mock data successfully cascades on delete", isDone: false, createdAt: "2026-05-08T10:30:00Z" },
  { id: "t-15", position: 4, title: "Test memory leak thresholds", taskListId: "tl-3", boardId: "1", description: "Profiles look steady; pending senior engineer sign-off", isDone: false, createdAt: "2026-05-08T14:00:00Z" },

  // List: tl-4 (Completed)
  { id: "t-16", position: 1, title: "Setup basic boilerplate repo", taskListId: "tl-4", boardId: "1", description: "Initial Vite + React + TS setup complete", isDone: true, createdAt: "2026-04-26T09:00:00Z" },
  { id: "t-17", position: 2, title: "Configure Tailwind CSS setup", taskListId: "tl-4", boardId: "1", description: "Global design tokens and theme extensions mapped", isDone: true, createdAt: "2026-04-26T11:00:00Z" },
  { id: "t-18", position: 3, title: "Build core board state management", taskListId: "tl-4", boardId: "1", description: "Zustand slices initialized and functional", isDone: true, createdAt: "2026-04-27T15:00:00Z" },
  { id: "t-19", position: 4, title: "Design database schemas", taskListId: "tl-4", boardId: "1", description: "SQL tables drawn out and verified", isDone: true, createdAt: "2026-04-28T10:00:00Z" },
  { id: "t-20", position: 5, title: "Mock board structure setup", taskListId: "tl-4", boardId: "1", description: "Pre-loaded data for Alpha and MK Ultra", isDone: true, createdAt: "2026-04-29T11:30:00Z" },


  // --- Board 2: MK ultra Tasks ---
  // List: tl-5 (Research & Design)
  { id: "t-21", position: 1, title: "Brainwave frequencies telemetry mapping", taskListId: "tl-5", boardId: "2", description: "Isolate Alpha and Theta bands mapping profiles", isDone: false, createdAt: "2026-05-10T09:00:00Z" },
  { id: "t-22", position: 2, title: "Subliminal frame insertion research", taskListId: "tl-5", boardId: "2", description: "Determine visual retention rate at 1ms flash interval", isDone: false, createdAt: "2026-05-10T10:30:00Z" },
  { id: "t-23", position: 3, title: "Acoustic harassment phase modeling", taskListId: "tl-5", boardId: "2", description: "Vectoring directional ultra-low frequencies", isDone: false, createdAt: "2026-05-11T14:00:00Z" },
  { id: "t-24", position: 4, title: "Isolate cognitive trigger terms", taskListId: "tl-5", boardId: "2", description: "Compile linguistic nodes for behavioral switches", isDone: false, createdAt: "2026-05-12T11:00:00Z" },
  { id: "t-25", position: 5, title: "Draft neural network behavior model", taskListId: "tl-5", boardId: "2", description: "Algorithmic mirror vectors of test patterns", isDone: false, createdAt: "2026-05-12T16:00:00Z" },
  { id: "t-26", position: 6, title: "Analyze chemical compounding logs", taskListId: "tl-5", boardId: "2", description: "Cross-reference serum formula batch B-12", isDone: true, createdAt: "2026-05-13T09:15:00Z" },

  // List: tl-6 (Field Testing)
  { id: "t-27", position: 1, title: "Monitor subject delta-9 sleep patterns", taskListId: "tl-6", boardId: "2", description: "Log anomalies during deep REM suppression phases", isDone: false, createdAt: "2026-05-14T23:00:00Z" },
  { id: "t-28", position: 2, title: "Execute isolation chamber telemetry run", taskListId: "tl-6", boardId: "2", description: "72-hour sensory deprivation array updates", isDone: false, createdAt: "2026-05-15T08:00:00Z" },
  { id: "t-29", position: 3, title: "Deploy auditory loop phase 3", taskListId: "tl-6", boardId: "2", description: "Continuous audio tracking over encrypted headsets", isDone: false, createdAt: "2026-05-15T12:00:00Z" },
  { id: "t-30", position: 4, title: "Track pulse rate correlation metrics", taskListId: "tl-6", boardId: "2", description: "Correlate sudden spikes with electromagnetic pulses", isDone: false, createdAt: "2026-05-16T10:00:00Z" },
  { id: "t-31", position: 5, title: "Calibrate observation deck cameras", taskListId: "tl-6", boardId: "2", description: "Low-light night vision configuration tweaks", isDone: true, createdAt: "2026-05-16T14:30:00Z" },
  { id: "t-32", position: 6, title: "Log linguistic response slips", taskListId: "tl-6", boardId: "2", description: "Record verbal slips during high stress mocks", isDone: false, createdAt: "2026-05-17T11:00:00Z" },

  // List: tl-7 (Analysis)
  { id: "t-33", position: 1, title: "Process memory erasure error metrics", taskListId: "tl-7", boardId: "2", description: "Calculate spillover retention percentages", isDone: false, createdAt: "2026-05-18T09:00:00Z" },
  { id: "t-34", position: 2, title: "Compile mass hypnosis variance reports", taskListId: "tl-7", boardId: "2", description: "Evaluate cohort responsiveness indices", isDone: false, createdAt: "2026-05-18T15:00:00Z" },
  { id: "t-35", position: 3, title: "Perform behavioral convergence metrics", taskListId: "tl-7", boardId: "2", description: "Are responses merging into the anticipated baseline?", isDone: false, createdAt: "2026-05-19T10:30:00Z" },
  { id: "t-36", position: 4, title: "Correlate micro-expression snapshots", taskListId: "tl-7", boardId: "2", description: "Run automated facial telemetry evaluations", isDone: false, createdAt: "2026-05-19T14:00:00Z" },
  { id: "t-37", position: 5, title: "Audit raw field telemetry streams", taskListId: "tl-7", boardId: "2", description: "Check for corrupt files or extraneous artifact inputs", isDone: true, createdAt: "2026-05-20T11:45:00Z" },

  // List: tl-8 (Archived Protocol)
  { id: "t-38", position: 1, title: "Project 'Monarch' phase 1 summary", taskListId: "tl-8", boardId: "2", description: "Consolidated documentation package securely stored", isDone: true, createdAt: "2026-04-30T09:00:00Z" },
  { id: "t-39", position: 2, title: "Decommission transmitter array G-5", taskListId: "tl-8", boardId: "2", description: "Physical array dismantled; logging final status", isDone: true, createdAt: "2026-05-01T12:00:00Z" },
  { id: "t-40", position: 3, title: "Scrub subject identity backups", taskListId: "tl-8", boardId: "2", description: "Zeroed out secondary operational databases", isDone: true, createdAt: "2026-05-02T16:30:00Z" },
  { id: "t-41", position: 4, title: "Purge historical audio matrices", taskListId: "tl-8", boardId: "2", description: "Magnetic logs safely degaussed", isDone: true, createdAt: "2026-05-03T10:00:00Z" },
  { id: "t-42", position: 5, title: "Final report on spatial anomalies", taskListId: "tl-8", boardId: "2", description: "Marked inconclusive and filed under cold files", isDone: true, createdAt: "2026-05-04T15:15:00Z" },
  { id: "t-43", position: 6, title: "Deauthorize legacy operative accounts", taskListId: "tl-8", boardId: "2", description: "Revoked cryptographic access tokens globally", isDone: true, createdAt: "2026-05-05T09:00:00Z" },
  { id: "t-44", position: 7, title: "Seal underground storage sector 4", taskListId: "tl-8", boardId: "2", description: "Physical security containment absolute", isDone: true, createdAt: "2026-05-06T14:00:00Z" },
  { id: "t-45", position: 8, title: "Reallocate budget residual balances", taskListId: "tl-8", boardId: "2", description: "Sent remaining capital into dark pool operations", isDone: true, createdAt: "2026-05-07T11:20:00Z" }
];