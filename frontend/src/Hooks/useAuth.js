import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { setTokens } from "../services/cookieTokenService";
import { resendOtps } from "../APIs/authAPIs";

export function useAuth({
  initialValues = {},
  validator,
  onSubmit,
  redirectTo = null,
  redirectFrom = null,
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const closeDialog = () => setShowDialog(false);

  const submit = async (e) => {
    e.preventDefault();
    console.log("submit");

    const formData = Object.fromEntries(new FormData(e.target).entries());
    console.log("form");

    const validationErr = validator(formData);

    setErrors(validationErr);

    if (Object.keys(validationErr).length > 0) return;

    try {
      console.log("submit");
      setLoading(true);

      const response = await onSubmit(formData);
      console.log(
        "Success:",
        response.data,
        response?.data?.accessToken?.token
      );

      setTokens(response.data.data);

      navigate(redirectTo, { state: { origin: redirectFrom } });
    } catch (error) {
      console.log("error", error);

      const message =
        error.response?.data?.data?.error || "Something went wrong";
      setDialogMessage(message);
      setShowDialog(true);
    } finally {
      setLoading(false);
    }
  };
  const submitOTP = async (otp) => {
    const validationErr = validator(otp);

    setErrors(validationErr);

    // console.log(otp)
    // if (Object.keys(validationErr).length > 0) return;
    console.log(":" + otp);
    try {
      console.log(":" + otp);
      const response = await onSubmit(otp);

      console.log("Success:", response.data);

      navigate(redirectTo, { state: { origin: redirectFrom } });
    } catch (error) {
      // console.log(error.response.data.data.otp)
      const message = error.response?.data?.data?.otp || "Something went wrong";
      setDialogMessage(message);
      setShowDialog(true);
    }
  };

  const resendOtp = async () => {
    try {
      const response = await resendOtps();

      console.log("OTP Resent:", response.data);
    } catch (error) {
      console.log("OTP Resent:", error.response.data);
      const message =
        error.response?.data?.data?.error ||
        "Something went wrong resending OTP";
      setDialogMessage(message);
      setShowDialog(true);
    }
  };

  return {
    values,
    handleChange,
    showPassword,
    handleShowPassword,
    errors,
    submit,
    submitOTP,
    resendOtp,
    showDialog,
    dialogMessage,
    closeDialog,
    loading,
  };
}
