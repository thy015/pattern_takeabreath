import React, {memo, useEffect, useState} from "react";
import {Card, Modal, Rate} from "antd";
import dayjs from "dayjs";
import axios from "axios";
import {openNotification} from "./notification";

export const CommentCard = memo(({ item }) => {
  return (
    <Card
      style={{ width: "100%", marginBottom: 16 }}
      title={`Đánh giá từ ${item.cusID?.email}`}
    >
      <div className="flex flex-wrap space-x-3">
        <strong>Ngày đánh giá:</strong>{" "}
        {dayjs(item.createdDay).format("DD/MM/YYYY")}
        <strong>Email:</strong> {item.cusID?.email}
        <strong>Ngày sinh:</strong>{" "}
        {dayjs(item.cusID?.birthday).format("DD/MM/YYYY")}
        <strong>Điểm đánh giá:</strong> <Rate disabled value={item.ratePoint} />
        <strong>Nội dung:</strong> {item.content}
      </div>
    </Card>
  );
});

export const CommentList = memo(({ comments }) => {
  return comments.length > 0 ? (
    comments.map((item) => <CommentCard key={item._id} item={item} />)
  ) : (
    <h3>Hiện không có đánh giá</h3>
  );
});

function ViewComment({ visible, close, record }) {
  const [comments, setComments] = useState([]);
  const BE_PORT = import.meta.env.VITE_BE_PORT;

  useEffect(() => {
    if (record) {
      axios
        .get(`${BE_PORT}/api/hotelList/get-comment-room/${record._id}`)
        .then((res) => setComments(res.data.comments))
        .catch((err) => {
          openNotification(
            "error",
            "Lấy dữ liệu thất bại!",
            err?.response?.data?.message ?? "",
          );
        });
    }
  }, [record]);

  return (
    <Modal
      title={`Đánh giá phòng ${record?.roomName}`}
      open={visible}
      onCancel={close}
    >
      <CommentList comments={comments} />
    </Modal>
  );
}

export default ViewComment;
