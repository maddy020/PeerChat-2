/* eslint-disable @typescript-eslint/no-unused-vars */
import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import BottomWarning from "../components/BottomWarning";
import { useState, useEffect } from "react";
import { ChangeEvent, SetStateAction } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = ({
  isLoggedIn,
  setisLoggedIn,
}: {
  isLoggedIn: boolean;
  setisLoggedIn: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(true);

  const navigate = useNavigate();
  const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL as string;
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword.length < 6) {
      setValidPassword(false);
    } else {
      setValidPassword(true);
    }
  };

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  });

  const handleSignUp = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validPassword) return;
    try {
      const newUser = { name, username, password };
      const response = await axios.post(
        `${BACKEND_BASE_URL}/auth/signup`,
        newUser
      );
      console.log(response.data);
      localStorage.setItem("authtoken", response.data.token);
      setisLoggedIn(true);
      setName("");
      setUsername("");
      setPassword("");
      navigate("/");
    } catch (err) {
      console.log("Error in signing up", err);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your infromation to create an account"} />
          <InputBox
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Madhav"
            label={"Name"}
            type={"text"}
            validPassword={true}
          />
          <InputBox
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="rishavraj@gmail.com"
            label={"Email"}
            type={"email"}
            validPassword={true}
          />
          <InputBox
            onChange={handlePasswordChange}
            placeholder="123456"
            label={"Password"}
            type={"password"}
            validPassword={validPassword}
          />
          <div className="pt-4">
            <Button label={"Sign up"} type={"submit"} />
          </div>
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/login"}
          />
        </div>
      </div>
    </form>
  );
};

export default Signup;
