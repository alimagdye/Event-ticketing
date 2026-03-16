import { KeyRoundIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

function UserSettingsSecurity() {
  const navigate = useNavigate();
  return (
    <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">Security</h2>
        <p className="text-sm text-slate-500">
          Protect your account with a strong password.
        </p>
      </div>

      <div className="p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <div className="size-10 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <KeyRoundIcon color="#BB52E0" size={24} />
            </div>

            <div className="flex flex-col">
              <p className="font-semibold text-slate-900">Password</p>
              <p className="text-sm text-slate-500">
                
              </p>
            </div>
          </div>

          <button 
          onClick={()=>navigate(`/forget-password/get-email`)}
          className="px-4 py-2 text-sm font-bold bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
            Change
          </button>

        </div>
      </div>

    </section>
  );
}

export default UserSettingsSecurity;