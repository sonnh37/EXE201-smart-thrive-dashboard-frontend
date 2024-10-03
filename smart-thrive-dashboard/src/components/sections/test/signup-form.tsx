import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const SignupForm = () => {
  return (
    <motion.div
      key="register" // Đặt key cho từng trang
    // Thay đổi thời gian chuyển động nếu cần
    >
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form>
        <input type="text" placeholder="Username" className="mb-2" />
        <input type="email" placeholder="Email" className="mb-2" />
        <input type="password" placeholder="Password" className="mb-4" />
        <button type="submit" className="btn">Register</button>
      </form>
      <p>
        Already have an account?{" "}
        <a href="/auth/login" className="text-blue-600">Login</a>
      </p>
    </motion.div>
  );
};

export default SignupForm;
