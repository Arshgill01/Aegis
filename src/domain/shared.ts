export type EntityId = string;

export type IsoTimestamp = string;

export type CurrencyCode = string;

export type CountryCode = string;

export type MetadataValue = boolean | number | string | null;

export type Metadata = Record<string, MetadataValue>;

export interface MoneyAmount {
  amount: number;
  currency: CurrencyCode;
  display: string;
}

export interface EntityReference {
  entityId: EntityId;
  entityType: string;
  label?: string;
}
