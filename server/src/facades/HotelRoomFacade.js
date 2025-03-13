const { Hotel, Room, Comment } = require('../models/hotel.model');

class HotelRoomFacade {
    async createHotel(data) {
        try {
            const hotel = new Hotel(data);
            await hotel.save();
            return hotel;
        } catch (error) {
            throw error;
        }
    }

    async getHotelById(id) {
        try {
            const hotel = await Hotel.findById(id);
            return hotel;
        } catch (error) {
            throw error;
        }
    }

    async updateHotel(id, data) {
        try {
            const hotel = await Hotel.findByIdAndUpdate(id, data, { new: true });
            return hotel;
        } catch (error) {
            throw error;
        }
    }

    async deleteHotel(id) {
        try {
            await Hotel.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }

    async createRoom(data) {
        try {
            const room = new Room(data);
            await room.save();
            return room;
        } catch (error) {
            throw error;
        }
    }

    async getRoomById(id) {
        try {
            const room = await Room.findById(id);
            return room;
        } catch (error) {
            throw error;
        }
    }

    async updateRoom(id, data) {
        try {
            const room = await Room.findByIdAndUpdate(id, data, { new: true });
            return room;
        } catch (error) {
            throw error;
        }
    }

    async deleteRoom(id) {
        try {
            await Room.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }

    async createComment(data) {
        try {
            const comment = new Comment(data);
            await comment.save();
            return comment;
        } catch (error) {
            throw error;
        }
    }

    async getCommentById(id) {
        try {
            const comment = await Comment.findById(id);
            return comment;
        } catch (error) {
            throw error;
        }
    }

    async updateComment(id, data) {
        try {
            const comment = await Comment.findByIdAndUpdate(id, data, { new: true });
            return comment;
        } catch (error) {
            throw error;
        }
    }

    async deleteComment(id) {
        try {
            await Comment.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new HotelRoomFacade();