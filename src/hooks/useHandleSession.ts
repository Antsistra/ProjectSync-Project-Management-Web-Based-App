import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const useHandleSession = () => {
  const supabaseUrlKey = import.meta.env.VITE_SUPABASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const authTokenKey = `sb-${supabaseUrlKey}-auth-token`;
    const authToken = localStorage.getItem(authTokenKey);
    const id = localStorage.getItem("id");

    if (authToken && authToken !== "null" && authToken !== "undefined") {
      if (!id) {
        localStorage.clear();
        navigate("/login");
      } else {
        navigate("/dashboard");
      }
    }
  }, [supabaseUrlKey, navigate]);
};

export default useHandleSession;
