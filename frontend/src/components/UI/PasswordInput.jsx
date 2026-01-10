import { useState } from "react";
import EyeTrager from "../Icons/Eyetrager";

function PasswordInput({ content, id, password, setPassword, errors }) {
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <label className="flex flex-col min-w-40 flex-1 font-medium mb-1">
      {content}
      <div className="relative">
        <input
          type={showPassword ? `text` : `password`}
          placeholder="Enter password"
          name={password}
          id={id}
          value={password}
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full h-15 border ${
            errors[password] ? "border-red-600" : "border-gray-300"
          } rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary`}
        />

        <span
          className="absolute right-6 top-5 text-gray-400 cursor-pointer"
          onClick={handleShowPassword}
        >
          <EyeTrager />
        </span>
      </div>
    </label>
  );
}

export default PasswordInput;
