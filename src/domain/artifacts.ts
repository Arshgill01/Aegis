import type { EntityId, EntityReference, IsoTimestamp } from "./shared";
import type { WorkerId } from "./workers";

export const artifactTypes = [
  "invoice-document",
  "purchase-order-document",
  "receipt-document",
  "supporting-document",
  "erp-export",
  "policy-note",
  "risk-memo",
  "execution-receipt",
] as const;

export type ArtifactType = (typeof artifactTypes)[number];

export const artifactOrigins = ["uploaded", "generated", "system"] as const;

export type ArtifactOrigin = (typeof artifactOrigins)[number];

export interface Artifact {
  id: EntityId;
  type: ArtifactType;
  title: string;
  summary: string;
  origin: ArtifactOrigin;
  createdAt: IsoTimestamp;
  createdByWorkerId?: WorkerId;
  mimeType?: string;
  uri?: string;
  sourceLabel?: string;
  checksum?: string;
  relatedEntities?: EntityReference[];
  tags?: string[];
}
