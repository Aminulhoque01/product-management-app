"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";
import { clearToken } from "../../../redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(clearToken());
    router.push("/login");
  };

  if (!token) return null;

  return (
    <div className="bg-gray-300  shadow-sm p-4 ">
      <div className="w-full container flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary">Product Management</h1>
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-700 flex items-center gap-1"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
