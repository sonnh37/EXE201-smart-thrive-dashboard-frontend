import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import * as z from "zod";
import { FormValues } from "./signin-form";
import { CiUser } from "react-icons/ci";

const formSchema = z.object({
  username: z.string(),
});

interface SignupSelectMethodFormProps {
  formValues: FormValues;
  updateFormValues: (values: FormValues) => void;
  handleNextStep: () => void;
  handlePrevStep: () => void;
}

const SignupSelectMethodForm: React.FC<SignupSelectMethodFormProps> = ({
  formValues,
  updateFormValues,
  handleNextStep,
  handlePrevStep,
}) => {
  const handlePersonalizeClick = () => {
    // Xử lý khi người dùng chọn cá nhân hóa
    console.log("Chọn cá nhân hóa");
    handleNextStep(); // Tiến tới bước tiếp theo
  };

  const handleGmailClick = () => {
    // Xử lý khi người dùng chọn Gmail
    console.log("Chọn Gmail");
    handleNextStep(); // Tiến tới bước tiếp theo
  };

  return (
    <div className="w-[90%] space-y-6 m-4">
      <h2 className="text-lg font-bold">Chọn phương thức đăng ký</h2>
      <div className="flex flex-col space-y-4">
        <motion.button
          onClick={handleGmailClick}
          className="inline-flex justify-center items-center px-3 py-2 rounded-full border-[1px] border-foreground"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }} // Phóng to nhẹ khi hover
          whileTap={{ scale: 0.95 }} // Co lại khi nhấn
        >
          <CiUser className="mr-2 h-6 w-6" />
          Sign up with personalize
        </motion.button>
        <motion.button
          onClick={handleGmailClick}
          className="inline-flex justify-center items-center px-3 py-2 rounded-full border-[1px] border-foreground"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }} // Phóng to nhẹ khi hover
          whileTap={{ scale: 0.95 }} // Co lại khi nhấn
        >
          <FcGoogle className="mr-2 h-6 w-6" />
          Sign up with google
        </motion.button>
      </div>
      <div className="flex justify-end">
        <Button onClick={handlePrevStep} className="rounded-full">
          Quay lại
        </Button>
      </div>
    </div>
  );
};

export default SignupSelectMethodForm;
