import { useState } from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [mainStatus, setMainStatus] = useState("");

  const setBoth = (text, cls) => {
    setStatusMessage(text);
    setMainStatus(text);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fileInput = e.target.querySelector('input[type="file"]');
    const file = fileInput?.files?.[0];
    if (!file) {
      setBoth("⚠️ Please select a file first!", "text-yellow-600");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setBoth("⏳ Uploading...", "text-blue-600");
      const res = await fetch("/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      const data = res.headers.get("content-type")?.includes("application/json")
        ? await res.json().catch(() => ({}))
        : {};

      if (res.ok) {
        setBoth("✅ File uploaded successfully!", "text-white");
        setPopupOpen(false);
        fileInput.value = "";
        return;
      }

      const msg =
        data.error ||
        data.message ||
        `Upload failed (${res.status})`;
      throw new Error(msg);
    } catch (err) {
      console.error(err);
      setBoth("❌ Failed to upload file.", "text-red-700");
    }
  };

  return (
    <div
      className="relative min-h-screen w-screen flex flex-col items-center justify-center text-white overflow-hidden"
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
      <div className="absolute bottom-20 left-[12%] text-7xl text-blue-300/30 animate-pulse">
        📄
      </div>
      <div className="absolute top-10 right-1/4 text-7xl text-purple-300/30 animate-spin">
        🔒
      </div>
      <div className="absolute bottom-[10%] right-1/3 text-7xl text-red-300/30 animate-bounce">
        📤
      </div>
      <div className="absolute top-1/2 right-[15%] text-7xl text-teal-300/30 animate-pulse">
        🔑
      </div>

      <Link
        to="/user/login"
        className="fixed top-6 left-6 z-20 inline-block px-6 py-3 text-lg font-bold text-white bg-pink-300 rounded-3xl shadow-lg transform transition duration-200 hover:scale-110 hover:bg-pink-400"
      >
        <i className="fa-solid fa-arrow-left" /> Back
      </Link>

      <div className="flex flex-col items-center relative z-10">
        <button
          type="button"
          onClick={() => setPopupOpen(true)}
          className="bg-yellow-300 hover:bg-yellow-400 text-white font-bold text-2xl rounded-3xl shadow-lg flex items-center justify-center w-52 h-52 transform transition-transform duration-200 hover:scale-110"
        >
          UPLOAD FILE
        </button>

        <Link
          to="/files"
          className="mt-[90px] bg-blue-300 hover:bg-blue-400 text-white font-bold text-2xl py-6 px-20 rounded-3xl shadow-lg transform transition-transform duration-200 hover:scale-110 text-center"
        >
          GO TO FILES
        </Link>
      </div>

      {mainStatus ? (
        <p className={`mt-4 text-lg font-medium relative z-10 ${mainStatus.startsWith("✅") ? "text-white" : ""}`}>
          {mainStatus}
        </p>
      ) : null}

      {popupOpen ? (
        <div className="backdrop-blur-md fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-yellow-300 rounded-2xl shadow-lg p-6 w-full max-w-[420px] relative mx-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Upload your file
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-56 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-200 transition"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <i className="ri-upload-cloud-2-line text-4xl text-gray-500 mb-3" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF, PDF (max 10MB)
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    name="file"
                  />
                </label>
              </div>

              {statusMessage ? (
                <p className="text-center mt-3 text-sm font-medium text-gray-800">
                  {statusMessage}
                </p>
              ) : null}

              <div className="flex justify-center mt-5">
                <button
                  type="submit"
                  className="bg-[#C124A4] hover:bg-[#A41A8B] text-white font-bold py-2 px-4 rounded"
                >
                  Upload
                </button>
              </div>
            </form>

            <button
              type="button"
              className="absolute top-3 right-3 text-gray-500 text-xl hover:text-gray-700"
              onClick={() => setPopupOpen(false)}
              aria-label="Close"
            >
              <i className="ri-close-line" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
