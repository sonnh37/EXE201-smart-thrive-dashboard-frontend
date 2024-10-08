import {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {User} from "@/types/user";
import SignupPersonalizeForm from "./signup-personalize-form";
import SignupSelectMethodForm from "./signup-select-method";
import SignupGmailNewPasswordForm from "./signup-gmail-new-password";

const variants = {
    enter: (direction: number) => {
        return {
            x: direction > 0 ? 300 : -300,
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
            x: direction < 0 ? 300 : -300,
            opacity: 0,
        };
    },
};

const forms = [
    {
        key: "register",
        label: "Register",
        steps: [
            {key: "select", component: SignupSelectMethodForm},
            {key: "newpassword", component: SignupGmailNewPasswordForm},
            {key: "personalize", component: SignupPersonalizeForm},
        ],
    },
];

export interface FormValues {
    username?: string;
    password?: string;
    user?: User;
    googleToken?: string;
}

export default function SignUpForm() {
    const [[currentStep, direction], setCurrentStep] = useState([0, 0]);
    const [currentForm, setCurrentForm] = useState(forms[0].key);

    const [formValues, setFormValues] = useState<FormValues>({});

    const handleNextStep = () => {
        setCurrentStep([currentStep + 1, 1]);
    };

    const handlePrevStep = () => {
        setCurrentStep([currentStep - 1, -1]);
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
        : undefined;
    return (
        <div className="w-full overflow-hidden">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                    key={`${currentForm}-${currentStep}`}
                    custom={direction}
                    className="min-h-[200px] flex flex-col justify-center items-end w-full "
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: {type: "spring", stiffness: 300, damping: 30},
                        opacity: {duration: 0.2},
                    }}
                >
                    {CurrentComponent && (
                        <CurrentComponent
                            formValues={formValues}
                            handleNextStep={handleNextStep}
                            handlePrevStep={handlePrevStep}
                            updateFormValues={updateFormValues}
                            setCurrentStep={setCurrentStep} // Truyền vào
                        />
                    )}

                </motion.div>
            </AnimatePresence>
        </div>
    );
}
