import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Mail, Lock, User, CheckCircle, XCircle } from "lucide-react";

const AuthForm = () => {
  const { login, register, isAuthenticated, user } = useAppContext();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState([]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
    } catch (err) {
      if (err?.response) {
        const errorRes = err.response?.data;
        setErrors(
          errorRes?.errors || [
            { msg: errorRes?.message || "Something went wrong" },
          ]
        );
      } else {
        console.error("Unexpected error:", err); // Helpful in case of unknown issues
        setErrors([{ msg: "Unexpected error occurred" }]);
      }
    }
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isStrongPassword = (password) => password.length >= 6;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Image */}
      <div className="w-full md:w-2/3 h-64 md:h-auto relative">
        <img
          src="/login-image.png"
          alt="auth"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/3 flex flex-col items-center justify-center px-4 py-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo and Branding */}
          <div className="flex flex-col items-center mb-6">
            <img
              src="/logo.png"
              alt="WorkBridge Logo"
              className="w-16 h-16 mb-2"
            />
            <h1 className="text-3xl font-bold text-indigo-700">WorkBridge</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 w-full">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {mode === "login" ? "Login" : "Register"}
            </h2>

            {errors.length > 0 && (
              <ul className="mb-4 text-sm text-red-500">
                {errors.map((e, i) => (
                  <li key={i}>{e.msg}</li>
                ))}
              </ul>
            )}

            {mode === "register" && (
              <div className="relative mb-4">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2 border rounded-full border-gray-300"
                  required
                />
              </div>
            )}

            <div className="relative mb-4">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-2 border rounded-full ${
                  form.email && !isValidEmail(form.email)
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                required
              />
              {form.email &&
                (isValidEmail(form.email) ? (
                  <CheckCircle
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                  />
                ) : (
                  <XCircle
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
                  />
                ))}
            </div>

            <div className="relative mb-6">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-2 border rounded-full ${
                  form.password && !isStrongPassword(form.password)
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                required
              />
              {form.password &&
                (isStrongPassword(form.password) ? (
                  <CheckCircle
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                  />
                ) : (
                  <XCircle
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
                  />
                ))}
            </div>

            {mode === "register" && (
              <div className="flex gap-4 flex-col sm:flex-row mb-6">
                <button
                  type="button"
                  onClick={async () => {
                    setErrors([]);
                    try {
                      await register({ ...form, role: "user" });
                    } catch (err) {
                      const errorRes = err.response?.data;
                      setErrors(
                        errorRes?.errors || [
                          {
                            msg:
                              errorRes?.message || "User registration failed",
                          },
                        ]
                      );
                    }
                  }}
                  className="w-full bg-indigo-600 text-white py-2 rounded-full hover:bg-indigo-700 transition-all"
                >
                  Register as User
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    setErrors([]);
                    try {
                      await register({ ...form, role: "freelancer" });
                    } catch (err) {
                      const errorRes = err.response?.data;
                      setErrors(
                        errorRes?.errors || [
                          {
                            msg:
                              errorRes?.message ||
                              "Freelancer registration failed",
                          },
                        ]
                      );
                    }
                  }}
                  className="w-full bg-orange-500 text-white py-2 rounded-full hover:bg-orange-600 transition-all"
                >
                  Register as Freelancer
                </button>
              </div>
            )}

            {mode === "login" && (
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full sm:w-[60%] bg-indigo-600 text-white py-2 rounded-full hover:bg-indigo-700 transition-all"
                >
                  Login
                </button>
              </div>
            )}

            <p className="text-sm text-center mt-4">
              {mode === "login"
                ? "Don’t have an account?"
                : "Already have an account?"}{" "}
              <span
                onClick={() => {
                  setErrors([]);
                  setMode(mode === "login" ? "register" : "login");
                }}
                className="text-indigo-600 hover:underline cursor-pointer"
              >
                {mode === "login" ? "Register" : "Login"}
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
