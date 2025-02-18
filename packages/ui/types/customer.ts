export interface ICustomer {
  code: string;
  name: string;
  alias: string;
  mobile_no: string;
  gst_no: string;
  gst_type: string;
  whatsapp_no: string;
  print_name: string;
  account_group: string;
  account_category: string;
  master_notes: string;
  hsn_code: string;
  state: string;
}

export interface IBusyCustomerImportResponse {
  Code: string;
  Name: string;
  Alias: string;
  Mobile: string;
  GSTNo: string;
  WhatsAppNo: string;
  PrintName: string;
  State: string;
  AccountGroup: string;
  AccountCategory: string;
  MasterNotes: string;
  HSNCode: string;
}
