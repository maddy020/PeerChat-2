/* eslint-disable @typescript-eslint/no-unused-vars */
import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import BottomWarning from "../components/BottomWarning";
import { SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChangeEvent } from "react";
import axios from "axios";

const SigninComponent = ({
  isLoggedIn,
  setisLoggedIn,
}: {
  isLoggedIn: boolean;
  setisLoggedIn: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("authtoken");
  const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL as string;

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  });

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword.length < 6) {
      setValidPassword(false);
    } else {
      setValidPassword(true);
    }
  };

  const handleSignIn = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validPassword) return;
    try {
      const user = { username, password };
      const response = await axios.post(
        `${BACKEND_BASE_URL}/auth/login`,
        user,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.setItem("authtoken", response.data.token);
      localStorage.setItem("userID", response.data.id);
      setisLoggedIn(true);
      setUsername("");
      setPassword("");
      navigate("/");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="madhavsetia@gmail.com"
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
            <Button label={"Sign in"} type={"submit"} />
          </div>
          <BottomWarning
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/signup"}
          />
        </div>
      </div>
    </form>
  );
};

export default SigninComponent;
