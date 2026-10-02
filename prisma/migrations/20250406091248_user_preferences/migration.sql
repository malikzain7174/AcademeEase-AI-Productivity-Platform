-- CreateEnum
CREATE TYPE "GradeYear" AS ENUM ('FRESHMAN', 'SOPHOMORE', 'JUNIOR', 'SENIOR', 'GRADUATE');

-- CreateEnum
CREATE TYPE "AgeRange" AS ENUM ('UNDER_18', 'AGE_18_21', 'AGE_22_25', 'AGE_26_30', 'OVER_30');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ageRange" "AgeRange",
ADD COLUMN     "fieldOfStudy" TEXT,
ADD COLUMN     "gradeYear" "GradeYear",
ADD COLUMN     "learningStyle" "LearningStyle",
ADD COLUMN     "studyEnvironment" "StudyEnvironment";
