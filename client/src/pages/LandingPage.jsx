import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import useAuth from "../contexts/useAuth";
import loginImage from "../assets/images/login-img.png";

function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  return (
    <div className="h-screen w-screen bg-[#fafafa] p-[1.5%]">
      <div className="flex h-full w-full flex-col justify-between md:flex-row">
        <aside className="hidden overflow-clip rounded-2xl md:block md:h-full md:w-[49%]">
          <img src={loginImage} alt="" />
        </aside>

        <main className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-[#ebebeb] bg-transparent md:h-full md:w-[49%]">
          <div className="h-1/3 w-7/10">
            <h1 className="mb-5 text-[2.625rem] font-bold text-[#212529]">
              Productive Mind
            </h1>

            <p>
              With only the features you need, Organic Mind is customized for
              individuals seeking a stress-free way to stay focused on their
              goals, projects, and tasks.
            </p>

            <Link to="/signup">
              <button
                type="button"
                className="my-5 h-10 w-full cursor-pointer rounded-md bg-[#ffd43b] font-bold text-[#212529] hover:brightness-95 disabled:opacity-50"
              >
                Get Started
              </button>
            </Link>

            <div className="flex w-full justify-center">
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

export default LandingPage;
