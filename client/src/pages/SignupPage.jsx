import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeClosed } from "lucide-react";

import { useAuth } from "../contexts/AuthContext.jsx";
import loginImage from "../assets/images/login-img.png";

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigate = useNavigate();
  const { user, signUp } = useAuth();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await signUp({
        name,
        email,
        password,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
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
        <aside className="overflow-clip rounded-2xl md:h-full md:w-[49%]">
          <img src={loginImage} alt="" />
        </aside>

        <main className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-[#ebebeb] bg-transparent md:h-full md:w-[49%]">
          <div className="h-2/3 w-2/3">
            <form onSubmit={handleSubmit} className="flex w-full flex-col">
              <h1 className="mb-5 text-[2.625rem] font-bold text-[#212529]">
                Sign up
              </h1>

              <label
                htmlFor="name"
                className="mx-2 mb-1 text-sm font-semibold text-[#212529]"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                autoFocus
                autoComplete="name"
                required
                className="mx-2 my-1.5 h-10 rounded-md border p-1"
                onChange={(e) => setName(e.target.value)}
                aria-invalid={!!error}
                aria-describedby="signup-error"
              />

              <label
                htmlFor="email"
                className="mx-2 mb-1 text-sm font-semibold text-[#212529]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                autoComplete="email"
                required
                className="mx-2 my-1.5 h-10 rounded-md border p-1"
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!error}
                aria-describedby="signup-error"
              />

              <label
                htmlFor="password"
                className="mx-2 mb-1 text-sm font-semibold text-[#212529]"
              >
                Password
              </label>
              <div className="relative mx-2 my-1.5 flex h-10 items-center">
                <input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  autoComplete="new-password"
                  required
                  className="h-full w-full rounded-md border p-1"
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!error}
                  aria-describedby="signup-error"
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
                id="signup-error"
                className={`line-clamp mx-2 text-sm text-wrap text-red-600 ${error ? "visible" : "invisible"}`}
                role="alert"
              >
                {error}
              </p>

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
                <span className="text-[#212529]">or</span>
                <hr className="inline-block h-2 w-55 border-[#dddddd]" />
              </div>

              <p className="text-[#444444]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold hover:text-blue-500 focus:text-blue-500"
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
