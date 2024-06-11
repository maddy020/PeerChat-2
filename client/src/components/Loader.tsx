import Modal from "react-modal";
const Loader = () => {
  return (
    <>
      <Modal
        isOpen={true}
        className="w-4/5 flex flex-col justify-center items-center border-none outline-none rounded-lg md:h-32 md:w-96 "
        overlayClassName="overlay"
      >
        <span className="loader"></span>
        <span className="text-white font-semibold">Fetching Data</span>
      </Modal>
    </>
  );
};

export default Loader;
