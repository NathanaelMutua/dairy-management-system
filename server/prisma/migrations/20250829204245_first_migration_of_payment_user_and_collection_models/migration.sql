-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('FARMER', 'CLERK', 'ADMIN', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "public"."PaymentType" AS ENUM ('FARMER_PAYOUT', 'REGISTRATION_FEE', 'SERVICE_FEE');

-- CreateEnum
CREATE TYPE "public"."PaymentDirection" AS ENUM ('INCOMING', 'OUTGOING');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL,
    "national_id" INTEGER NOT NULL,
    "registration_status" BOOLEAN NOT NULL DEFAULT false,
    "date_joined" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated" TIMESTAMP(3) NOT NULL,
    "deleted_status" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."collections" (
    "id" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "clerkId" TEXT,
    "amount_in_litres" DECIMAL(15,2) NOT NULL,
    "time_entered" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_status" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "method" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "reference" TEXT,
    "type" "public"."PaymentType" NOT NULL,
    "direction" "public"."PaymentDirection" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_status" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_national_id_key" ON "public"."users"("national_id");

-- AddForeignKey
ALTER TABLE "public"."collections" ADD CONSTRAINT "collections_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."collections" ADD CONSTRAINT "collections_clerkId_fkey" FOREIGN KEY ("clerkId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
