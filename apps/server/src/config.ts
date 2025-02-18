import path from "path";

// Configure env
import * as dotenv from "dotenv";
dotenv.config({
  path: path.resolve(__dirname, "..", "..", "..", ".env"),
});

const uploadPath = path.resolve(__dirname, "..", "public/assets");

const config = {
  server: {
    port: process.env.PORT ?? 3000,
  },
  frontend: {
    url: process.env.FRONTEND_URL ?? "http://localhost:3000",
  },
  dashboard: {
    url: process.env.DASHBOARD_URL ?? "http://localhost:3001",
  },
  environment: process.env.NODE_ENV ?? "production",
  authentication: {
    jwt_secret:
      process.env.JWT_SECRET ?? "100804f5-accb-445c-9c1b-3744a73dec58",
    api_auth_token: process.env.API_AUTH_TOKEN,
  },
  database: {
    url: process.env.MONGODB_URL ?? "mongodb://localhost:27107/bootwala",
  },
  // email: {
  //   host: process.env.EMAIL_HOST ?? "",
  //   from: process.env.FROM_EMAIL ?? "",
  //   password: process.env.EMAIL_PASSWORD ?? "",
  //   admin: process.env.ADMIN_EMAIL ?? "",
  //   port: 465,
  // },
  aws: {
    s3: {
      bucket: process.env.AWS_S3_BUCKET ?? "fawz",
    },
    region: process.env.AWS_REGION ?? "ap-south-1",
    access_key: process.env.AWS_ACCESS_KEY_ID ?? "",
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
  integration: {
    busy: {
      url: process.env.BUSY_SERVER_URL ?? "http://localhost:6371",
      username: process.env.BUSY_USERNAME ?? "",
      password: process.env.BUSY_PASSWORD ?? "",
    },
  },
};

// console.log({ config });

export default config;
