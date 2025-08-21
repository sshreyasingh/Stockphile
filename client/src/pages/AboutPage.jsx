import React from "react";
import { motion } from "framer-motion";
import { FaCloud, FaLock, FaRocket, FaUsers } from "react-icons/fa";

const AboutPage = () => {
  return (
    // <div className="min-h-screen w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
    <div className="min-h-screen min-w-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center px-4 m-0">

      
      {/* Floating Background Icons */}
      <motion.div
        className="absolute top-20 left-10 text-7xl text-white/30"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <FaCloud />
      </motion.div>

      <motion.div
        className="absolute bottom-32 right-16 text-7xl text-yellow-300/30"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      >
        <FaLock />
      </motion.div>

      <motion.div
        className="absolute top-40 right-1/4 text-7xl text-green-300/30"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <FaRocket />
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl max-w-4xl w-full p-10 text-center"
      >
        <h1 className="text-4xl font-bold text-purple-700 mb-6">
          About <span className="text-pink-600">Stockphile 🚀</span>
        </h1>
        
        <p className="text-gray-700 text-lg mb-6">
          Stockphile is a modern, secure, and user-friendly cloud storage solution 
          inspired by Google Drive. Upload, organize, preview, and share your files 
          with ease — all from one platform.
        </p>

        {/* Mission Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
          <div className="p-6 bg-white rounded-xl shadow hover:scale-105 transition">
            <FaCloud className="text-4xl text-blue-500 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-purple-700">Our Mission</h2>
            <p className="text-gray-600 mt-2">
              To provide a fast, reliable, and secure way to manage your files online.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:scale-105 transition">
            <FaLock className="text-4xl text-green-500 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-purple-700">Secure & Private</h2>
            <p className="text-gray-600 mt-2">
              Built with authentication, encryption, and privacy-first design.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:scale-105 transition">
            <FaRocket className="text-4xl text-pink-500 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-purple-700">Fast & Reliable</h2>
            <p className="text-gray-600 mt-2">
              Powered by Supabase, Node.js, and React for speed and scalability.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:scale-105 transition">
            <FaUsers className="text-4xl text-yellow-500 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-purple-700">Built By</h2>
            <p className="text-gray-600 mt-2">
              👩‍💻 Shreya Singh — B.Tech CSE ’27 | MERN Developer 
            </p>
          </div>
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 px-6 py-3 bg-purple-600 text-white font-semibold rounded-full border-[5px] border-white shadow-lg hover:bg-purple-700 transition"
        ><a href="http://localhost:5173/" class="text-white ">
    🚀 Get Started
  </a>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AboutPage;
