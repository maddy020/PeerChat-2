import Modal from "react-modal";
const ConnectionChangePopup = ({
  setConnChangePopup,
}: {
  setConnChangePopup: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <Modal
        isOpen={true}
        className="w-4/5  bg-white text-black rounded-lg border-none outline-none md:h-32 md:w-96"
        overlayClassName="overlay"
      >
        <div className="flex flex-col justify-evenly items-center p-2 gap-5">
          <h1 className="font-bold text-lg text-black">
            All the data will get Erased? Are you sure you want to change the
            connection?
          </h1>
          <div className="flex gap-6">
            <button
              className="bg-green-700 py-2 px-3 rounded-lg  text-white font-semibold"
              onClick={() => {
                setConnChangePopup(false);
                window.location.reload();
              }}
            >
              Yes
            </button>
            <button
              className="bg-red-700  py-2 px-3 rounded-lg text-white font-semibold"
              onClick={() => {
                setConnChangePopup(false);
              }}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ConnectionChangePopup;
