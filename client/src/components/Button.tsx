type ButtonType = "submit" | "button" | "reset";

const Button = ({
  label,
  type,
  isLoading,
}: {
  label: string;
  type: ButtonType;
  isLoading: boolean;
}) => {
  return (
    <button
      type={type}
      className="flex gap-4 items-center justify-center w-full text-white bg-gradient-to-r from-custom-blue-light from-10% to-custom-blue-dark hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
    >
      <p>{label}</p>
      {isLoading && <span className="loader"></span>}
    </button>
  );
};
export default Button;
