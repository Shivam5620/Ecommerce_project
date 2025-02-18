import { IProductSelectedFilter } from "@repo/ui/types/product";

// Helper function to construct URL params from filters
export const constructQueryParams = (
  selectedFilters: IProductSelectedFilter,
) => {
  const params = new URLSearchParams();

  // Iterate over the params object to construct query parameters
  Object.entries(selectedFilters).forEach(([key, values]) => {
    if (Array.isArray(values) && values.length > 0) {
      values.forEach((value) => params.append(`${key}[]`, value));
    }
  });

  // console.log("URL params", params);

  return params.toString();
};

// Helper function to parse query params from URL
// Helper to parse query params and decode them
export const parseQueryParams = (search: string) => {
  const params = new URLSearchParams(search);
  const filters: Record<string, string[]> = {};

  params.forEach((value, key) => {
    const decodedKey = key.replace(/\[\]$/, ""); // Remove '[]'
    if (!filters[decodedKey]) filters[decodedKey] = [];
    filters[decodedKey].push(decodeURIComponent(value));
  });

  // console.log("Decoded filters", { filters });

  return filters;
};
