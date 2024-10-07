import { FloatingLabelInput } from "@/components/common/floating-label-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { fetchUserByUsername, fetchUserByUsernameOrEmail } from "@/services/user-service";
import { User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { FormValues } from "./signup-form";
const formSchema = z.object({
  username: z.string(),
});

interface SignupPersonalizeFormProps {
  formValues: FormValues;
  updateFormValues: (values: FormValues) => void;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  setCurrentStep: React.Dispatch<React.SetStateAction<[number, number]>>; // Cập nhật dòng này
}

const SignupPersonalizeForm: React.FC<SignupPersonalizeFormProps> = ({
  formValues,
  updateFormValues,
  handleNextStep,
  handlePrevStep,
  setCurrentStep,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: formValues.username || "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (data.username == "") return toast.error("Empty input");
      const response = await fetchUserByUsernameOrEmail(data.username);

      if (response.status != 1) {
        return toast.error(response.message);
      }

      const userData = response.data as User;
      updateFormValues({
        ...formValues,
        user: userData,
        username: data.username,
      });
      toast.success(response.message);
      handleNextStep();

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
       <div className="w-full flex justify-between">
          <Button
            type="button"
            onClick={() => setCurrentStep([0, 1])}
            className="rounded-full"
            variant="outline"
          >
            {" "}
            Previous
          </Button>
          <div className=" flex justify-between space-x-2">
            <Button className="rounded-full" type="submit">
              Next
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default SignupPersonalizeForm;
