import { FloatingLabelInput } from "@/components/common/floating-label-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { fetchUserByUsername } from "@/services/user-service";
import { User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { FormValues } from "./signin-form";
const formSchema = z.object({
  username: z.string(),
});

interface SignupPersonalizeFormProps {
  formValues: FormValues;
  updateFormValues: (values: FormValues) => void;
  handleNextStep: () => void;
  handlePrevStep: () => void;
}

const SignupPersonalizeForm: React.FC<SignupPersonalizeFormProps> = ({
  formValues,
  updateFormValues,
  handleNextStep,
  handlePrevStep,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: formValues.username || "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log("username", data.username)
      if(data.username == "") return toast.error("Empty input")
      const response = await fetchUserByUsername(data.username);
      console.log("check_response", response);

      if (response.status == 1 && response.data) {
        const userData = response.data as User;
        updateFormValues({ ...formValues, user: userData, username: data.username });
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
                id="Username"
                label="Username"
              />
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-end space-x-4">
          <Button type="button" className="border-none rounded-full" variant="outline">
            Create account
          </Button>
          <Button className="rounded-full" type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
};

export default SignupPersonalizeForm;
