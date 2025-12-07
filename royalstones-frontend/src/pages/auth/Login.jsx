import { useState } from "react";
import { auth } from "../../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuthStore } from "../../store/authStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);

  const login = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const token = await res.user.getIdToken();

      setUser(res.user);
      setToken(token);

      alert("Login success!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-6 border w-96">
        <h2 className="text-xl mb-4">Login</h2>

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
          onClick={login}
          className="bg-black text-white p-2 w-full"
        >
          Login
        </button>
      </div>
    </div>
  );
}
