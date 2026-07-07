-- CreateTable
CREATE TABLE "Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "guestName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "partySize" INTEGER NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "source" TEXT NOT NULL DEFAULT 'Website',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
