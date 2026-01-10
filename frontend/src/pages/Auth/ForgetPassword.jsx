import { Mail, X, XCircle } from "lucide-react";
import { useState } from "react";
import { validateForgetPassword } from "../../utils/FormVaildators";
import { Link, useNavigate } from "react-router-dom";
import { frogetPassword } from "../../APIs/authAPIs";
import ErrorDialog from "../../components/Dialogs/ErrorDialog";
import Loading from "../../components/Layout/LoadingLayout";

function ForgetPassword() {
  const [email, setemail] = useState("");
  const [error, setError] = useState({});
  // const [showDialog, setShowDialog] = useState(false);
  // const [dialogMessage, setDialogMessage] = useState("");
    const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [loading, setloading] = useState(false);
  const closeDialog = () => {
    setShowDialog(false);
    setDialogMessage("");
  };
  const navigator = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForgetPassword(email);
    setError(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setloading(true);
      const response = await frogetPassword(email);
      // console.log("Success:", response.data);

      navigator("/forget-password/back");
    } catch (err) {
      const message =
        error.response?.data?.message || "Something went wrong";
      setDialogMessage(message);
      setopenDialog(true);
    }
    finally {
      setloading(false);
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
          Reset Your Password
        </h1>
        <p className="text-gray-600 text-base font-normal leading-normal pb-6 text-center">
          Enter your email address below, and we'll send you a link to reset
          your password.
        </p>

        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-4">
            <label className="flex flex-col min-w-40 flex-1 font-medium">
              <p className="text-slate-900   pb-4">Email Address</p>
              <div className="relative flex w-full flex-1 items-stretch">
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg  focus:outline-0 focus:ring-2 focus:ring-primary/90 border border-gray-300 placeholder:text-gray-400 p-3 pl-11 text-base font-normal leading-normal"
                  placeholder="you@example.com"
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  autoComplete="email"
                  onChange={(e) => setemail(e.target.value)}
                />
                <div className="text-gray-400  absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="material-symbols-outlined text-xl">
                    <Mail size={20} />{" "}
                  </span>
                </div>
              </div>
            </label>
          </div>

          {error.email && (
            <div
              className={` items-start gap-3 rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-red-800  flex  
            `}
            >
              <span className="material-symbols-outlined mt-0.5 text-error">
                <XCircle size={16} />
              </span>
              <p>{error.email}</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <button
              onClick={submit}
              className="  w-full cursor-pointer  rounded-lg h-12 px-5 bg-primary text-white  font-bold  hover:bg-primary/90  focus:ring-2 "
            >
              <span className="truncate">Send Reset Link</span>
            </button>
            <p className="text-gray-600 text-sm font-medium text-center">
              Remember your password? &nbsp;
              <Link
                className="text-sm font-medium text-primary hover:underline text-center"
                to="/login"
              >
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* {showDialog && (
        <div className="fixed inset-0 bg-white/40 flex items-center justify-center z-50">
          <div className="bg-white  rounded-lg shadow-lg p-6 w-120 h-50 max-w-sm flex flex-col justify-center items-center ">
            <p className="text-gray-800 text-xl">{dialogMessage}</p>

            <button
              onClick={closeDialog}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-md transition mt-10"
            >
              Close
            </button>
          </div>
        </div>
      )} */}

            {openDialog && <ErrorDialog open={openDialog} message={dialogMessage} onClose={() => setopenDialog(false)} />}
              {loading &&<Loading />}
    </div>
  );
}

export default ForgetPassword;
