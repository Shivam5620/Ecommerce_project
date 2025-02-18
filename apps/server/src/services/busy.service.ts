import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import config from "../config";
import { IBusyResponse } from "@repo/ui/dist/types/busy";

// Axios instance with base URL and headers
const ax = axios.create({
  baseURL: config.integration.busy.url,
  headers: {
    SC: 1,
    UserName: config.integration.busy.username,
    Pwd: config.integration.busy.password,
  },
});

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
});

const queries = {
  customers:
    // "SELECT [m1].[Code], [m1].[Name], [m1].[Alias], [ma].[Mobile], [ma].[GSTNo], [ma].[WhatsAppNo], [m1].[PrintName], [cs].[Name] AS [State], [m2].[Name] as [AccountGroup], [m3].[Name] as [AccountCategory], [m1].[MasterNotes], [m1].[ApprovalStatus], [m1].[HSNCode] FROM [dbo].[Master1] as m1 INNER JOIN [dbo].[MasterAddressInfo] as ma ON [m1].[Code] = [ma].[MasterCode] INNER JOIN [dbo].[Master1] AS cs ON [ma].[StateCodeLong] = [cs].[Code] INNER JOIN [dbo].[Master1] as m2 ON [m1].[ParentGrp] = [m2].[Code] INNER JOIN [dbo].MasterSupport as ms ON [m1].[Code] = [ms].[MasterCode] INNER JOIN [dbo].Master1 as m3 ON [m3].[Code] = [ms].[CM1] WHERE [m1].[MasterType] = 2",
    "SELECT [m1].[Code], [m1].[Name], [m1].[Alias], [ma].[Mobile], [ma].[GSTNo], [ma].[WhatsAppNo], [m1].[PrintName], [cs].[Name] AS [State], [m2].[Name] AS [AccountGroup], [m1].[MasterNotes], [m1].[ApprovalStatus], [m1].[HSNCode], [m1].[ParentGrp] FROM [dbo].[Master1] AS m1 LEFT JOIN [dbo].[MasterAddressInfo] AS ma ON [m1].[Code] = [ma].[MasterCode] LEFT JOIN [dbo].[Master1] AS cs ON [ma].[StateCodeLong] = [cs].[Code] LEFT JOIN [dbo].[Master1] AS m2 ON [m1].[ParentGrp] = [m2].[Code] WHERE [m1].[MasterType] = 2 ORDER BY [m1].[Code]",
  brands:
    "SELECT [A].[Code], [A].[Name], [B].[Code], [B].[Name] FROM [Master1] [A] INNER JOIN [Master1] [B] on [A].[ParentGrp] = [B].[Code] WHERE [A].[MasterType] = 5 AND [B].[Name]='FAWZ'",
  materialCenters:
    "SELECT [Code], [Name], [ParentGrp] FROM [dbo].[Master1] WHERE [MasterType] = 2",
  products:
    "SELECT [A].[ItemCode] AS [ItemCode], [H].[Alias] AS [Code], [B].[Name] AS [Name], [C].[Name] AS [ItemGroup], [C].[Code] AS [ItemGroupCode], [G].[Name] AS [Category], [I].[Name] AS [Brand], [B].[HSNCode] AS [HSNCode], CASE WHEN CHARINDEX('@', D.OF2) > 0 THEN SUBSTRING( REPLACE(D.OF2, '@', ''), PATINDEX('%[^0]%', REPLACE(D.OF2, '@', '')), LEN(REPLACE(D.OF2, '@', '')) ) ELSE REPLACE(D.OF2, '0', '') END AS [MOQ], [E].[Name] AS [RackNo], CASE WHEN [C].[Name] LIKE '%Campus%' THEN [A].[C1] ELSE [A].[C2] END AS [Size], CASE WHEN [C].[Name] LIKE '%Campus%' THEN [A].[C2] ELSE [A].[C1] END AS [Color], [B].[D3] AS [SalePrice], [B].[D16] AS [Discount], SUM(Value1) AS [ClosingStock], SUM(A.D7) AS [TotalAmount], [A].[D3] AS [MRP], [A].[C3] AS [EanCode], CAST(LTRIM(REPLACE([D].[OF3], '@', '')) AS INT) AS [Points], ROUND(1.0 / CAST([B].[D1] AS DECIMAL(18, 10)), 2) AS PRCTN FROM ItemParamDet [A] INNER JOIN [Master1] [B] ON [A].[ItemCode] = [B].[Code] INNER JOIN [Master1] [C] ON [B].[ParentGrp] = [C].[Code] INNER JOIN [MasterAddressInfo] [D] ON [A].[ItemCode] = [D].[MasterCode] INNER JOIN [Master1] [E] ON [D].[OF1] = [E].[Code] INNER JOIN [MasterSupport] [F] ON [B].[Code] = [F].[MasterCode] INNER JOIN [Master1] [G] ON [F].[CM1] = [G].[Code] INNER JOIN [Master1] [H] ON [H].[Code] = [A].[ItemCode] INNER JOIN [Master1] [I] ON [C].[ParentGrp] = [I].[code] WHERE [F].[SrNo] = 1 AND [A].[RecType] = 1 AND [F].[RecType] = 110 AND [A].[MCCode] = 13406 GROUP BY [A].[ItemCode], [B].[Name], [H].[Alias], [C].[Name], [C].[Code], [A].[C5], [D].[OF2], [E].[Name], [G].[Name], [A].[C1], [A].[C2], [A].[C3], [A].[C8], [A].[C9], [B].[D16], [B].[D1], [B].[D3], [B].[HSNCode], [A].[D3], [I].[Name], [D].[OF3] ORDER BY [A].[ItemCode], [H].[Alias], [A].[C1], [A].[C2], [A].[C3]",
  itemGroups:
    "SELECT [Code], [Name] FROM [dbo].[Master1] WHERE [MasterType] = 5",
  billSundries:
    "SELECT [Code], [Name] FROM [dbo].[Master1] WHERE [MasterType] = 9",
} as const;

// Define the type of the keys of `queries`
type QueryKey = keyof typeof queries;

/**
 * Parses the given XML data and extracts an array of entries from the `z:row` section
 * within the `rs:data` element. The XML data is first converted to JSON format. If the
 * `rs:data` section or `z:row` entries are not found, a warning is logged and an empty
 * array is returned.
 *
 * @param data - The XML data to be parsed and processed.
 * @returns An array of entries of type T extracted from the `z:row` section.
 */
function extractData<T>(data: any) {
  // Convert XML to JSON only in importCustomers
  const jsonData: IBusyResponse<T> = parser.parse(data);

  let returnData: T[] = [];

  // Access rs:data section
  const rsData = jsonData.xml["rs:data"];
  if (!rsData) {
    console.warn("`rs:data` section not found in the response.");
    return returnData;
  }

  // Extract customer data from z:row
  returnData = Array.isArray(rsData["z:row"]) ? rsData["z:row"] : [];
  if (!returnData || returnData.length === 0) {
    console.warn("No `z:row` entries found in `rs:data`.");
    return returnData;
  }

  return returnData;
}

/**
 * Fetches the data from the specified query from the busy database.
 *
 * @param key - The key of the query to execute.
 * @returns A promise that resolves to an array of entries of type T.
 * @throws {Error} If the query is not found.
 */
export async function fetchData<T>(key: QueryKey): Promise<T[]> {
  if (!queries[key]) {
    throw new Error("Query not found.");
  }

  try {
    const response = await ax.get("/", {
      headers: {
        Qry: queries[key],
      },
    });

    const data = extractData<T>(response.data);
    return data;
  } catch (error) {
    console.error(`Error fetching ${key}:`, error);
    throw new Error(`Failed to fetching ${key}.`);
  }
}

/**
 * Syncs the given invoice XML to the busy database.
 *
 * @param {string} xml - The XML of the invoice to be synced.
 */
export async function syncInvoice(invoiceId: string, xml: string) {
  try {
    console.log(`Syncing invoice ${invoiceId} to Busy...`);

    const response = await axios.post(
      config.integration.busy.url,
      {
        invoice_number: invoiceId,
      },
      {
        headers: {
          SC: "2",
          UserName: config.integration.busy.username,
          Pwd: config.integration.busy.password,
          VchType: "9",
          VchXML: xml,
          "content-type": "application/xml",
        },
      },
    );

    console.log(`Response headers for invoice ${invoiceId}:`, response.headers);
    console.log(`Response data for invoice ${invoiceId}:`, response.data);

    if (response.status === 200) {
      // Extract the 'Result' header
      const resultHeader = response.headers["result"];
      const descriptionHeader = response.headers["description"];
      console.log(`Result header for invoice ${invoiceId}: ${resultHeader}`);

      // Determine the sync status based on resultHeader
      return (
        resultHeader === "T" || descriptionHeader === "Voucher already exist."
      );
    } else {
      console.error(
        `Failed to fetch result header for invoice ${invoiceId}: ${response.status}`,
      );
      throw new Error(`Failed to sync invoice`);
    }
  } catch (error: any) {
    console.error(`Error syncing invoice:`, error);
    throw new Error(`Failed to sync invoice. ${error.message}`);
  }
}
