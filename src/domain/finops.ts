import type { RiskLevel } from "./policy";
import type { CountryCode, EntityId, IsoTimestamp, MoneyAmount } from "./shared";
import type { WorkerId } from "./workers";

export const vendorStatuses = ["trusted", "review-required", "blocked", "suspended"] as const;

export type VendorStatus = (typeof vendorStatuses)[number];

export const invoiceStatuses = [
  "received",
  "normalized",
  "matched",
  "exception",
  "approved",
  "ready-for-payment",
  "paid",
] as const;

export type InvoiceStatus = (typeof invoiceStatuses)[number];

export const purchaseOrderStatuses = [
  "open",
  "partially-matched",
  "matched",
  "exception",
  "closed",
] as const;

export type PurchaseOrderStatus = (typeof purchaseOrderStatuses)[number];

export const paymentIntentStatuses = [
  "draft",
  "pending-review",
  "approved",
  "blocked",
  "scheduled",
  "executed",
  "cancelled",
] as const;

export type PaymentIntentStatus = (typeof paymentIntentStatuses)[number];

export const exceptionCaseTypes = [
  "invoice-po-mismatch",
  "vendor-bank-change",
  "missing-supporting-documentation",
  "unknown-vendor",
  "duplicate-invoice",
] as const;

export type ExceptionCaseType = (typeof exceptionCaseTypes)[number];

export const exceptionStatuses = ["open", "under-review", "resolved", "dismissed"] as const;

export type ExceptionStatus = (typeof exceptionStatuses)[number];

export interface Vendor {
  id: EntityId;
  legalName: string;
  displayName: string;
  countryCode: CountryCode;
  status: VendorStatus;
  paymentTermsLabel: string;
  bankAccountFingerprint?: string;
  trustedSince?: IsoTimestamp;
  artifactIds?: EntityId[];
}

export interface Invoice {
  id: EntityId;
  invoiceNumber: string;
  vendorId: EntityId;
  purchaseOrderId?: EntityId;
  amount: MoneyAmount;
  status: InvoiceStatus;
  issuedAt: IsoTimestamp;
  receivedAt: IsoTimestamp;
  dueAt?: IsoTimestamp;
  artifactId: EntityId;
  lineItemCount?: number;
  summary: string;
}

export interface PurchaseOrder {
  id: EntityId;
  poNumber: string;
  vendorId: EntityId;
  total: MoneyAmount;
  status: PurchaseOrderStatus;
  createdAt: IsoTimestamp;
  approvedAt?: IsoTimestamp;
  artifactId?: EntityId;
  summary: string;
}

export interface PaymentIntent {
  id: EntityId;
  invoiceId: EntityId;
  vendorId: EntityId;
  purchaseOrderId?: EntityId;
  amount: MoneyAmount;
  status: PaymentIntentStatus;
  requestedAt: IsoTimestamp;
  scheduledFor?: IsoTimestamp;
  destinationSummary: string;
  blockedReason?: string;
  artifactIds?: EntityId[];
}

export interface ExceptionCase {
  id: EntityId;
  type: ExceptionCaseType;
  status: ExceptionStatus;
  severity: RiskLevel;
  title: string;
  summary: string;
  detectedAt: IsoTimestamp;
  ownerWorkerId?: WorkerId;
  runId?: EntityId;
  relatedArtifactIds?: EntityId[];
  affectedEntityIds?: EntityId[];
  recommendedAction: string;
}
