export interface IItemGroup {
  id?: string;
  name: string;
  code: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IBusyItemGroupImportResponse {
  Name: string;
  Code: string;
}
