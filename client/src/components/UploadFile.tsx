import { useState } from "react";
import LoadingOutlined from "@ant-design/icons/LoadingOutlined";
import PlusOutlined from "@ant-design/icons/PlusOutlined";
import { UploadChangeParam, UploadFile } from "antd/es/upload";
import { ConfigProvider, Upload } from "antd";

const UploadFileInput = ({
  setInputFile,
}: {
  setInputFile: React.Dispatch<React.SetStateAction<File | null>>;
}) => {
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: UploadChangeParam<UploadFile<File>>) => {
    setLoading(true);
    const file = e.file?.originFileObj as unknown as File;
    setInputFile(file);
    setLoading(false);
  };

  return (
    <>
      <ConfigProvider upload={{ style: { display: "none" } }} />
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        onChange={(e) => handleChange(e)}
      >
        <button type="button" className="bg-none border-0 text-white ">
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
        </button>
      </Upload>
    </>
  );
};
export default UploadFileInput;
