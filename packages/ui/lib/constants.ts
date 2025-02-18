/**
 * These will the url paths for the client frontend
 */
export const routes = {
  home: "/",
  cart: "/cart",
  orderDetails: "/order-details",
};

/**
 * These will the url paths for the admin frontend
 */
export const dashboardRoutes = {
  index: "/",
  login: "/login",
  dashboard: "/dashboard",
  product: {
    index: "/products",
  },
  shipment: {
    index: "/shipments",
  },
  order: {
    index: "/orders",
    details: "/orders/:id",
    edit: "/orders/:id/edit",
    dispatch: {
      details: "/orders/dispatch/:id",
    },
    wpLogs: "/orders/logs",
    log: "/orders/:id/log",
    invoices: "/orders/invoices",
  },
  orderLoad: {
    index: "/order-load",
  },
  loading: {
    index: "/loadings",
  },
  customer: {
    index: "/customers",
    discounts: "/customers/:code/discounts",
    billSundries: "/customers/:code/bill-sundries",
  },
  brand: {
    index: "/brands",
  },
  user: {
    index: "/users",
  },
  profile: {
    index: "/profile",
  },
  role: {
    index: "/role",
  },
  materialCenter: {
    index: "/material-center",
  },
  bilty: {
    index: "/bilty",
  },
  customerBeats: {
    index: "/customer-beats",
  },
  cashReceipts: {
    index: "/cash-receipts",
  },
  customerBeatSchedule: {
    index: "/customer-beat-schedule",
  },
};

/**
 * These are the url paths for the backend apis that will be used in frontend.
 ** Make sure not to add slashes at the end of the url paths
 */
export const endpoints = {
  auth: {
    index: "/api/auth",
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    changePassword: "/api/auth/change-password",
  },
  product: {
    index: "/api/product",
    warehouse: "/api/product/warehouses",
    brands: "/api/product/brands",
    import: "/api/product/import",
    id: "/api/product/:id",
    setProductImage: "/api/product/image",
  },
  brand: {
    index: "/api/brand",
    id: "/api/brand/:id",
  },
  order: {
    index: "/api/order",
    batch: "/api/order/batch",
    dispatch: "/api/order/:id/dispatch",
    cancel: "/api/order/cancel",
    id: "/api/order/:id",
    paginated: "/api/order/paginated",
  },
  dispatch: {
    index: "/api/dispatch",
    orders: "/api/dispatch/orders",
    wpOrderLogs: "/api/dispatch/paginated",
    id: "/api/dispatch/:id",
    syncInvoices: "/api/dispatch/sync-invoices",
  },
  orderLoad: {
    index: "/api/order-load",
    id: "/api/order-load/:id",
    dispatchesToLoad: "/api/order-load/dispatches",
  },
  user: {
    index: "/api/user",
    id: "/api/user/:id",
  },
  loading: {
    index: "/api/loading",
    id: "/api/loading/:id",
  },
  transport: {
    index: "/api/transport",
    ordersToTransport: "/api/transport/orders",
  },
  shipment: {
    index: "/api/shipment",
    dispatchesToShip: "/api/shipment/dispatches",
  },
  role: {
    index: "/api/role",
    id: "/api/role/:id",
  },
  permission: {
    index: "/api/permission",
  },
  materialCenter: {
    index: "/api/material-center",
    id: "/api/material-center/:id",
  },
  customer: {
    index: "/api/customer",
    id: "/api/customer/:id",
    import: "/api/customer/import",
    discount: {
      index: "/api/customer/discount",
      id: "/api/customer/discount/:id",
    },
    billSundry: {
      index: "/api/customer/bill-sundry",
      id: "/api/customer/bill-sundry/:id",
    },
  },
  itemGroup: {
    index: "/api/item-group",
    import: "/api/item-group/import",
  },
  billSundry: {
    index: "/api/bill-sundry",
    import: "/api/bill-sundry/import",
  },
  bilty: {
    index: "/api/bilty",
    dispatches: "/api/bilty/dispatches",
  },
  customerBeats: {
    index: "/api/customer-beats",
    id: "/api/customer-beats/:id",
  },
  customerBeatSchedule: {
    index: "/api/customer-beat-schedule",
    id: "/api/customer-beat-schedule/:id",
  },
};

export const defaultPaginatedData = {
  docs: [],
  totalDocs: 0,
  limit: 10,
  offset: 0,
  totalPages: 0,
  page: 1,
  pagingCounter: 1,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: null,
  nextPage: null,
};
