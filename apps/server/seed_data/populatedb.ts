import mongoose from "mongoose";
import config from "../src/config";
import permissionsData from "./permissions";
import PermissionModel from "../src/models/permission.model";
import configurationsData from "./configuration";
import ConfigurationModel from "../src/models/configuration.model";

console.log(
  "This script populates some test products, users to our database. Specified database as argument - e.g.: populatedb " +
    config.database.url,
);

const features = {
  permissions: {
    enabled: true,
  },
  configurations: {
    enabled: true,
  },
};

// --------------------------------------
// PERMISSIONS
// --------------------------------------
let permissions: Array<any> = [];
const insertPermissions = async () => {
  await PermissionModel.deleteMany({});
  for await (const data of permissionsData) {
    permissions.push(new PermissionModel(data));
  }
  await PermissionModel.insertMany(permissions);
  console.log("Permissions inserted in db.");
  return true;
};

// --------------------------------------
// CONFIGURATIONS
// --------------------------------------
let configurations: Array<any> = [];
const insertConfigurations = async () => {
  await ConfigurationModel.deleteMany({});
  for await (const data of configurationsData) {
    configurations.push(new ConfigurationModel(data));
  }
  await ConfigurationModel.insertMany(configurations);
  console.log("Configurations inserted in db.");
  return true;
};

// --------------------------------------
// POPULATE DATA
// --------------------------------------
const populateData = async () => {
  // Sync permissions
  if (features.permissions.enabled) {
    await insertPermissions();
  }
  if (features.configurations.enabled) {
    await insertConfigurations();
  }

  return "Success Populating (results dumped from logging)";
};

mongoose
  .connect(config.database.url)
  .then(() => {
    populateData()
      .then((res) => {
        console.log(res);
        mongoose.connection.close();
      })
      .catch(console.error);
  })
  .catch(console.error);
