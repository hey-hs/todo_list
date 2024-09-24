import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/todo");
    } catch (error) {
      console.error(error);
      alert("Invalid email or password")
    }
  };
  
  return (
   <> <div className="mb-4 ml-20 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-5xl dark:text-black"> <h1>Get Started!</h1></div>
   <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 mb-4 border rounded"
      />
      <button
        onClick={handleLogin}
        className="w-full bg-indigo-500 text-white p-2 rounded"
      >
        Login
      </button>
      <p>Don't have an account? <Link className={"font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline"}  to ="/"> Register </Link></p>
    </div> </> 
  );
};

export default Login;
