import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-4xl font-bold mb-2">Page not found</h1>
      <p className="text-gray-400 mb-6 text-center">
        That URL does not match any page in this app.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-indigo-600 rounded-lg font-medium hover:bg-indigo-500"
      >
        Go home
      </Link>
    </div>
  );
}
