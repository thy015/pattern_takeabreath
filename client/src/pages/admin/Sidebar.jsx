import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaHotel,
  FaUser,
  FaRegSun,
  FaChevronRight,
  FaRestroom,
  FaTicketAlt,
  FaReceipt,
} from "react-icons/fa";
import { FaHand } from "react-icons/fa6";

// Component SidebarItem
const SidebarItem = ({ icon: Icon, label, to, active, onClick }) => (
  <Link
    to={to}
    className={`no-underline flex items-center justify-between pl-5 gap-[10px] py-[10px] w-full cursor-pointer ${
      active ? "bg-white text-[#003580]" : "text-white"
    }`}
    onClick={onClick}
  >
    <div className="flex items-center gap-[10px]">
      <Icon color={active ? "#003580" : "white"} />
      <p className="text-[14px] leading-[20px] font-normal pt-[10px]">{label}</p>
    </div>
    <FaChevronRight className="pr-2" color={active ? "#003580" : "white"} />
  </Link>
);

// Factory Pattern tối ưu với Flyweight
const SidebarItemFactory = (() => {
  const itemsCache = new Map();

  return ({ label, to, icon, active, onClick }) => {
    if (!itemsCache.has(label)) {
      itemsCache.set(label, { label, to, icon });
    }

    // Lấy phần tĩnh từ cache
    const cachedItem = itemsCache.get(label);

    // Trả về component mới nhưng giữ phần tĩnh
    return (
      <SidebarItem
        key={label}
        label={cachedItem.label}
        to={cachedItem.to}
        icon={cachedItem.icon}
        active={active}
        onClick={onClick}
      />
    );
  };
})();

// Sidebar Component
const Sidebar = () => {
  const defaultItem = "Dashboard";
  const [activeItem, setActiveItem] = useState(defaultItem);

  // Lấy trạng thái active từ localStorage khi tải trang
  useEffect(() => {
    const storedItem = localStorage.getItem("activeItem");
    if (storedItem) setActiveItem(storedItem);
  }, []);

  // Xử lý khi click vào một item
  const handleItemClick = (item) => {
    setActiveItem(item);
    localStorage.setItem("activeItem", item);
  };

  // Danh sách menu quản lý
  const manageItems = useMemo(
    () => [
      { label: "Khách Sạn", to: "hotel", icon: FaHotel },
      { label: "Khách Hàng", to: "customers", icon: FaUser },
      { label: "Phòng", to: "rooms", icon: FaRestroom },
      { label: "Voucher", to: "vouchers", icon: FaTicketAlt },
      { label: "Hóa Đơn", to: "invoices", icon: FaReceipt },
      { label: "Yêu Cầu", to: "requests", icon: FaHand },
    ],
    []
  );

  // Danh sách menu tính năng thêm
  const addonItems = useMemo(
    () => [{ label: "Cài Đặt", to: "settings", icon: FaRegSun }],
    []
  );

  return (
    <div className="bg-[#003580] h-full">
      {/* Header Sidebar */}
      <div className="px-[15px] py-[30px] flex items-center justify-center border-b-[1px] border-[#EDEDED]/[0.3]">
        <h1 className="text-white text-[20px] leading-[24px] font-extrabold cursor-pointer">
          TakeABreath
        </h1>
      </div>

      {/* Trang Chủ */}
      {SidebarItemFactory({
        label: "Trang Chủ",
        to: "dashboard",
        icon: FaTachometerAlt,
        active: activeItem === "Dashboard",
        onClick: () => handleItemClick("Dashboard"),
      })}

      {/* Quản Lý */}
      <div className="pt-[15px] border-t-[1px] border-[#EDEDED]/[0.3]">
        <p className="text-[10px] font-extrabold leading-[16px] text-white/[0.4]">QUẢN LÝ</p>
      </div>

      {manageItems.map((item) =>
        SidebarItemFactory({
          ...item,
          active: activeItem === item.label,
          onClick: () => handleItemClick(item.label),
        })
      )}

      {/* Tính Năng Thêm */}
      <div className="pt-[5px] border-b-[1px] border-[#EDEDED]/[0.3]">
        <p className="text-[10px] font-extrabold leading-[16px] text-white/[0.4]">TÍNH NĂNG THÊM</p>
      </div>

      {addonItems.map((item) =>
        SidebarItemFactory({
          ...item,
          active: activeItem === item.label,
          onClick: () => handleItemClick(item.label),
        })
      )}
    </div>
  );
};

export default Sidebar;
