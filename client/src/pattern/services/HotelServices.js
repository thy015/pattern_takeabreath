import axios from "axios";

const BE_PORT = import.meta.env.VITE_BE_PORT;

class HotelService {
  async deleteHotel(hotelId) {
    const response = await axios.delete(`${BE_PORT}/api/hotelList/deleteHotel/${hotelId}`);
    return response.data;
  }
}

export default new HotelService();
