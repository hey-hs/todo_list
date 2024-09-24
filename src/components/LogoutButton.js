import { signOut } from "firebase/auth";  // Import the signOut function
import { auth } from "../firebase";  // Import your Firebase Auth instance
import { useNavigate } from "react-router-dom";  // Import useNavigate for redirection

const LogoutButton = () => {
  const navigate = useNavigate();  // Hook for navigation

  const handleLogout = async () => {
    try {
      await signOut(auth);  // Sign out from Firebase
      navigate("/login");  // Redirect to the login page after logout
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="bg-red-500 absolute top-2 right-80 text-white p-2 rounded hover:bg-red-600 "
    >
      Logout
    </button>
  );
};

export default LogoutButton;
