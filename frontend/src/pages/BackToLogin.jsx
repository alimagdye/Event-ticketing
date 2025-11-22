import { Mail } from "lucide-react";

function BackToLogin() {
  const navigator = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4 ">
      <div>
        <img
          src={import.meta.env.BASE_URL + "Fa3liatLogo.png"}
          alt="fa3liat Logo"
          className="w-fit h-30 absolute top-2 left-10"
        />
      </div>
      <div className="w-full max-w-md bg-white border-gray-200 rounded-xl shadow-lg p-8">
        <div>
          <Mail size={48} className="mx-auto mb-4 text-primary " />
        </div>
        <h1 className="text-slate-900 text-3xl font-bold leading-tight pb-3 text-center">
          Check Your Inbox
        </h1>
        <p className="text-gray-600 text-base font-normal leading-normal pb-6 text-center">
          We've sent a password reset link. if a Fa3liat account exists with
          this email..
        </p>

        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigator("/login")}
              className="  w-full cursor-pointer  rounded-lg h-12 px-5 bg-primary text-white  font-bold  hover:bg-primary/90  focus:ring-2 "
            >
              <span className="truncate">Back To Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BackToLogin;
