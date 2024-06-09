import Modal from "react-modal";
const Connection = ({
  setconnlostpopup,
}: {
  setconnlostpopup: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <Modal
        isOpen={true}
        className="w-4/5  bg-white text-black border-none outline-none rounded-lg md:h-32 md:w-96 "
        overlayClassName="overlay"
      >
        <div className="flex flex-col justify-evenly items-center p-2 gap-5">
          <h1 className="font-bold text-lg text-black">
            Connection Lost .... Try Connecting Again
          </h1>
          <button
            className="bg-green-700 py-2 px-3 rounded-lg text-white font-semibold"
            onClick={() => {
              window.location.reload();
              setconnlostpopup(false);
              localStorage.removeItem("remoteUserId");
            }}
          >
            Retry
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Connection;
