// Mirrors the Postgres schema exactly. If a column changes, update it here first —
// both apps/web and apps/api consume these types, so drift is caught at compile time.

export type UserRole = "homeowner" | "epc_installer" | "admin";

export type DocumentStatus =
  | "uploaded"
  | "processing"
  | "review_required"
  | "completed"
  | "failed";

export type ComplianceStatus = "approved" | "not_approved" | "unverified";

export interface User {
  id: string; // UUID, FK -> auth.users.id
  email: string;
  role: UserRole;
  credit_balance: number;
  created_at: string;
  updated_at: string;
}

export interface ApprovedHardware {
  id: string;
  brand: string;
  model_number: string;
  kw_capacity: number;
  anti_islanding_certified: boolean;
}

export interface ComplianceDocument {
  id: string;
  user_id: string;
  raw_file_path: string;
  generated_pdf_path: string | null;
  extracted_brand: string | null;
  extracted_model: string | null;
  extracted_capacity: number | null;
  extracted_panel_wattage: number | null;
  status: DocumentStatus;
  validation_confidence: number | null;
  matched_hardware_id: string | null;
  hardware_compliance: ComplianceStatus | null;
  expires_at: string;
  created_at: string;
}

export interface PaymentTransaction {
  id: string;
  user_id: string;
  gateway_reference: string;
  amount_paid: number;
  credits_added: number;
  created_at: string;
}

// Generic Supabase typing (Database["public"]["Tables"]["users"]["Row"], etc.)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Partial<User> & Pick<User, "id" | "email">;
        Update: Partial<User>;
      };
      approved_hardware: {
        Row: ApprovedHardware;
        Insert: Partial<ApprovedHardware> & Pick<ApprovedHardware, "brand" | "model_number">;
        Update: Partial<ApprovedHardware>;
      };
      compliance_documents: {
        Row: ComplianceDocument;
        Insert: Partial<ComplianceDocument> &
          Pick<ComplianceDocument, "user_id" | "raw_file_path">;
        Update: Partial<ComplianceDocument>;
      };
      payment_transactions: {
        Row: PaymentTransaction;
        Insert: Partial<PaymentTransaction> &
          Pick<PaymentTransaction, "user_id" | "gateway_reference" | "amount_paid" | "credits_added">;
        Update: Partial<PaymentTransaction>;
      };
    };
  };
}

// API-facing DTOs (safe subset — never leak service-role-only fields to the client)
export interface AuthenticatedUserDTO {
  id: string;
  email: string;
  role: UserRole;
  creditBalance: number;
}
