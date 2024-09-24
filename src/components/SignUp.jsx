import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("User signed up");
    } catch (error) {
      console.error(error);
    }
  };

  return (
   <> <div className="mb-4 ml-7 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-5xl dark:text-black"> <h1>Welcome to TO-DO List.</h1><h4>Optimize your Productivity!</h4> </div>
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
     
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
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
        onClick={handleSignUp}
        className="w-full bg-indigo-500 text-white p-2 rounded"
      >
        Sign Up
      </button>
      <p>Already have an account? <Link className={"font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline"}  to ="Login"> Login </Link></p>
    </div> </>
  );
};

export default SignUp;
