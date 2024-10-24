import {FloatingLabelInput} from "@/components/common/floating-label-input";
import {Button} from "@/components/ui/button";
import {Form, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {setLocalStorage} from "@/lib/auth";
import userService from "@/services/user-service";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import React from "react";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import * as z from "zod";
import {FormValues} from "./signup-form";

const formSchema = z
    .object({
        newPassword: z
            .string()
            .min(6, "New password must be at least 6 characters long"),
        confirmPassword: z.string().min(6, "Please confirm your password"), // Thêm trường confirmPassword
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "New password and confirmation must match",
        path: ["confirmPassword"],
    });

interface SignupGmailNewPasswordFormProps {
    formValues: FormValues;
    updateFormValues: (values: FormValues) => void;
    handleNextStep: () => void;
    handlePrevStep: () => void;
    setCurrentStep: React.Dispatch<React.SetStateAction<[number, number]>>;
}

const SignupGmailNewPasswordForm: React.FC<SignupGmailNewPasswordFormProps> = ({
                                                                                   formValues,
                                                                                   updateFormValues,
                                                                                   handleNextStep,
                                                                                   handlePrevStep,
                                                                                   setCurrentStep,
                                                                               }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "", // Thêm giá trị mặc định cho confirmPassword
        },
    });

    const router = useRouter();

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        const _response = await userService.registerByGoogle(
            formValues.googleToken!,
            data.newPassword
        );
        console.log("check_login", _response)
        if (_response.status != 1) {
            return toast.error(_response.message);
        }
        const isLogin = setLocalStorage(_response) as boolean;
        if (isLogin == false) return;
        router.push("/");
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="w-[90%] space-y-6 m-4"
            >
                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FloatingLabelInput
                                className="w-full h-14 text-lg"
                                {...field}
                                type="password"
                                id="NewPassword"
                                label="New Password"
                            />
                            <FormDescription>Please enter your new password.</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FloatingLabelInput
                                className="w-full h-14 text-lg"
                                {...field}
                                type="password"
                                id="ConfirmPassword"
                                label="Confirm Password"
                            />
                            <FormDescription>
                                Please confirm your new password.
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <div className="w-full flex justify-between">
                    <Button
                        type="button"
                        onClick={handlePrevStep}
                        className="rounded-full"
                        variant="outline"
                    >
                        Previous
                    </Button>
                    <div className="flex justify-between space-x-2">
                        <Button className="rounded-full" type="submit">
                            Next
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
};

export default SignupGmailNewPasswordForm;
