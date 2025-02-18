import cron from "node-cron";
import * as productService from "./services/product.service";
import * as orderService from "./services/order.service";
import { OrderStatus } from "@repo/ui/dist/enums/order";

const initializeSchedulers = () => {
  // // Set product codes
  // cron.schedule("*/5 * * * *", () => {
  //   productService
  //     .setProductCodes()
  //     .then(() => {
  //       console.log("Product code scheduler ran successfully");
  //     })
  //     .catch((error) => {
  //       console.error("Set Product code scheduler error", error);
  //     });
  // });

  // Set order statuses
  cron.schedule("0 */6 * * *", () => {
    orderService
      .setOrderStatuses({
        status: {
          $nin: [
            OrderStatus.PENDING,
            OrderStatus.CANCELLED,
            OrderStatus.SHIPPED,
          ],
        },
      })
      .then(() => {
        console.log("Order status scheduler ran successfully");
      })
      .catch((error) => {
        console.error("Set Order status scheduler error", error);
      });
  });
};

export default initializeSchedulers;
