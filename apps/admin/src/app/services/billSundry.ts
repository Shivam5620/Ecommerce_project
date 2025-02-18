import { endpoints } from "@repo/ui/lib/constants";
import { APIResponse } from "@repo/ui/types/response";
import ax from "../../lib/axios";
import { IBillSundry } from "@repo/ui/types/billSundry";

export const fetchAllBillSundries = async () =>
  ax<APIResponse<IBillSundry[]>>({
    method: "get",
    url: endpoints.billSundry.index,
  });

export const fetchImportBillSundries = async () =>
  ax<APIResponse>({
    method: "post",
    url: endpoints.billSundry.import,
  });
