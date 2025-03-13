import React from "react";
import { Form, Image, Input } from "antd";

const ImageUploader = ({ images, setImages, handleDelete }) => {
    const handleImage = async (e) => {
        e.stopPropagation();
        const files = e.target.files;
        let formData = new FormData();
        for (let i of files) {
          formData.append("file", i);
          formData.append("upload_preset", "uploat_data");
          const res = await fetch(
            "https://api.cloudinary.com/v1_1/da5mlszld/image/upload",
            {
              method: "POST",
              body: formData,
            }
          );
          const uploadedImageURL = await res.json();
          setImages((pre) => [...pre, uploadedImageURL.url]);
        }
      };
  return (
    <>
      <Form.Item label="Link hình ảnh" name="imgLink">
        <Input
          placeholder="Image Link"
          type="file"
          onChange={handleImage}
          multiple
          className="w-[85%]"
        />
      </Form.Item>

      <div className="flex gap-4 justify-center items-center">
        {images?.map((item) => (
          <div key={item} className="relative w-1/3 h-1/3">
            <Image src={item} className="object-cover rounded-md" />
            <button
              className="absolute top-2 right-2 bg-red-500 text-center items-center text-white rounded-full p-1 w-[20px] h-[20px] flex justify-center"
              onClick={() => handleDelete(item)}
            >
              x
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ImageUploader;
