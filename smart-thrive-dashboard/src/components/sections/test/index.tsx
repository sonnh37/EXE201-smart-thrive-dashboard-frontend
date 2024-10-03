import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SignupForm from "./signup-form";
import SigninUsernameForm from "./signin-username-form"; // Form nhập username
import SigninPasswordForm from "./signin-password-form"; // Form nhập password

// Các biến định nghĩa animation
const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 300 : -300, // Swipe từ trái hoặc phải
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 300 : -300, // Khi exit, đi về trái/phải
      opacity: 0,
    };
  },
};

// Các form cần hiển thị
const forms = [
  {
    key: "login",
    label: "Login",
    steps: [
      { key: "username", component: SigninUsernameForm },
      { key: "password", component: SigninPasswordForm },
    ],
  },
  { key: "register", label: "Register", component: SignupForm },
];

// Tạo kiểu dữ liệu cho form
interface FormValues {
  username?: string;
  password?: string;
}

const TestPage = () => {
  const [[currentStep, direction], setCurrentStep] = useState([0, 0]); // Thêm direction để biết hướng
  const [currentForm, setCurrentForm] = useState(forms[0].key); // Mặc định là form login

  // Lưu trữ giá trị của form
  const [formValues, setFormValues] = useState<FormValues>({});

  const handleNextStep = () => {
    setCurrentStep([currentStep + 1, 1]); // Hướng là 1 khi tiến
  };

  const handlePrevStep = () => {
    setCurrentStep([currentStep - 1, -1]); // Hướng là -1 khi lùi
  };

  const updateFormValues = (newValues: Partial<FormValues>) => {
    setFormValues((prev) => ({
      ...prev,
      ...newValues,
    }));
  };

  const currentFormData = forms.find((form) => form.key === currentForm);
  const CurrentComponent = currentFormData?.steps
    ? currentFormData.steps[currentStep].component
    : currentFormData?.component;

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md overflow-hidden">
        {forms.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => {
              setCurrentForm(key);
              setCurrentStep([0, 0]); // Reset step và direction khi chuyển form
            }}
            className={`mr-4 p-2 rounded ${
              currentForm === key ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            {label}
          </button>
        ))}

        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={`${currentForm}-${currentStep}`} // Đặt key dựa trên form và bước
            custom={direction}
            className="min-h-[200px]"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            {CurrentComponent && (
              <CurrentComponent
                formValues={formValues}
                updateFormValues={updateFormValues}
              />
            )}
            {currentForm === "login" && currentFormData?.steps && (
              <div className="flex justify-between mt-4">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrevStep}
                    className="p-2 bg-gray-300 rounded"
                  >
                    Previous
                  </button>
                )}
                {currentStep < currentFormData.steps.length - 1 ? (
                  <button
                    onClick={handleNextStep}
                    className="p-2 bg-blue-500 text-white rounded"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="p-2 bg-blue-500 text-white rounded"
                  >
                    Login
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TestPage;
