import CustomerModel from "../models/customer.model";
import CustomerBeatModel from "../models/customerBeat.model";
import {
  ICreateCustomerBeatRequestBody,
  ICustomerBeat,
} from "@repo/ui/dist/types/customerBeat";

// Create a new Customer Beat
export const createCustomerBeat = async (
  data: ICreateCustomerBeatRequestBody,
): Promise<ICustomerBeat> => {
  const customerBeat = new CustomerBeatModel(data);
  await customerBeat.save();
  return customerBeat;
};

// Get all Customer Beats
export const getAllCustomerBeats = async () => {
  return CustomerBeatModel.find();
};

// Get a Customer Beat by ID
export const getCustomerBeatById = async (
  id: string,
): Promise<ICustomerBeat | null> => {
  return CustomerBeatModel.findById(id);
};

// Update an existing Customer Beat
export const updateCustomerBeat = async (
  id: string,
  data: Partial<ICustomerBeat>,
): Promise<ICustomerBeat | null> => {
  return CustomerBeatModel.findByIdAndUpdate(id, data, { new: true });
};
