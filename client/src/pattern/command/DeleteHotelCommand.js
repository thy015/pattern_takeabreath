class DeleteHotelCommand {
  constructor(hotelService, hotelId, dispatch) {
    this.hotelService = hotelService;
    this.hotelId = hotelId;
    this.dispatch = dispatch;
  }

  async execute() {
    try {
      await this.hotelService.deleteHotel(this.hotelId);
      this.dispatch({ type: "DELETE_HOTEL", payload: this.hotelId });
      console.log("Vô hiệu hóa khách sạn thành công!");
    } catch (error) {
      console.log("Vô hiệu hóa khách sạn thất bại!", error);
    }
  }

  undo() {
    console.log("Undo xóa khách sạn không được hỗ trợ.");
  }
}

export default DeleteHotelCommand;
