-- CreateTable
CREATE TABLE "pending_reimbursement" (
    "id" TEXT NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pending_reimbursement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pending_reimbursement_created_at_idx" ON "pending_reimbursement"("created_at");
