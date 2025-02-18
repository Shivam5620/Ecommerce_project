import { startCase } from "lodash";

export function priceFormat(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}
export function numberToWords(num: number): string {
  if (num === 0) return "zero";

  const belowTwenty = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];

  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  const indianUnits = ["", "thousand", "lakh", "crore"];

  function convertChunk(num: number): string {
    let result = "";

    if (num >= 100) {
      result += belowTwenty[Math.floor(num / 100)] + " hundred ";
      num %= 100;
    }

    if (num >= 20) {
      result += tens[Math.floor(num / 10)] + " ";
      num %= 10;
    }

    if (num > 0) {
      result += belowTwenty[num] + " ";
    }

    return startCase(result.trim());
  }

  function integerToWordsIndian(num: number): string {
    let result = "";
    let unitIndex = 0;

    while (num > 0) {
      let chunk: number;

      if (unitIndex === 1) {
        // Handle thousands separately (3 digits)
        chunk = num % 1000;
        num = Math.floor(num / 1000);
      } else {
        // Handle lakh, crore (2 digits each)
        chunk = num % 100;
        num = Math.floor(num / 100);
      }

      if (chunk > 0) {
        result =
          `${convertChunk(chunk)} ${indianUnits[unitIndex]} ${result}`.trim();
      }

      unitIndex++;
    }

    return startCase(result.trim());
  }

  const [integerPart, decimalPart] = num.toString().split(".");

  let words = integerToWordsIndian(parseInt(integerPart));

  if (decimalPart) {
    const decimalWords = decimalPart
      .split("")
      .map((digit) => belowTwenty[parseInt(digit)])
      .join(" ");
    words += ` point ${decimalWords}`;
  }

  return startCase(words.trim());
}
