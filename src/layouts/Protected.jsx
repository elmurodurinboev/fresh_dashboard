import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/utils/useAuth.js";
import { useEffect } from "react";

const Protected = () => {
  const { session } = useAuth();

  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  return session?.user_id ? <Outlet /> : <Navigate to={"/auth/login"} />;
};

export default Protected;
