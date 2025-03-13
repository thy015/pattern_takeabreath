const moment = require('moment');
const VoucherFacade = require("../../facades/VoucherFacade");

const addVoucher = async (req, res) => {
    const { voucherName, discount, dateStart, dateEnd, code } = req.body;
    const { ownerID } = req;
    if (!ownerID) {
        return res.status(403).json({ status: false, message: "Dont have owner" });
    }
    if (!voucherName || !discount || !dateStart || !dateEnd || !code) {
        return res.status(403).json({ status: false, message: "Input required" });
    }
    try {
        const checkCode = await VoucherFacade.getVoucherByCode(code);
        if (checkCode) {
            return res.status(400).json({ status: false, message: "Code existed" });
        }
        const newVoucher = await VoucherFacade.createVoucher({
            voucherName,
            discount,
            startDay: dateStart,
            endDay: dateEnd,
            code,
            ownerID
        });
        return res.status(201).json({ status: true, message: "Add voucher successful !" });
    } catch (error) {
        console.error("Error in add voucher:", error);
        return res.status(500).json({
            status: "ERROR",
            message: "Lỗi hệ thống",
        });
    }
};

const deleteVoucher = async (req, res) => {
    const id = req.params.id;
    try {
        const voucher = await VoucherFacade.deleteVoucher(id);
        if (!voucher) {
            return res.status(400).json({ status: false, message: "Voucher does not exist !" });
        }
        return res.status(200).json({ status: true, message: "Delete voucher successfully !" });
    } catch (error) {
        console.error("Error in delete voucher:", error);
        return res.status(500).json({
            status: "ERROR",
            message: "Lỗi hệ thống",
        });
    }
};

const updateVoucher = async (req, res) => {
    const idVoucher = req.params.id;
    const { voucherName, discount, startDay, endDay } = req.body.value;
    if (!idVoucher) {
        return res.status(403).json({ status: false, message: "Dont have id voucher" });
    }
    if (!voucherName || !discount || !startDay || !endDay) {
        return res.status(403).json({ status: false, message: "Input required" });
    }
    try {
        const voucher = await VoucherFacade.getVoucherById(idVoucher);
        if (voucher.ownerID.toString() === req.ownerID.toString()) {
            const updatedVoucher = await VoucherFacade.updateVoucher(idVoucher, {
                voucherName,
                discount,
                startDay,
                endDay
            });
            return res.status(200).json({ status: true, message: "Update successful !", ownerID: req.ownerID });
        }
        return res.status(403).json({ status: false, message: "No Ownership Voucher  !", ownerID: req.ownerID });
    } catch (error) {
        console.error("Error in update voucher:", error);
        return res.status(500).json({
            status: "ERROR",
            message: "Lỗi hệ thống",
        });
    }
};

const getListVoucher = async (req, res) => {
    try {
        const listVoucher = await VoucherFacade.getVouchersByOwner(req.ownerID);
        res.json({ listVoucher });
    } catch (error) {
        console.error("Error in get list voucher:", error);
        return res.status(500).json({
            status: "ERROR",
            message: "Lỗi hệ thống",
        });
    }
};

const updateSysVoucher = async (req, res) => {
    const { voucherName, discount, startDay, endDay, code, adminID, ownerJoined } = req.body;
    if (!voucherName || !discount || !startDay || !endDay || !code || !adminID) {
        return res.json({ success: false, message: "Vui lòng điền đủ thông tin" });
    }
    try {
        const today = moment().startOf('day');
        const end = moment(endDay);
        if (!end.isAfter(today.add(1, 'day'))) {
            return res.status(400).json({ success: false, message: "Ngày kết thúc phải ít nhất 1 ngày sau ngày hôm nay" });
        }
        const updateVou = await VoucherFacade.updateSystemVoucher(req.params.id, {
            voucherName,
            discount,
            endDay,
            startDay,
            code,
            adminID,
            ownerJoined
        });
        if (!updateVou) {
            return res.status(404).json({ message: "Không tìm thấy Voucher" });
        }
        res.json({ success: true, message: "Cập nhật Voucher thành công", voucher: updateVou });
    } catch (error) {
        res.status(500).json({ success: false, message: "Cập nhật Voucher thất bại", error });
    }
};

const deleteSysVoucher = async (req, res) => {
    try {
        const deletee = await VoucherFacade.deleteSystemVoucher(req.params.id);
        if (!deletee) {
            return res.status(404).json({ success: false, message: "Không tìm thấy Voucher" });
        }
        res.json({ success: true, message: "Xóa Voucher thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Xóa Voucher thất bại", error });
    }
};

module.exports = {
    addVoucher,
    getListVoucher,
    deleteVoucher,
    updateVoucher,
    updateSysVoucher,
    deleteSysVoucher,
};