const HotelRoomFacade = require("../../facades/HotelRoomFacade");
const { Invoice } = require("../../models/invoice.model");
const { Owner } = require("../../models/signUp.model");
const dayjs = require("dayjs");
const axios = require('axios');
const isBetween = require("dayjs/plugin/isBetween");
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const createRoom = async (req, res) => {
  const { numberOfBeds, numberOfRooms, typeOfRoom, money, hotelID, capacity, imgLink, roomName } = req.body;

  try {
    if (!numberOfBeds || !typeOfRoom || !money || !hotelID || !capacity || !roomName) {
      return res.status(403).json({ message: "Input is required" });
    }

    const createdRoom = await HotelRoomFacade.createRoom({
      roomName,
      numberOfBeds,
      numberOfRooms,
      typeOfRoom,
      money,
      capacity,
      hotelID,
      imgLink,
      ownerID: req.ownerID
    });

    if (createdRoom) {
      const hotel = await HotelRoomFacade.getHotelById(createdRoom.hotelID);
      if (hotel) {
        if (hotel.minPrice === 0 || hotel.minPrice > money) {
          hotel.minPrice = money;
          await hotel.save();
        }
        hotel.numberOfRooms += 1;
        await hotel.save();
      }
      const room = await createdRoom.populate("hotelID");
      return res.status(201).json({
        status: "OK",
        message: "Room created successfully",
        data: room,
      });
    }
  } catch (e) {
    console.error("Error in createRoom:", e);
    return res.status(500).json({ message: e.message });
  }
};

const updateRoom = async (req, res) => {
  const id = req.params.id;
  const { numberOfBeds, numberOfRooms, typeOfRoom, money, hotelID, capacity, imgLink, roomName } = req.body;

  if (!id) return res.status(403).json({ message: "Bị mất id phòng" });

  try {
    if (!numberOfBeds || !typeOfRoom || !money || !hotelID || !capacity || !roomName) {
      return res.status(403).json({ message: "Input is required" });
    }

    const room = await HotelRoomFacade.getRoomById(id);

    if (room.hotelID != hotelID) {
      const oldHotel = await HotelRoomFacade.getHotelById(room.hotelID);
      oldHotel.numberOfRooms -= 1;
      await oldHotel.save();

      const newHotel = await HotelRoomFacade.getHotelById(hotelID);
      newHotel.numberOfRooms += 1;
      await newHotel.save();
    }

    room.roomName = roomName;
    room.numberOfBeds = numberOfBeds;
    room.numberOfRooms = numberOfRooms;
    room.typeOfRoom = typeOfRoom;
    room.money = money;
    room.capacity = capacity;
    room.hotelID = hotelID;
    room.imgLink = imgLink;
    await room.save();

    await room.populate("hotelID");
    return res.status(201).json({
      status: "OK",
      message: "Room updated successfully",
      data: room,
    });
  } catch (e) {
    console.error("Error in updateRoom:", e);
    return res.status(500).json({ message: e.message });
  }
};

const getHotelsByOwner = async (req, res) => {
  try {
    const hotels = await HotelRoomFacade.getHotelsByOwner(req.ownerID);
    const getCountHotel = await Promise.all(
        hotels.map(async (item) => {
          const count = await Invoice.countDocuments({ hotelID: item._id });
          return { ...item.toObject(), revenue: count };
        })
    );

    return res.status(200).json({ status: "OK", data: getCountHotel });
  } catch (e) {
    console.error("Error in getHotelsByOwner:", e);
    return res.status(500).json({ message: e.message });
  }
};

const createHotel = async (req, res) => {
  const { hotelName, address, city, nation, hotelType, phoneNum, imgLink, ownerID, hotelAmenities } = req.body;

  try {
    if (!hotelName || !address || !city || !nation || !hotelType || !phoneNum || !ownerID) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const checkExistedOwnerID = await Owner.findById(ownerID);
    if (!checkExistedOwnerID) {
      return res.status(400).json({ status: "BAD", message: "Owner ID does not exist" });
    }

    const paymentCard = checkExistedOwnerID.paymentCard;
    if (paymentCard.length <= 0) {
      return res.status(400).json({ status: "BAD", message: "Vui lòng đăng ký thẻ trước khi tạo khách sạn" });
    }

    const createdHotel = await HotelRoomFacade.createHotel({
      hotelName,
      address,
      city,
      nation,
      hotelType,
      phoneNum,
      imgLink,
      ownerID: req.ownerID,
      hotelAmenities
    });

    return res.status(201).json({
      status: "OK",
      message: "Hotel created successfully",
      data: createdHotel,
    });
  } catch (error) {
    console.error("Error in createHotel:", error);
    return res.status(500).json({ message: error.message });
  }
};

const updateHotels = async (req, res) => {
  const { hotelName, address, city, nation, hotelType, phoneNum, imgLink, hotelAmenities } = req.body;

  try {
    if (!hotelName || !address || !city || !nation || !hotelType || !phoneNum) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const hotelID = req.params.id;
    const hotel = await HotelRoomFacade.getHotelById(hotelID);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    hotel.hotelName = hotelName;
    hotel.address = address;
    hotel.city = city;
    hotel.nation = nation;
    hotel.hotelType = hotelType;
    hotel.phoneNum = phoneNum;
    hotel.imgLink = imgLink;
    hotel.hotelAmenities = hotelAmenities;
    await hotel.save();

    return res.status(200).json({
      status: "OK",
      message: "Hotel updated successfully",
      data: hotel,
    });
  } catch (error) {
    console.error("Error in updateHotels:", error);
    return res.status(500).json({ message: error.message });
  }
};

const queryHotel = async (req, res) => {
  const { city, dayStart, dayEnd, people } = req.body;
  if (!city || !dayStart || !dayEnd || !people) {
    return res.status(403).json({ message: "All fields are required" });
  }
  try {
    const start = dayStart;
    const end = dayEnd;

    const hotels = await HotelRoomFacade.getHotelsByCity(city);
    if (hotels.length === 0) {
      return res.status(400).json({ message: "No hotel in this city" });
    }

    const hotelIDs = hotels.map((h) => h._id);
    const rooms = await HotelRoomFacade.getRoomsByHotelIDs(hotelIDs);
    if (rooms.length === 0) {
      return res.status(200).json({ message: `Không có phòng khả dụng ở thành phố ${city}` });
    }

    const roomsID = rooms.map((r) => r._id);
    const invoices = await Invoice.find({ roomID: { $in: roomsID } });

    const availableRoomDays = [];
    const unavailableRooms = [];

    rooms.forEach((room) => {
      let availableRooms = room.numberOfRooms;
      const roomInvoices = invoices.filter((invoice) => invoice.roomID.equals(room._id));
      const bookedRooms = roomInvoices.reduce((count, invoice) => {
        const invoiceStart = dayjs(invoice.guestInfo.checkInDay);
        const invoiceEnd = dayjs(invoice.guestInfo.checkOutDay);
        const totalRoomsBooked = invoice.guestInfo.totalRoom || 1;
        const isOverlapping =
            dayjs(start).isBetween(invoiceStart, invoiceEnd, null, "[)") ||
            dayjs(end).isBetween(invoiceStart, invoiceEnd, null, "(]");

        if (isOverlapping) {
          count += totalRoomsBooked;
        }
        return count;
      }, 0);

      const countRoom = availableRooms - bookedRooms;
      if (countRoom > 0) {
        availableRoomDays.push({ ...room.toObject(), countRoom });
      } else {
        unavailableRooms.push({ ...room.toObject(), countRoom: 0 });
      }
    });

    if (availableRoomDays.length > 0) {
      return res.status(200).json({
        status: "OK",
        roomData: availableRoomDays,
        unavailableRooms,
        hotelData: hotels,
        countRoom: availableRoomDays.map((room) => ({
          hotelID: room.hotelID,
          roomID: room._id,
          countRoom: room.countRoom,
        })),
      });
    } else {
      return res.status(200).json({ message: "No available hotel for the selected dates" });
    }
  } catch (e) {
    console.log("Problem in hotel query controller: " + e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const googleGeometrySearch = async (req, res) => {
  try {
    const { city } = req.body;

    const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${process.env.VITE_API_KEY}`
    );

    if (response.data && response.data.results.length > 0) {
      const lat = response.data.results[0].geometry.location.lat;
      const lng = response.data.results[0].geometry.location.lng;

      return res.status(200).json({ lat, lng });
    } else {
      return res.status(404).json({ message: 'No results found' });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const deleteHotel = async (req, res) => {
  try {
    const hotel = req.params.id;
    const countRoom = await HotelRoomFacade.countRoomsByHotelID(hotel);
    const countInvoice = await Invoice.countDocuments({ hotelID: hotel });

    if (countRoom > 0) {
      return res.status(400).json({ message: "Khách sạn đã liên kết tới phòng khác nên không xóa được !" });
    }

    if (countInvoice > 0) {
      return res.status(400).json({ message: "Khách sạn đã liên kết tới đơn đặt phòng khác nên không xóa được !" });
    }

    const deletedProduct = await HotelRoomFacade.deleteHotel(hotel);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "" });
  } catch (e) {
    console.log("Problem in hotel query controller: " + e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteRoom = async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(403).json({ message: "Bị mất id phòng" });

  try {
    const invoice = await Invoice.countDocuments({ roomID: id });

    if (invoice > 0) {
      return res.status(400).json({ message: "Phòng đã được đặt không thể xóa !" });
    }
    const roomDelete = await HotelRoomFacade.deleteRoom(id);
    if (roomDelete) {
      const hotel = await HotelRoomFacade.getHotelById(roomDelete.hotelID);
      if (hotel) {
        hotel.numberOfRooms -= 1;
        await hotel.save();
      }
      return res.status(200).json({ message: "Xóa phòng thành công !" });
    } else {
      return res.status(400).json({ message: "Xóa phòng không thành công !" });
    }
  } catch (er) {
    return res.status(500).json({ message: er.message });
  }
};

const getInvoicesOwner = async (req, res) => {
  const { ownerID } = req;
  const countHotel = await HotelRoomFacade.countHotelsByOwnerID(ownerID);
  const countRoom = await HotelRoomFacade.countRoomsByOwnerID(ownerID);
  const hotels = await HotelRoomFacade.getHotelsByOwner(ownerID);
  const hotelIDs = hotels.map((hotel) => hotel._id);
  const invoices = await Invoice.find({ hotelID: { $in: hotelIDs } }).populate("roomID hotelID cusID");

  const totalPrice = invoices.reduce((acc, item) => acc + item.guestInfo.totalPrice, 0);

  return res.json({
    status: true,
    invoice: invoices,
    countHotel,
    countRoom,
    countInvoice: invoices.length,
    totalPrice,
  });
};

const commentRoom = async (req, res) => {
  const { ratePoint, content, roomID, invoiceID } = req.body;
  const idCus = req.user.id;
  if (!ratePoint || !content || !roomID || !invoiceID) return res.status(403).json({ message: "Bị mất dữ liệu" });
  if (!idCus) return res.status(403).json({ message: "Mất thông tin khách hàng" });

  try {
    const comment = await HotelRoomFacade.createComment({
      ratePoint,
      content,
      roomID,
      cusID: idCus,
      invoiceID,
    });

    return res.status(200).json({ message: "Đánh giá thành công, Cảm ơn bạn đã đánh giá", comment });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi hệ thống", err: err.message });
  }
};

const getCommentCus = async (req, res) => {
  const idCus = req.user.id;
  try {
    const comment = await HotelRoomFacade.getCommentsByCustomerID(idCus);
    return res.status(200).json({ message: comment });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi hệ thống", err: err.message });
  }
};

const getCommentRoom = async (req, res) => {
  const idRoom = req.params.id;
  if (!idRoom) return res.status(403).json({ message: "Mất dữ liệu" });
  try {
    const comment = await HotelRoomFacade.getCommentsByRoomID(idRoom);
    return res.status(200).json({ comments: comment });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi hệ thống", err: err.message });
  }
};

const filterRoomDate = async (req, res) => {
  const idOwner = req.ownerID;
  const arrayDate = req.body.arrayDate;

  if (!idOwner) return res.status(403).json({ message: "Mất dữ liệu người dùng" });
  if (!arrayDate) return res.status(403).json({ message: "Bị dữ liệu ngày" });

  const startDate = dayjs(arrayDate[0]);
  const endDate = dayjs(arrayDate[1]);
  try {
    const rooms = await HotelRoomFacade.getRoomsByOwnerID(idOwner);
    const hotels = await HotelRoomFacade.getHotelsByOwner(idOwner);
    const hotelIDs = hotels.map((hotel) => hotel._id);

    const invoices = await Invoice.find({ hotelID: { $in: hotelIDs } }).populate("roomID hotelID cusID");

    const filterInvoice = invoices.filter((item) => {
      const checkInDay = dayjs(item.guestInfo.checkInDay);
      const checkOutDay = dayjs(item.guestInfo.checkOutDay);
      return (
          (checkInDay.isSameOrAfter(startDate) && checkInDay.isSameOrBefore(endDate)) ||
          (checkOutDay.isSameOrAfter(startDate) && checkOutDay.isSameOrBefore(endDate)) ||
          (checkInDay.isBefore(startDate) && checkOutDay.isAfter(endDate)) ||
          (checkInDay.isSameOrBefore(endDate) && checkOutDay.isSameOrAfter(startDate))
      );
    });

    const roomInvoiceCount = filterInvoice.reduce((acc, invoice) => {
      const roomID = invoice.roomID._id;
      acc[roomID] = (acc[roomID] || 0) + invoice.guestInfo.totalRoom;
      return acc;
    }, {});

    const updateRoom = await Promise.all(
        rooms.map(async (item) => {
          const commentCount = await HotelRoomFacade.countCommentsByRoomID(item._id);
          return { ...item, revenue: roomInvoiceCount[item._id] || 0, comments: commentCount };
        })
    );

    res.json({ message: "test", room: updateRoom });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createHotel,
  createRoom,
  getHotelsByOwner,
  queryHotel,
  updateHotels,
  deleteHotel,
  deleteRoom,
  updateRoom,
  getInvoicesOwner,
  googleGeometrySearch,
  commentRoom,
  getCommentCus,
  getCommentRoom,
  filterRoomDate,
};