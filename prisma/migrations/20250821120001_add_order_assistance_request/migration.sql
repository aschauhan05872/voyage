-- CreateTable
CREATE TABLE "OrderAssistanceRequest" (
    "id" TEXT NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "primaryPhone" TEXT NOT NULL,
    "secondaryPhone" TEXT,
    "shippingAddress" JSONB NOT NULL,
    "billingAddress" JSONB NOT NULL,
    "items" JSONB NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PAYMENT_ASSISTANCE_REQUIRED',
    "checkoutSessionId" TEXT,
    "idempotencyKey" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmContent" TEXT,
    "utmTerm" TEXT,
    "referrer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderAssistanceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderAssistanceRequest_requestNumber_key" ON "OrderAssistanceRequest"("requestNumber");

-- CreateIndex
CREATE UNIQUE INDEX "OrderAssistanceRequest_idempotencyKey_key" ON "OrderAssistanceRequest"("idempotencyKey");

-- CreateIndex
CREATE INDEX "OrderAssistanceRequest_requestNumber_idx" ON "OrderAssistanceRequest"("requestNumber");

-- CreateIndex
CREATE INDEX "OrderAssistanceRequest_email_idx" ON "OrderAssistanceRequest"("email");

-- CreateIndex
CREATE INDEX "OrderAssistanceRequest_status_idx" ON "OrderAssistanceRequest"("status");

-- CreateIndex
CREATE INDEX "OrderAssistanceRequest_createdAt_idx" ON "OrderAssistanceRequest"("createdAt");

