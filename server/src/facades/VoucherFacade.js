const { Voucher, SystemVoucher } = require('../models/voucher.model');

class VoucherFacade {
    async createVoucher(data) {
        try {
            const voucher = new Voucher(data);
            await voucher.save();
            return voucher;
        } catch (error) {
            throw error;
        }
    }

    async getVoucherById(id) {
        try {
            const voucher = await Voucher.findById(id);
            return voucher;
        } catch (error) {
            throw error;
        }
    }

    async updateVoucher(id, data) {
        try {
            const voucher = await Voucher.findByIdAndUpdate(id, data, { new: true });
            return voucher;
        } catch (error) {
            throw error;
        }
    }

    async deleteVoucher(id) {
        try {
            await Voucher.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }

    async createSystemVoucher(data) {
        try {
            const systemVoucher = new SystemVoucher(data);
            await systemVoucher.save();
            return systemVoucher;
        } catch (error) {
            throw error;
        }
    }

    async getSystemVoucherById(id) {
        try {
            const systemVoucher = await SystemVoucher.findById(id);
            return systemVoucher;
        } catch (error) {
            throw error;
        }
    }

    async updateSystemVoucher(id, data) {
        try {
            const systemVoucher = await SystemVoucher.findByIdAndUpdate(id, data, { new: true });
            return systemVoucher;
        } catch (error) {
            throw error;
        }
    }

    async deleteSystemVoucher(id) {
        try {
            await SystemVoucher.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new VoucherFacade();