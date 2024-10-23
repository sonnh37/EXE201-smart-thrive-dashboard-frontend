import { FloatingLabelInput } from "@/components/common/floating-label-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  fetchUserByUsernameOrEmail,
  loginByGoogle,
} from "@/services/user-service";
import { User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { FormValues } from "./signin-form";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { setLocalStorage } from "@/lib/auth";

const formSchema = z.object({
  username: z.string(),
});

interface SigninUsernameFormProps {
  formValues: FormValues;
  updateFormValues: (values: FormValues) => void;
  handleNextStep: () => void;
  handlePrevStep: () => void;
}

const SigninUsernameForm: React.FC<SigninUsernameFormProps> = ({
  formValues,
  updateFormValues,
  handleNextStep,
  handlePrevStep,
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: formValues.username || "",
    },
  });

  const handleSuccess = async (response: any) => {
    console.log("check_gg", response);
    // chưa gán token
    loginByGoogle(response.credential)
      .then((_response) => {
        if (_response.status !== 1) {
          return toast.error(_response.message);
        }

        const isLogin = setLocalStorage(_response) as boolean;
        if (!isLogin) return;

        const token = localStorage.getItem("token");
        console.log("check_token_logingg", token)
        if (token) {
          router.push("/"); // Điều hướng sau khi có token
        } else {
          toast.error("Token was not set correctly");
        }
      })
      .catch((error) => {
        console.error("Error during login process:", error);
      });
  };

  const handleError = () => {
    console.log("Google login failed");
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log("username", data.username);
      if (data.username == "") return toast.error("Empty input");
      const response = await fetchUserByUsernameOrEmail(data.username);
      console.log("check_response", response);

      if (response.status == 1 && response.data) {
        const userData = response.data as User;
        updateFormValues({
          ...formValues,
          user: userData,
          username: data.username,
        });
        toast.success(response.message);
        handleNextStep();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while fetching the user.");
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FloatingLabelInput
                className="w-full h-14 text-lg"
                {...field}
                label="Username or email"
              />
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
        <div className="w-full flex justify-end space-x-4">
          <Button
            type="button"
            onClick={() => router.push("/register")}
            className="border-none rounded-full"
            variant="outline"
          >
            Create account
          </Button>
          <Button className="rounded-full" type="submit">
            Next
          </Button>
        </div>
      </form>
    </Form>
    // <div className="mx-auto max-w-lg">
    //   <Card className="">
    //     <CardHeader>
    //       <CardTitle>Enter Username</CardTitle>
    //       <CardDescription>Enter your username to continue</CardDescription>
    //     </CardHeader>

    //     <CardContent>
    //       <AutoForm
    //         formSchema={formSchema}
    //         values={values}
    //         onValuesChange={setValues}
    //         onSubmit={handleSubmit}
    //       >
    //         <AutoFormSubmit>Submit</AutoFormSubmit>
    //       </AutoForm>
    //     </CardContent>
    //   </Card>
    // </div>
  );
};

export default SigninUsernameForm;
