import { Mail, XCircle } from "lucide-react";
import { useState } from "react";
import { validateResetPassword } from "../../utils/FormVaildators";
import PasswordInput from "../../components/UI/PasswordInput";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../APIs/authAPIs";
import ErrorDialog from "../../components/Dialogs/ErrorDialog";
import Loading from "../../components/Layout/LoadingLayout";

function ResetPassword() {
  const [errors, setErrors] = useState({});
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [loading, setloading] = useState();
  const navigator = useNavigate();

  const urlPrams = new URLSearchParams(window.location.search);
  const email = urlPrams.get("email");
  const token = urlPrams.get("token");
  const submitResetForm = async (e) => {
    e.preventDefault();
    // console.log("email ", email, "token ", token);
    const values = { password, confirmPassword };
    const validationErrors = validateResetPassword(values);
    if (Object.keys(validationErrors).length > 0) {

        setDialogMessage(validationErrors.password||validationErrors.confirmPassword);

        setopenDialog(true);
      return;
    } else {
      try {
        setloading(true)
        await resetPassword(values.password, email, token);
        navigator("/login");
      } catch (error) {
        const message = error.response?.data?.message || "Something went wrong";
        setDialogMessage(message);
        setopenDialog(true);
      }
      finally{
        setloading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <div>
        <img
          src={import.meta.env.BASE_URL + "Fa3liatLogo.png"}
          alt="fa3liat Logo"
          className="w-fit h-30 absolute top-2 left-10 drop-shadow-black  drop-shadow-lg"
        />
      </div>
      <div className="w-full max-w-md bg-white border-gray-200 rounded-xl shadow-lg p-8">
        <h1 className="text-slate-900 text-3xl font-bold leading-tight pb-3 text-center">
          Set a New Password
        </h1>
        <p className="text-gray-600 text-base font-normal leading-normal pb-6 text-center">
          Your new password must be different from previously used passwords.
        </p>

        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-4">
            <PasswordInput
              content={"password"}
              id="password"
              password={password}
              setPassword={setPassword}
              errors={errors}
            />
            <PasswordInput
              content={"Confirm Password"}
              id="confirmPassword"
              password={confirmPassword}
              setPassword={setConfirmPassword}
              errors={errors}
            />
          </div>

          {errors.password && (
            <div
              className={` items-start gap-3 rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-red-800  flex  
            `}
            >
              <span className="material-symbols-outlined mt-0.5 text-error">
                <XCircle size={16} />
              </span>
              <p>{errors.password ?? errors.confirmPassword}</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <button
              onClick={submitResetForm}
              className="  w-full cursor-pointer  rounded-lg h-12 px-5 bg-primary text-white  font-bold  hover:bg-primary/90  focus:ring-2 "
            >
              <span className="">Set New Password</span>
            </button>
          </div>
        </div>
      </div>
      {openDialog && (
        <ErrorDialog
          open={openDialog}
          message={dialogMessage}
          onClose={() => setopenDialog(false)}
        />
      )}
      {loading && <Loading />}
    </div>
  );
}

export default ResetPassword;
