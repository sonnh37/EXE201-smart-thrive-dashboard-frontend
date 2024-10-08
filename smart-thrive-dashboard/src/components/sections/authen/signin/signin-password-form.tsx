import {FloatingLabelInput} from "@/components/common/floating-label-input";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Form, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {loginAuth} from "@/lib/auth";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import React from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {FormValues} from "./signin-form";

const formSchema = z.object({
    password: z.string(),
});

interface SigninPasswordFormProps {
    formValues: FormValues;
    updateFormValues: (values: FormValues) => void;
    handleNextStep: () => void; // Thêm handleNextStep để chuyển bước
    handlePrevStep: () => void; // Thêm handleNextStep để chuyển bước
}

const SigninPasswordForm: React.FC<SigninPasswordFormProps> = ({
                                                                   formValues,
                                                                   updateFormValues,
                                                                   handleNextStep,
                                                                   handlePrevStep,
                                                               }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: formValues.password || "",
        },
    });

    const router = useRouter();

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        const response = await loginAuth(formValues.username!, data.password);

        if (response) {
            router.push("/");
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="w-[90%] space-y-6 m-4"
            >
                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <div className="flex flex-col mb-6">
                                {/* <h1 className="text-4xl">Welcome</h1> */}
                                <div
                                    className="flex items-center space-x-2 border border-gray-500 rounded-full p-1 px-2 w-fit">
                                    {/* Avatar */}

                                    <Avatar className="w-6 h-6">
                                        <AvatarImage
                                            src="https://via.placeholder.com/150"
                                            alt="User Avatar"
                                        />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>

                                    {/* Email */}
                                    <span className="text-sm font-medium">
                    {formValues.user?.username}
                  </span>
                                </div>
                            </div>

                            <FormLabel>To continue, first verify it’s you</FormLabel>
                            <FloatingLabelInput
                                className="w-full h-14 text-lg"
                                {...field}
                                type="password"
                                id="Password"
                                label="Password"
                            />
                            <FormDescription>
                                This is your public display name.
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
                        {" "}
                        Previous
                    </Button>
                    <div className=" flex justify-between space-x-2">
                        <Button
                            type="button"
                            className="border-none rounded-full"
                            variant="outline"
                        >
                            Forgot password?
                        </Button>
                        <Button className="rounded-full" type="submit">
                            Next
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
};

export default SigninPasswordForm;
