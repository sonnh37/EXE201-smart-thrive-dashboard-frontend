import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const SigninPasswordForm = () => {
  return (
    <motion.div
      key="login" // Đặt key cho từng trang
    // Thay đổi thời gian chuyển động nếu cần
    >
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form>
        <input type="password" placeholder="Password" className="mb-4" />
        <button type="submit" className="btn">Login</button>
      </form>
      <p>
        Don't have an account?{" "}
        <a href="/auth/register" className="text-blue-600">Register</a>
      </p>
    </motion.div>
  );
};

export default SigninPasswordForm;
