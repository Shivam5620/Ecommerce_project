import { ConfigurationType } from "../enums/configuration";

export interface IConfiguration {
  _id?: string;
  key: string;
  type: ConfigurationType;
  value: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}
