import { SignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Sign in to continue to your account
            </p>
          </div>
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
                card: "bg-transparent shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border border-gray-300",
                formFieldInput:
                  "rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                footerActionLink: "text-blue-600 hover:text-blue-700",
              },
            }}
            routing="path"
            path="/sign-in"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage; 