export interface IShipment {
  boxes: number;
  cartons: number;
}

export interface ICreateShipmentRequestBody {
  cartons: number;
  open_boxes: number;
}
