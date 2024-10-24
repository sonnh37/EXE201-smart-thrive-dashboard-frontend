import {Button} from "@/components/ui/button";
import userService from "@/services/user-service";
import {User} from "@/types/user";
import {GoogleLogin, useGoogleOneTapLogin,} from "@react-oauth/google";
import {motion} from "framer-motion";
import {useRouter} from "next/navigation";
import React from "react";
import {CiUser} from "react-icons/ci";
import {FcGoogle} from "react-icons/fc";
import {toast} from "sonner";
import {FormValues} from "./signup-form";

interface SignupSelectMethodFormProps {
    formValues: FormValues;
    updateFormValues: (values: FormValues) => void;
    handleNextStep: () => void;
    handlePrevStep: () => void;
    setCurrentStep: React.Dispatch<React.SetStateAction<[number, number]>>;
}

const SignupSelectMethodForm: React.FC<SignupSelectMethodFormProps> = ({
                                                                           formValues,
                                                                           updateFormValues,
                                                                           handleNextStep,
                                                                           handlePrevStep,
                                                                           setCurrentStep,
                                                                       }) => {
    const router = useRouter();

    const handleSuccess = async (response: any) => {
        const _response = await userService.findAccountRegisteredByGoogle(response.credential);
        const user = _response.data! as User;

        if (user != null) {
            return toast.error(_response.message);
        }

        updateFormValues({...formValues, googleToken: response.credential});
        setCurrentStep([1, 1]);
    };

    const googleOneTapLogin = useGoogleOneTapLogin({
        onSuccess: handleSuccess,
        onError: () => console.log("Login Failed"),
    });

    const handleError = () => {
        console.log("Google login failed");
    };

    const handlePersonalizeClick = () => {
        setCurrentStep([2, 1]);
    };

    return (
        <div className="w-[90%] space-y-6 m-4">
            <div className="flex flex-col space-y-4">
                <motion.button
                    onClick={handlePersonalizeClick}
                    className="inline-flex justify-center items-center px-3 py-2 rounded-full border-[1px] border-foreground"
                    initial={{scale: 1}}
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                >
                    <CiUser className="mr-2 h-6 w-6"/>
                    Sign up with personalize
                </motion.button>

                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                    size="large"
                    type="standard"
                    text="continue_with"
                    theme="filled_black"
                    logo_alignment="center"
                    shape="circle"
                    width="" // Thiết lập chiều rộng 100%
                    auto_select={true}
                />
                <motion.button
                    className="inline-flex justify-center items-center px-3 py-2 rounded-full border-[1px] border-foreground"
                    initial={{scale: 1}}
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                >
                    <FcGoogle className="mr-2 h-6 w-6"/>
                    Sign up with Google
                </motion.button>
            </div>
            <div className="w-full flex justify-between">
                <Button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="rounded-full"
                    variant="outline"
                >
                    Previous login
                </Button>
            </div>
        </div>
    );
};

export default SignupSelectMethodForm;
