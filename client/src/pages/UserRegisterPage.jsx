import { Link, useSearchParams } from "react-router-dom";

export default function UserRegisterPage() {
  const [params] = useSearchParams();
  const error = params.get("error");

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center text-white overflow-hidden"
      style={{
        background:
          "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
      }}
    >
      <div className="absolute top-20 left-10 text-7xl text-white/30 animate-bounce">
        ☁️
      </div>
      <div className="absolute bottom-32 right-16 text-7xl text-yellow-300/30 animate-pulse">
        📂
      </div>
      <div className="absolute top-40 right-[12%] text-7xl text-green-300/30 animate-bounce">
        ⬆️
      </div>
      <div className="absolute bottom-20 left-1/3 text-7xl text-blue-300/30 animate-pulse">
        📄
      </div>

      <Link
        to="/"
        className="fixed top-6 left-6 inline-block px-6 py-3 text-lg font-bold text-white bg-pink-300 rounded-3xl shadow-lg transform transition duration-200 hover:scale-110 hover:bg-pink-400 z-20"
      >
        <i className="fa-solid fa-arrow-left" /> Back
      </Link>

      <form
        action="/user/register"
        method="post"
        className="bg-white/20 backdrop-blur-lg shadow-lg rounded-2xl p-8 w-full max-w-[400px] relative z-10 mx-4"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-300">
          Register ✨
        </h2>

        {error ? (
          <p
            className="mb-4 text-sm text-center text-red-200 bg-red-900/40 rounded-lg py-2 px-3"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div className="mb-4">
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-white"
          >
            Full Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <i className="fa-solid fa-user" />
            </span>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="John Doe"
              required
              autoComplete="username"
              className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-white"
          >
            Email
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <i className="fa-solid fa-envelope" />
            </span>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            />
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-white"
          >
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <i className="fa-solid fa-lock" />
            </span>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="•••••••••"
              required
              autoComplete="new-password"
              className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-yellow-300 text-indigo-700 font-semibold rounded-xl shadow-md hover:scale-105 transition"
        >
          Register
        </button>

        <p className="text-sm text-center mt-4 text-white/90">
          Already have an account?{" "}
          <Link to="/user/login" className="text-yellow-300 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
