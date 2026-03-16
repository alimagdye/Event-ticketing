import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function UserSettings({ title, description, children }) {
  const navigate = useNavigate();
  return (
    <div className="flex-1 flex flex-col justify-center gap-8 max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      
      <div className="flex flex-col gap-1">
        <button 
        onClick={()=> navigate(-1)}
        className="p-4 mb-4 bg-slate-200 rounded-full w-fit text-slate-500 hover:bg-slate-300 hover:text-slate-600 transition-all duration-200"><ArrowLeft size={20}/></button>
        <h1 className="text-2xl font-extrabold text-slate-900">
          {title}</h1>
        <p className="text-slate-500">{description}</p>
      </div>

      {children}

    </div>
  );
}

export default UserSettings;