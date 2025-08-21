import React from "react";
import { motion } from "framer-motion";
import { FaUpload, FaFolder, FaFileAlt, FaShareAlt } from "react-icons/fa";

const FeaturesPage = () => {
  const features = [
    {
      icon: <FaUpload className="text-4xl text-purple-600" />,
      title: "Upload Files",
      description: "Securely upload and store your files with high speed and reliability.",
    },
    {
      icon: <FaFolder className="text-4xl text-purple-600" />,
      title: "File Management",
      description: "Store your files with the ability to instantly download or delete them anytime",
    },
    {
      icon: <FaFileAlt className="text-4xl text-pink-600" />,
      title: "Preview Files",
      description: "Preview documents and images directly without downloading.",
    },
    {
      icon: <FaShareAlt className="text-4xl text-green-600" />,
      title: "Share Links",
      description: "Easily share your files with secure and customizable links.",
    },
  ];

  return (
    // <div className="min-h-screen w-full bg-gradient-to-r from-purple-500 to-blue-500 flex flex-col items-center justify-center px-4">
    <div className="min-h-screen min-w-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center px-4 m-0">

        

      <motion.div
        className="absolute bottom-32 right-16 text-7xl text-yellow-300/40"
        whileHover={{ scale: 1.2, rotate: -15 }}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      >
        <FaFolder />
      </motion.div>

      <motion.div
        className="absolute top-20 right-1/4 text-7xl text-green-300/40"
        whileHover={{ scale: 1.2, rotate: 10 }}
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <FaUpload />
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/3 text-7xl text-blue-300/40"
        whileHover={{ scale: 1.2, rotate: -10 }}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <FaFileAlt />
      </motion.div>

      <h1 className="text-4xl font-bold text-white mb-10 flex items-center">
        🚀 App Features
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-6xl w-full">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white/80 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition-transform"
          >
            {feature.icon}
            <h2 className="text-xl font-semibold mt-4 text-purple-700">{feature.title}</h2>
            <p className="mt-2 text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesPage;
