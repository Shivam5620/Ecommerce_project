export enum OrderStatus {
  PENDING = "PENDING", // Order received and ready to be batched
  BATCHED = "BATCHED", // Order has been batched
  CANCELLED = "CANCELLED", // Order has been cancelled

  // dispatch status
  UNDER_DISPATCH = "UNDER_DISPATCH", // No warehouse managers have dispatched
  PARTIAL_DISPATCH = "PARTIAL_DISPATCH", // Some warehouse managers have dispatched and some are pending
  UNDER_PACK = "UNDER_PACK", // All warehouse managers have dispatched. Only packing is pending.
  PACKED = "PACKED", // Packager has dispatched the order
  SHIPPED = "SHIPPED", // The packager dispatch has be loaded on transport
}
