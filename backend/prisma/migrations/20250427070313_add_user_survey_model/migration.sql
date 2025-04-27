-- CreateTable
CREATE TABLE "UserSurvey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "recyclingExperience" TEXT NOT NULL,
    "recyclingGoals" TEXT NOT NULL,
    "homeType" TEXT,
    "homeTemperature" TEXT,
    "stoveType" TEXT,
    "hasVehicle" BOOLEAN,
    "vehicleType" TEXT,
    "vehicleMake" TEXT,
    "vehicleModel" TEXT,
    "packageFrequency" TEXT,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserSurvey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSurvey_userId_key" ON "UserSurvey"("userId");

-- CreateIndex
CREATE INDEX "UserSurvey_userId_idx" ON "UserSurvey"("userId");
