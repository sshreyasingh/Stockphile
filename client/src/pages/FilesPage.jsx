import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function FilesPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/my-files", {
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        if (res.status === 401 || res.status === 403) {
          navigate("/user/login", { replace: true });
          return;
        }
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || `Failed to load files (${res.status})`);
        }
        if (!cancelled) setFiles(data.files || []);
      } catch (e) {
        if (!cancelled) {
          setError(e.message || "Could not load files");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div
      className="min-h-screen w-screen flex flex-col items-center py-12 px-4 text-white relative"
      style={{
        background:
          "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
      }}
    >
      <div className="absolute top-20 left-10 text-7xl text-white/30 animate-bounce pointer-events-none">
        ☁️
      </div>
      <div className="absolute bottom-32 right-16 text-7xl text-yellow-300/30 animate-pulse pointer-events-none">
        📂
      </div>
      <div className="absolute top-40 right-[12%] text-7xl text-green-300/30 animate-bounce pointer-events-none">
        ⬆️
      </div>
      <div className="absolute bottom-20 left-[12%] text-7xl text-blue-300/30 animate-pulse pointer-events-none">
        📄
      </div>

      <Link
        to="/home"
        className="fixed top-6 left-6 z-20 inline-block px-6 py-3 text-lg font-bold text-white bg-pink-300 rounded-3xl shadow-lg transform transition duration-200 hover:scale-110 hover:bg-pink-400"
      >
        <i className="fa-solid fa-arrow-left" /> Back
      </Link>

      <h1 className="text-4xl font-extrabold text-yellow-400 mb-10 drop-shadow-lg mt-8 text-center">
        📂 Your Uploaded Files — {loading ? "…" : files.length}
      </h1>

      {loading ? (
        <p className="text-lg">Loading…</p>
      ) : error ? (
        <p className="text-red-200 bg-red-900/40 px-4 py-2 rounded-lg">{error}</p>
      ) : (
        <ul className="w-full max-w-5xl bg-white/40 backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-6">
          {files.length === 0 ? (
            <li className="text-center text-gray-800">No files yet. Upload from the home page.</li>
          ) : (
            files.map((file) => (
              <li
                key={file.name}
                className="flex flex-wrap items-center justify-between gap-3 bg-white/70 rounded-xl shadow p-4 hover:shadow-lg transition"
              >
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-mono text-purple-700 hover:underline flex items-center min-w-0"
                >
                  <i className="fa-regular fa-file shrink-0" />
                  <span className="ml-2 truncate">{file.name}</span>
                </a>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`/download/${encodeURIComponent(file.name)}`}
                    className="px-4 py-2 rounded-lg bg-[#73A6AD] text-white font-medium hover:bg-[#AFD0BF] transition"
                  >
                    ⬇ Download
                  </a>
                  <form
                    action={`/delete/${encodeURIComponent(file.name)}`}
                    method="POST"
                  >
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-[#982649] text-white font-medium hover:bg-red-600 transition"
                    >
                      🗑 Delete
                    </button>
                  </form>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
