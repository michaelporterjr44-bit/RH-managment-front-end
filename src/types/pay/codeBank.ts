// types/pay/codeBank.ts
export interface CodeBank {
  id: string;
  codeBank: string;
  bankName: string;
}

// DTO pour la création (sans id)
export type CreateCodeBankDto = Omit<CodeBank, "id">;
