export interface IPermission {
  _id?: string;
  module: string;
  feature: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  import: boolean;
  export: boolean;
}
