import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../api/authApi.js";
import { useAuth } from "../contexts/AuthContext.jsx";

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const response = await register({
        name,
        email,
        password,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      localStorage.setItem("token", response.token);
      setUser(response.user);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen bg-[#fafafa] p-[1.5%]">
      <div className="flex h-full w-full justify-between">
        {/* Image placeholder */}
        <div className="rounded-2xl bg-[#111111] md:h-full md:w-[49%]"></div>
        {/* Signup form */}
        <main className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-[#ebebeb] bg-transparent md:h-full md:w-[49%]">
          <div className="h-2/3 w-2/3">
            <form onSubmit={handleSubmit} className="flex w-full flex-col">
              <h2 className="mb-5 text-[2.625rem] font-bold text-[#212529]">
                Sign up
              </h2>
              <label
                htmlFor="name"
                className="mx-2 mb-1 text-sm font-semibold text-[#212529]"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                className="mx-2 my-1.5 h-10 rounded-md border p-1"
                onChange={(e) => setName(e.target.value)}
              />
              <label
                htmlFor="email"
                className="mx-2 mb-1 text-sm font-semibold text-[#212529]"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                className="mx-2 my-1.5 h-10 rounded-md border p-1"
                onChange={(e) => setEmail(e.target.value)}
              />
              <label
                htmlFor="password"
                className="mx-2 mb-1 text-sm font-semibold text-[#212529]"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                className="mx-2 my-1.5 h-10 rounded-md border p-1"
                onChange={(e) => setPassword(e.target.value)}
              />
              <pre
                className="line-clamp mx-2 text-sm text-wrap text-red-500"
                style={{ visibility: error ? "visible" : "hidden" }}
              >
                {error}
              </pre>
              <button
                type="submit"
                disabled={loading}
                className="mx-2 mt-3 mb-4.5 h-10 cursor-pointer rounded-md bg-[#ffd43b] font-bold text-[#212529] hover:brightness-95 disabled:opacity-50"
              >
                Sign up
              </button>
            </form>
            <div className="flex h-15 w-full flex-col items-center justify-between">
              <div className="flex w-full items-center justify-between">
                <hr className="inline-block h-2 w-55 border-[#dddddd]" />
                <span className="text-[#7c7c7c]">or</span>
                <hr className="inline-block h-2 w-55 border-[#dddddd]" />
              </div>
              <p className="className=font-bold text-[#444444]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="hover:text-blue-500 focus:text-blue-500"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SignupPage;
