-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "virtual_saving" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "virtual_saving_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recurring_expense" (
    "id" TEXT NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recurring_expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pending_payment" (
    "id" TEXT NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pending_payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "virtual_saving_created_at_idx" ON "virtual_saving"("created_at");

-- CreateIndex
CREATE INDEX "recurring_expense_created_at_idx" ON "recurring_expense"("created_at");

-- CreateIndex
CREATE INDEX "pending_payment_is_paid_idx" ON "pending_payment"("is_paid");

-- CreateIndex
CREATE INDEX "pending_payment_created_at_idx" ON "pending_payment"("created_at");
