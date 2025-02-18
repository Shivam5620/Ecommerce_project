import { IProduct } from "@repo/ui/types/product";
import DataTable, { TableColumn } from "react-data-table-component";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchImportProducts,
  fetchProducts,
  fetchSetImage,
} from "../../app/feature/productSlice";
import { Button, Card, TextInput } from "flowbite-react";
import { ExcelHeader, generateExcel } from "../../lib/excel";
import { getPermissions } from "@repo/ui/lib/permission";
import { Features, Modules } from "@repo/ui/enums/permission";
import { getAssetUrl } from "../../lib/asset";
import { UploadType } from "@repo/ui/enums/upload";
import Loader from "../common/Loader/Loader";

const Products = () => {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);
  const [search, setSearch] = useState<string>("");
  const [filteredProducts, setFilteredProducts] =
    useState<IProduct[]>(products);
  const rolePermissions = useAppSelector(
    (state) => state.auth.user?.role?.permissions ?? [],
  );

  const permissions = useMemo(
    () => getPermissions(Modules.Product, Features.Product, rolePermissions),
    [rolePermissions],
  );

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    code: string,
    color: string,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const image = e.target.files[0];
      dispatch(fetchSetImage({ code, color, file: image }));
    }
  };

  const columns: TableColumn<IProduct>[] = [
    {
      name: "#",
      selector: (_, rowIndex) =>
        String(rowIndex !== undefined ? rowIndex + 1 : "-"),
    },
    {
      name: "Name",
      selector: (row) => row.name,
      wrap: true,
      sortable: true,
    },
    {
      name: "Product code",
      selector: (row) => row.product_code,
      wrap: true,
      sortable: true,
    },
    {
      name: "Image",
      cell: (row) => (
        <img
          src={getAssetUrl(UploadType.product, row.image)}
          alt={row.name}
          onError={(e) => (e.currentTarget.src = "/NotFound.png")}
          style={{ width: 100, height: "auto" }}
        />
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <input
            type="file"
            accept="image/*"
            id={`file-input-${row._id}`}
            style={{ display: "none" }}
            onChange={(e) => {
              if (!e.target.files) return;
              const ext = e.target.files[0].name.split(".").pop();
              const name = `${row.code}_${row.color.replace(new RegExp("[s/]"), "")}.${ext}`;
              console.log({ name, image: row.image, files: e.target.files });
              handleImageUpload(e, row.code, row.color);
            }}
          />
          {permissions.update && (
            <Button
              color="purple"
              size="sm"
              pill
              onClick={() =>
                document.getElementById(`file-input-${row._id}`)?.click()
              }
            >
              Select File
            </Button>
          )}
        </div>
      ),
    },
    { name: "Code", selector: (row) => row.code, sortable: true },
    { name: "Color", selector: (row) => row.color, sortable: true },
    { name: "Size", selector: (row) => row.size, sortable: true },
    { name: "Rate", selector: (row) => row.sale_price, sortable: true },
    { name: "Discount", selector: (row) => `${row.discount}%`, sortable: true },
    { name: "Brand", selector: (row) => row.brand, sortable: true },
    {
      name: "Category",
      selector: (row) => row.category.join(", "),
      sortable: true,
    },
    { name: "MOQ", selector: (row) => row.MOQ, sortable: true },
    { name: "PRCTN", selector: (row) => row.PRCTN, sortable: true },
    { name: "Rack No.", selector: (row) => row.rack_no, sortable: true },
    { name: "Status", selector: (row) => row.status, sortable: true },
    { name: "Quantity", selector: (row) => row.quantity, sortable: true },
  ];

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, []);

  useEffect(() => {
    const searchData = search
      ? products.filter((product) => {
          const lowercasedSearch = search.toLowerCase();
          return (
            (product.name &&
              product.name.toLowerCase().includes(lowercasedSearch)) ||
            (product.category &&
              product.category.some((category) =>
                category.toLowerCase().includes(lowercasedSearch),
              )) ||
            (product.brand &&
              product.brand.toLowerCase().includes(lowercasedSearch)) ||
            (product.code &&
              product.code.toLowerCase().includes(lowercasedSearch)) ||
            (product.color &&
              product.color.toLowerCase().includes(lowercasedSearch)) ||
            (product.size &&
              product.size.toString().toLowerCase().includes(lowercasedSearch))
          );
        })
      : products;
    setFilteredProducts(searchData);
  }, [search, products]);

  const actionsMemo = useMemo(() => {
    const handleExportCSV = () => {
      if (products.length > 0) {
        const link = document.createElement("a");
        const csvHeaders: ExcelHeader[] = [
          { label: "Name", key: "name" },
          { label: "Product code", key: "product_code" },
          { label: "Image", key: "image" },
          { label: "Code", key: "code" },
          { label: "Color", key: "color" },
          { label: "Size", key: "size" },
          { label: "Rate", key: "sale_price" },
          { label: "Discount", key: "discount" },
          { label: "Brand", key: "brand" },
          { label: "Category", key: "category" },
          { label: "MOQ", key: "MOQ" },
          { label: "PRCTN", key: "PRCTN" },
          { label: "Rack No.", key: "rack_no" },
          { label: "Status", key: "status" },
          { label: "Quantity", key: "quantity" },
        ];
        let csv = generateExcel(csvHeaders, products);
        if (csv == null) return;

        const filename = "products_export.csv";

        if (!csv?.match(/^data:text\/csv/i)) {
          csv = `data:text/csv;charset=utf-8,${csv}`;
        }

        link.setAttribute("href", encodeURI(csv));
        link.setAttribute("download", filename);
        link.click();
      } else {
        console.log("No products available for export");
      }
    };

    const handleImportProducts = () => {
      dispatch(fetchImportProducts());
    };

    return (
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {permissions.import && (
            <Button size="sm" pill onClick={handleImportProducts}>
              Import Products
            </Button>
          )}
          {permissions.export && (
            <Button size="sm" pill onClick={handleExportCSV}>
              Export Products
            </Button>
          )}
          <TextInput
            type="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
    );
  }, [products, search]);

  return (
    <Card>
      <div className="card-body">
        {/* Table Start  */}
        <div className="whitespace-nowrap custom-data-table">
          {permissions.read && (
            <DataTable
              title="Products"
              columns={columns}
              actions={actionsMemo}
              data={filteredProducts}
              progressPending={loading}
              progressComponent={<Loader />}
              pagination={true}
            />
          )}
        </div>
        {/* Table End  */}
      </div>
    </Card>
  );
};

export default Products;
