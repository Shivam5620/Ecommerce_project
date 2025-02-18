import { endpoints } from "@repo/ui/lib/constants";
import { APIResponse } from "@repo/ui/types/response";
import ax from "../../lib/axios";
import { IItemGroup } from "@repo/ui/types/itemGroup";

export const fetchAllItemGroups = async () =>
  ax<APIResponse<IItemGroup[]>>({
    method: "get",
    url: endpoints.itemGroup.index,
  });

export const fetchImportItemGroups = async () =>
  ax<APIResponse>({
    method: "post",
    url: endpoints.itemGroup.import,
  });
