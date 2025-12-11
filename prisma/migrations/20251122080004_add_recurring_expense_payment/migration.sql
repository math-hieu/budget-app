-- CreateTable
CREATE TABLE "recurring_expense_payment" (
    "id" TEXT NOT NULL,
    "recurring_expense_id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recurring_expense_payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recurring_expense_payment_month_year_idx" ON "recurring_expense_payment"("month", "year");

-- CreateIndex
CREATE INDEX "recurring_expense_payment_is_paid_idx" ON "recurring_expense_payment"("is_paid");

-- CreateIndex
CREATE UNIQUE INDEX "recurring_expense_payment_recurring_expense_id_month_year_key" ON "recurring_expense_payment"("recurring_expense_id", "month", "year");

-- AddForeignKey
ALTER TABLE "recurring_expense_payment" ADD CONSTRAINT "recurring_expense_payment_recurring_expense_id_fkey" FOREIGN KEY ("recurring_expense_id") REFERENCES "recurring_expense"("id") ON DELETE CASCADE ON UPDATE CASCADE;
