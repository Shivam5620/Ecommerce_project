import { CounterType } from "@repo/ui/dist/enums/counter";
import Counter from "../models/counter.model";

export const generateId = async (type: CounterType) => {
  // get current date
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  let series = "";
  let expiryDate: Date;
  if (currentMonth >= 4) {
    const startYear = currentYear;
    const endYear = currentYear + 1;
    expiryDate = new Date(currentYear + 1, 3, 31);
    series = `${startYear % 100}${endYear % 100}`;
  } else {
    const startYear = currentYear - 1;
    const endYear = currentYear;
    expiryDate = new Date(currentYear, 3, 31);
    series = `${startYear % 100}${endYear % 100}`;
  }
  const counter = await Counter.findOne({
    series,
    type,
  });
  let dispatchNum = 1;

  if (counter) {
    dispatchNum = counter.count + 1;
    await Counter.findByIdAndUpdate(counter._id, { count: dispatchNum });
  } else {
    const newCounter = new Counter({
      series,
      type,
      count: dispatchNum,
      expire_at: expiryDate,
    });
    await newCounter.save();
  }
  const dispatchId = `${series}${type.charAt(0)}${dispatchNum}`;
  return dispatchId;
};

// export const generateId = async (type: CounterType): Promise<string> => {
//   const now = new Date();
//   const isNewFinancialYear = now.getMonth() + 1 >= 4; // April or later

//   const startYear = now.getFullYear() - (isNewFinancialYear ? 0 : 1);
//   const endYear = startYear + 1;
//   const series = `${startYear % 100}${endYear % 100}`;
//   const expiryDate = new Date(endYear, 3, 31); // 31st March of end year

//   const counter = await Counter.findOneAndUpdate(
//     { series, type },
//     { $inc: { count: 1 } },
//     { new: true, upsert: true, setDefaultsOnInsert: true },
//   );

//   const counterNum = counter ? counter.count : 1;
//   if (!counter) {
//     await Counter.updateOne({ series, type }, { expire_at: expiryDate });
//   }

//   return `${series}${type.charAt(0)}${counterNum}`;
// };

export const getNextSequenceWithPrefix = async (
  type: CounterType,
  series: string,
  padding = 5,
) => {
  console.log("Updating sequence  for type:", type, "series:", series);
  const counter = await Counter.findOneAndUpdate(
    { type, series },
    { $inc: { count: 1 } },
    { new: true, upsert: true },
  );

  // Pad the sequence number with leading zeros
  const paddedSeq = String(counter.count).padStart(padding, "0");
  return `${series}${paddedSeq}`;
};
