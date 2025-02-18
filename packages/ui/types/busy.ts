export interface IBusyResponse<T> {
  xml: {
    "rs:data": {
      "z:row": Array<T>;
    };
  };
}
