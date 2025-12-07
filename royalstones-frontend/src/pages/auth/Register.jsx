import { useState } from "react";
import { auth } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registered successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-6 border w-96">
        <h2 className="text-xl mb-4">Register</h2>

        <input
          placeholder="Email"
          className="border p-2 w-full mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={register}
          className="bg-black text-white p-2 w-full"
        >
          Register
        </button>
      </div>
    </div>
  );
}
