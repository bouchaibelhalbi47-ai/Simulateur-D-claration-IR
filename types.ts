export enum Language {
  FR = 'fr',
  AR = 'ar',
}

export enum DeclarationStatus {
  DRAFT = 'Brouillon',
  VALIDATED = 'Validé',
  PAID = 'Payé',
}

export enum PaymentType {
  INITIAL = 'Initial',
  CORRECTIVE = 'Correctif',
}

export interface Declaration {
  id: string;
  year: number;
  month: number;
  paymentType: PaymentType;
  status: DeclarationStatus;
  totalRemuneration: number;
  withholdings: number;
  alreadyPaid: number;
  penaltyPercentage: number;
  lateFee: number;
  principalAmount: number;
  penaltyAmount: number;
  totalAmount: number;
}