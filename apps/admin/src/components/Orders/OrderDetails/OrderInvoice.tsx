import { List } from "flowbite-react";
import { priceFormat } from "@repo/ui/utils/number";
import { useMemo } from "react";
import moment from "moment";
import config from "../../../config";
import qr from "./QR.jpeg";
import Logo from "./logo.png";
import { groupProductsByCode } from "@repo/ui/lib/product";

export interface IInvoiceItem {
  qty: number;
  total: number;
  name: string;
  code: string;
  color: string;
  size: string;
  discount_1: number;
  discount_2: number;
  discount_3: number;
  hsn_code: string;
  sale_price: number;
  price: number;
  cgst_percentage: number;
  sgst_percentage: number;
  igst_percentage: number;
}

interface IProps {
  invoice_id: string;
  party: string;
  city: string;
  items: Array<IInvoiceItem>;
  date?: Date;
  remark?: string;
  total: number;
  transport: string;
  cartons: number;
  open_boxes: number;
  gst: string;
  isInvoice: boolean;
}

const OrderInvoice: React.FC<IProps> = ({
  invoice_id,
  items,
  party,
  date,
  remark,
  total,
  transport,
  cartons,
  open_boxes,
  gst = "",
  isInvoice = false,
}) => {
  const hsns = useMemo(() => {
    // Loop through items and calculate tax
    const data: Array<{
      hsn_code: string;
      rate: number;
      cgst_amount: number;
      sgst_amount: number;
      igst_amount: number;
      taxable_amount: number;
      cgst_percentage: number;
      sgst_percentage: number;
      igst_percentage: number;
      total: number;
    }> = [];

    for (const item of items) {
      const rate =
        item.cgst_percentage + item.sgst_percentage + item.igst_percentage;
      const hsnIndex = data.findIndex(
        (h) =>
          h.hsn_code.length &&
          h.hsn_code === item.hsn_code &&
          h.rate === rate &&
          h.cgst_percentage === item.cgst_percentage &&
          h.sgst_percentage === item.sgst_percentage &&
          h.igst_percentage === item.igst_percentage,
      );

      if (hsnIndex === -1) {
        data.push({
          hsn_code: item.hsn_code,
          rate: rate,
          cgst_amount: 0,
          sgst_amount: 0,
          igst_amount: 0,
          taxable_amount: 0,
          cgst_percentage: item.cgst_percentage,
          sgst_percentage: item.sgst_percentage,
          igst_percentage: item.igst_percentage,
          total: item.total,
        });
      } else {
        data[hsnIndex].total += item.total;
      }
    }

    // Loop through data and calculate taxable amount and taxes
    let total_cgst_amount = 0;
    let total_sgst_amount = 0;
    let total_igst_amount = 0;
    let total_taxable_amount = 0;
    let total_tax_amount = 0;
    for (const hsn of data) {
      let taxableAmount =
        1 +
        (hsn.cgst_percentage + hsn.sgst_percentage + hsn.igst_percentage) / 100;
      taxableAmount = hsn.total / taxableAmount;
      total_tax_amount += hsn.total;

      const cgstTax = ((hsn.cgst_percentage / 100) * taxableAmount).toFixed(2);
      const sgstTax = ((hsn.sgst_percentage / 100) * taxableAmount).toFixed(2);
      const igstTax = ((hsn.igst_percentage / 100) * taxableAmount).toFixed(2);

      hsn.taxable_amount = taxableAmount;
      total_taxable_amount += taxableAmount;

      hsn.cgst_amount = Number(cgstTax);
      total_cgst_amount += Number(cgstTax);

      hsn.sgst_amount = Number(sgstTax);
      total_sgst_amount += Number(sgstTax);

      hsn.igst_amount = Number(igstTax);
      total_igst_amount += Number(igstTax);
    }

    // Final row to show total taxes
    if (data.length) {
      data.push({
        hsn_code: "",
        rate: 0,
        cgst_amount: total_cgst_amount,
        sgst_amount: total_sgst_amount,
        igst_amount: total_igst_amount,
        taxable_amount: total_taxable_amount,
        cgst_percentage: 0,
        sgst_percentage: 0,
        igst_percentage: 0,
        total: total_tax_amount,
      });
    }

    return data;
  }, [items]);

  const groupedProducts = useMemo(() => {
    return groupProductsByCode<IInvoiceItem>(items ?? []);
  }, [items]);

  return (
    <div className="p-4 text-[12px]">
      <table className="w-full">
        <tbody className="divide-y">
          <tr className="font-bold text-[16px]">
            <td>GSTIN: 23AACFN6435A1ZU</td>
            <td className="text-center">
              {isInvoice ? "TAX INVOICE" : "ESTIMATE"}
            </td>
            <td className="text-right pr-2 italic font-normal">
              Duplicate Copy
            </td>
          </tr>
          <tr className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <td className="p-3 whitespace-nowrap border border-gray-300 font-medium text-gray-900 dark:text-white">
              <img
                src={Logo}
                alt="Left"
                className="w-full h-auto max-w-[320px]"
              />
            </td>
            <td
              className="whitespace-nowrap border border-gray-300 font-medium text-gray-900 pl-6 dark:text-white font-bold text-[14px]"
              colSpan={2}
            >
              <p>NAZAR HUSAIN ABDUL KARIM</p>
              <p>19/1, PATTI BAZAAR, BOOTWALA COMPLEX,</p>
              <p>Ranipura, Madhya Pradesh - 452007</p>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-between mt-1 border border-gray-300 px-2 text-[14px] font-bold">
        <div>
          <p className="text-[16px]">
            <b>Party:</b> {party} {gst.length ? `(${gst})` : ""}
          </p>
          {/* <p>
            <b>City:</b> {city}
          </p> */}
          <p>
            <b>Transport:</b> {transport}
          </p>
          <p>
            <b>No. of Cartons:</b> {cartons}
          </p>
          <p>
            <b>Open boxes:</b> {open_boxes}
          </p>
        </div>
        <div>
          <p>
            <b>Invoice ID:</b> {invoice_id}
          </p>
          <p>
            <b>Date:</b> {moment(date).format(config.date.format)}
          </p>
          <p>
            <b>Remark:</b> {remark ?? "NA"}
          </p>
        </div>
      </div>
      <table className="w-full border border-gray-300 mt-1 text-center">
        <thead>
          <tr>
            <th className="border border-gray-300">S.No</th>
            <th className="border border-gray-300">Item Name</th>
            <th className="border border-gray-300">H.S.N.</th>
            <th className="border border-gray-300">Qty</th>
            <th className="border border-gray-300">Price</th>
            <th className="border border-gray-300">Amount</th>
          </tr>
        </thead>
        <tbody>
          {groupedProducts && Object.keys(groupedProducts).length > 0
            ? Object.entries(groupedProducts).map(([, items], index) => {
                let qty = 0;
                let total = 0;
                if (Array.isArray(items)) {
                  for (const item of items) {
                    qty += item.qty;
                    total += item.total;
                  }
                }
                const discounts = [];
                if (items[0].discount_1) {
                  discounts.push(`${items[0].discount_1}%`);
                }
                if (items[0].discount_2) {
                  discounts.push(`${priceFormat(items[0].discount_2)}`);
                }
                if (items[0].discount_3) {
                  discounts.push(`${items[0].discount_3}%`);
                }
                return (
                  <tr key={items[0].code}>
                    <td className="border border-gray-300">{index + 1}</td>
                    <td className="border border-gray-300 text-left pl-2">
                      {items[0].name}
                      {items?.map((product, idx) => (
                        <div key={idx}>
                          {product.color} - {product.size} - {product.qty}
                        </div>
                      ))}
                    </td>
                    <td className="border border-gray-300">
                      {items[0].hsn_code}
                    </td>
                    <td className="border border-gray-300">{qty}</td>
                    <td className="border border-gray-300">
                      {priceFormat(items[0].sale_price)}
                      {discounts.length > 0 && (
                        <p>
                          <span className="line-through">
                            {priceFormat(items[0].price)}
                          </span>
                          &nbsp;
                          {discounts.join(" + ")}
                        </p>
                      )}
                    </td>
                    <td className="border border-gray-300 text-right pr-2">
                      {priceFormat(total)}
                    </td>
                  </tr>
                );
              })
            : null}
          <tr>
            <td className="border border-gray-300 text-right pr-2" colSpan={3}>
              Grand Total
            </td>
            <td className="border border-gray-300">
              <p>{items?.reduce((total, item) => total + item.qty, 0)}</p>
            </td>
            <td className="border border-gray-300"></td>
            <td className="border border-gray-300 text-right pr-2">
              {priceFormat(total ?? 0)}
            </td>
          </tr>
        </tbody>
      </table>
      {Array.isArray(hsns) && hsns.length > 0 && (
        <table className="w-full border border-gray-300 mt-1 text-center">
          <thead>
            <tr>
              <th className="border border-gray-300">HSN/SAC</th>
              <th className="border border-gray-300">Tax Rate</th>
              <th className="border border-gray-300">Taxable Amt.</th>
              <th className="border border-gray-300">CGST Amt.</th>
              <th className="border border-gray-300">SGST Amt.</th>
              <th className="border border-gray-300">IGST Amt.</th>
              <th className="border border-gray-300">Total Tax</th>
            </tr>
          </thead>
          <tbody>
            {hsns.map((hsn, index, self) => {
              return (
                <tr
                  key={hsn.hsn_code + "-" + hsn.rate}
                  className={index === self.length - 1 ? "font-bold" : ""}
                >
                  <td className="border border-gray-300">{hsn.hsn_code}</td>
                  <td className="border border-gray-300">
                    {hsn.rate ? `${hsn.rate}%` : ""}
                  </td>
                  <td className="border border-gray-300">
                    {priceFormat(hsn.taxable_amount)}
                  </td>
                  <td className="border border-gray-300">
                    {priceFormat(hsn.cgst_amount)}
                  </td>
                  <td className="border border-gray-300">
                    {priceFormat(hsn.sgst_amount)}
                  </td>
                  <td className="border border-gray-300">
                    {priceFormat(hsn.igst_amount)}
                  </td>
                  <td className="border border-gray-300">
                    {priceFormat(
                      hsn.cgst_amount + hsn.sgst_amount + hsn.igst_amount,
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {/* <h1 className="my-2 text-[16px] font-bold">
        Rupees {numberToWords(total)} only
      </h1> */}
      <table className="w-full mt-1">
        <tbody>
          <tr>
            <td className="whitespace-nowrap border border-gray-300 font-medium text-gray-900 dark:text-white">
              <List className="text-gray-700 dark:text-white pl-2">
                Terms & Conditions:
                <List ordered nested className="text-gray-700 dark:text-white">
                  <List.Item>
                    रेट संबंधित त्रुटि ३ दिन बाद स्वीकार नहीं की जावेगी,
                    व्हाट्सएप 8819978652 पर तुरन्त भेजे
                  </List.Item>
                  <List.Item>
                    ऑर्डर किया हुआ माल किसी भी कीमत में वापसी नहीं लिया जाएगा
                  </List.Item>
                  <List.Item>
                    ६० दिन में अगर पैमेंट जमा नही होती है तो एकाउंट ब्लॉक कर
                    दिया जायेगा।{" "}
                  </List.Item>
                  <List.Item>
                    १८० दिन पश्चात gst रिवर्स करने का प्रावधान रहेगा।
                  </List.Item>
                </List>
              </List>
              <p className="text-[14px] mt-3 text-center">
                ऑर्डर देने के लिए fawz.in पर संपर्क करें
              </p>
            </td>
            <td className="whitespace-nowrap border border-gray-300 font-medium text-gray-900 dark:text-white pl-2">
              <img src={qr} width={100} alt="Right" />
              <div>
                <p>A/C Name: NAZAR HUSAIN ABDUL KARIM</p>
                <p>Bank A/C No.: 777705078652</p>
                <p>Bank Name: ICICI BANK</p>
                <p>IFSC: ICIC0003880</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OrderInvoice;
