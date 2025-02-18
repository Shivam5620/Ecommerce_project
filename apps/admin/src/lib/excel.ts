export type ExcelHeader = {
  label: string;
  key: string;
};

export const generateExcel = (headers: ExcelHeader[], data: any[]): string => {
  const csvHeaders = headers.map((header) => header.label).join(",") + "\n";

  const csvRows = data
    .map((row) =>
      headers
        .map((header) => {
          let value = row[header.key];

          if (typeof value === "object") {
            try {
              value = JSON.stringify(value);
            } catch (e) {
              value = "";
            }
          }

          return `"${(value || "").toString().replace(/"/g, '""')}"`;
        })
        .join(","),
    )
    .join("\n");

  return csvHeaders + csvRows;
};
