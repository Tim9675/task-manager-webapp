import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeClosed } from "lucide-react";
import { Eye } from "lucide-react";

import { login } from "../api/authApi.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import loginImage from "../assets/images/login-img.png";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

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
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  function togglePasswordVisibility() {
    setIsPasswordVisible((prev) => !prev);
  }

  return (
    <div className="h-screen w-screen bg-[#fafafa] p-[1.5%]">
      <div className="flex h-full w-full justify-between">
        {/* Image */}
        <aside className="overflow-clip rounded-2xl md:h-full md:w-[49%]">
          <img src={loginImage} alt="" />
        </aside>
        {/* Login */}
        <main className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-[#ebebeb] bg-transparent md:h-full md:w-[49%]">
          <div className="h-1/2 w-2/3">
            <form onSubmit={handleSubmit} className="flex w-full flex-col">
              <h1 className="mb-5 text-[2.625rem] font-bold text-[#212529]">
                Sign in
              </h1>

              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                autoFocus
                autoComplete="email"
                className="mx-2 my-1.5 h-10 rounded-md border p-1"
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!error}
                aria-describedby="login-error"
              />

              <div className="relative mx-2 my-1.5 flex h-10 items-center">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  autoComplete="current-password"
                  className="h-full w-full rounded-md border p-1"
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!error}
                  aria-describedby="login-error"
                />

                <button
                  type="button"
                  className="absolute right-1 flex size-7.5 cursor-pointer items-center justify-center"
                  onClick={togglePasswordVisibility}
                  aria-label={
                    isPasswordVisible ? "Hide password" : "Show password"
                  }
                  aria-pressed={isPasswordVisible}
                >
                  {isPasswordVisible ? <Eye /> : <EyeClosed />}
                </button>
              </div>

              <p
                id="login-error"
                className="mx-2 my-2.5 h-2.5 text-sm text-red-500"
                style={{ visibility: error ? "visible" : "hidden" }}
                role="alert"
              >
                {error}
              </p>
              <button
                type="submit"
                disabled={loading}
                className="mx-2 mt-2.5 mb-2.5 h-10 cursor-pointer rounded-md bg-[#ffd43b] font-bold text-[#212529] hover:brightness-95 disabled:opacity-50"
              >
                Sign in
              </button>
            </form>
            <div className="flex h-15 w-full flex-col items-center justify-between">
              <div className="flex w-full items-center justify-between">
                <hr className="inline-block h-2 w-55 border-[#dddddd]" />
                <span className="text-[#212529]">or</span>
                <hr className="inline-block h-2 w-55 border-[#dddddd]" />
              </div>
              <p className="text-[#444444]">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-bold hover:text-blue-500 focus:text-blue-500"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default LoginPage;
