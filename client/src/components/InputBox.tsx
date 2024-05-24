import { ChangeEvent } from "react";

const InputBox = ({
  label,
  placeholder,
  onChange,
  type,
  validPassword,
}: {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type: string;
  validPassword: boolean;
}) => {
  return (
    <div>
      <div className="text-sm font-medium text-left py-2">{label}</div>
      <input
        type={type}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-2 py-1 border rounded border-slate-200"
        required
      />
      <div className="text-red-500 text-sm text-left">
        {validPassword ? "" : "Password must be at least 6 characters long"}
      </div>
    </div>
  );
};

export default InputBox;
