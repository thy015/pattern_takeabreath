class UpdateHotelCommand {
  constructor(dispatch, hotelData) {
    this.dispatch = dispatch;
    this.hotelData = hotelData;
  }

  execute() {
    this.dispatch({ type: "SELECT_HOTEL", payload: this.hotelData });
    console.log("Đã chọn khách sạn để cập nhật.");
  }

  undo() {
    this.dispatch({ type: "SELECT_HOTEL", payload: {} });
    console.log("Hủy chọn khách sạn.");
  }
}

export default UpdateHotelCommand;
