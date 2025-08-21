
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCloud, FaFolder, FaUpload, FaFileAlt } from "react-icons/fa";

export default function LandingPage() {
  return (
    <div className="relative h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white overflow-hidden">

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full flex justify-between items-center p-6 text-white border-b border-yellow bg-[#FFE66D]">
        <h2 className="text-2xl font-serif text-purple-800">STOCKPHILE</h2>
        <div className="space-x-6 text-black font-medium">
          <Link
          to="/features"
          className="px-6 py-3 bg-yellow-100 text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition"
        >
          View Features
        </Link>
          <Link
          to="/about"
          className="px-6 py-3 bg-yellow-100 text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition"
        >About
        </Link>
        </div>
      </nav>

      {/* Floating Background Icons */}
      <motion.div
        className="absolute top-20 left-10 text-7xl text-white/40"
        whileHover={{ scale: 1.2, rotate: 15 }}
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <FaCloud />
      </motion.div>

      <motion.div
        className="absolute bottom-32 right-16 text-7xl text-yellow-300/40"
        whileHover={{ scale: 1.2, rotate: -15 }}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      >
        <FaFolder />
      </motion.div>

      <motion.div
        className="absolute top-40 right-1/4 text-7xl text-green-300/40"
        whileHover={{ scale: 1.2, rotate: 10 }}
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <FaUpload />
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-1/3 text-7xl text-blue-300/40"
        whileHover={{ scale: 1.2, rotate: -10 }}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <FaFileAlt />
      </motion.div>

      {/* Hero Section */}
      <h1 className="text-5xl font-bold mb-4 relative z-10">
        Welcome to <span className="text-yellow-300">Stockphile 🚀</span>
      </h1>
      <p className="text-lg mb-8 relative z-10">
        Your personal cloud storage — secure, fast, and easy to use.
      </p>

      <div className="flex space-x-6 relative z-10">
        <a
          href="http://localhost:3001/user/login"
          className="px-6 py-3 bg-white text-indigo-600 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          Login
        </a>
        <a
          href="http://localhost:3001/user/register"
          className="px-6 py-3 bg-white text-indigo-600 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          Register
        </a>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-sm text-gray-200">
        © 2025 Stockphile | All rights reserved
      </footer>
    </div>
  );
}

