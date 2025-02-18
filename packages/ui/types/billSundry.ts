export interface IBillSundry {
  id?: string;
  name: string;
  code: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IBusyBillSundryImportResponse {
  Name: string;
  Code: string;
}
