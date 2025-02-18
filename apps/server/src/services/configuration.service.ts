import { ProjectionType, QueryOptions, RootFilterQuery } from "mongoose";
import ConfigurationModel from "../models/configuration.model";
import { IConfiguration } from "@repo/ui/dist/types/configuration";
import { ConfigurationKey } from "@repo/ui/dist/enums/configuration";

export const getConfigurations = async (
  filter: RootFilterQuery<IConfiguration>,
  projection?: ProjectionType<IConfiguration> | null | undefined,
  options?: QueryOptions<IConfiguration> | null | undefined,
) => {
  return ConfigurationModel.find(filter, projection, options);
};

export const getConfigurationByKey = async (key: ConfigurationKey) => {
  return ConfigurationModel.findOne({ key });
};

export const getConfigurationByKeys = async (keys: ConfigurationKey[]) => {
  return ConfigurationModel.find({ key: { $in: keys } });
};

// export const createConfiguration = async (data: IConfiguration) => {
//   return ConfigurationModel.create(data);
// };

// export const updateConfiguration = async (
//   key: string,
//   data: IConfiguration,
// ) => {
//   return ConfigurationModel.findOneAndUpdate({ key }, data, { new: true });
// };

// export const deleteConfiguration = async (key: string) => {
//   return ConfigurationModel.deleteOne({ key });
// };
