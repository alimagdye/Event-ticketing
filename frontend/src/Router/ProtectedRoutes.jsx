import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/AuthProvider";

function ProtectedRoutes({children,Roles}) {
  const { user } = useUser();
  const navigate =useNavigate();
    
     if (Roles && !Roles.includes(user.role)) {
    // return <Navigate to="/unauthorized" replace />;
      navigate("/unauthorized");
      // return null;
    }
  
    return children;
}

export default ProtectedRoutes;