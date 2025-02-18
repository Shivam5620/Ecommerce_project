import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";
import path from "path";
import cors from "cors";

// Routes
import productRouter from "./routes/product.route";
import orderRouter from "./routes/order.route";
import brandRouter from "./routes/brand.route";
import userRouter from "./routes/user.route";
import permissionRouter from "./routes/permission.route";
import roleRouter from "./routes/role.route";
import authRouter from "./routes/auth.route";
import loadingRouter from "./routes/loading.route";
import orderLoadRouter from "./routes/orderLoad.route";
// import transportRouter from "./routes/transport.route";
import shipmentRouter from "./routes/shipment.route";
import orderDispatchRouter from "./routes/orderDispatch.route";
import materialCenterRouter from "./routes/materialCenter.route";
import biltyRouter from "./routes/bilty.route";
import customerRouter from "./routes/customer.route";
import itemGroupRouter from "./routes/itemGroup.route";
import billSundryRouter from "./routes/billSundry.route";
import customerDiscountRouter from "./routes/customerDiscount.route";
import customerBillSundryRouter from "./routes/customerBillSundry.route";
import customerBeatRouter from "./routes/customerBeat.route";
import customerBeatScheduleRouter from "./routes/customerBeatSchedule.route";
// Middlewares
import { errorHandler } from "./middlewares/error.middleware";
import config from "./config";

const app: Application = express();

app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(
  cors({
    origin: [config.frontend.url, config.dashboard.url],
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS", "PUT"],
  }),
);

app.use(productRouter);
app.use(orderRouter);
app.use(brandRouter);
app.use(userRouter);
app.use(permissionRouter);
app.use(roleRouter);
app.use(authRouter);
app.use(loadingRouter);
app.use(orderLoadRouter);
// app.use(transportRouter);
app.use(orderDispatchRouter);
app.use(shipmentRouter);
app.use(materialCenterRouter);
app.use(biltyRouter);
app.use(customerRouter);
app.use(itemGroupRouter);
app.use(billSundryRouter);
app.use(customerDiscountRouter);
app.use(customerBillSundryRouter);
app.use(customerBeatRouter);
app.use(customerBeatScheduleRouter);

app.use("/api/*", (_: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    status: false,
    data: null,
    message: "API Not Found",
  });
});

// Error handler
app.use(errorHandler);

export default app;
