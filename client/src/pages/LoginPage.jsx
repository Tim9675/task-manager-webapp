import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../api/authApi.js";
import { useAuth } from "../context/AuthContext.jsx";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setUser } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const response = await login({
        email,
        password,
      });
      localStorage.setItem("token", response.token);
      setUser(response.user);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen bg-[#fafafa] p-[1.5%]">
      <div className="flex h-full w-full justify-between">
        {/* Image placeholder */}
        <div className="rounded-2xl bg-[#111111] md:h-full md:w-[49%]"></div>
        {/* Login form */}
        <main className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-[#ebebeb] bg-transparent md:h-full md:w-[49%]">
          <div className="h-1/2 w-2/3">
            <form onSubmit={handleSubmit} className="flex h-65 w-full flex-col">
              <h2 className="mb-5 text-[2.625rem] font-bold text-[#212529]">
                Sign in{" "}
              </h2>
              {error &
              <p className="mx-2 mb-2 text-sm text-red-500">{error}</p>}
              <input
                type="email"
                value={email}
                className="mx-2 my-1.5 h-10 rounded-md border"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                value={password}
                className="mx-2 my-1.5 h-10 rounded-md border"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="mx-2 my-4.5 h-10 rounded-md bg-[#ffd43b] font-bold text-[#212529] disabled:opacity-50"
              >
                Sign in
              </button>
            </form>
            <div className="flex h-15 w-full flex-col items-center justify-between">
              <div className="flex w-full items-center justify-between">
                <hr className="inline-block h-2 w-55 border-[#dddddd]" />
                <span className="text-[#7c7c7c]">or</span>
                <hr className="inline-block h-2 w-55 border-[#dddddd]" />
              </div>
              <a href="/" className="font-bold text-[#444444]">
                Don't have an account? Sign up
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default LoginPage;
