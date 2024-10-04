import * as z from "zod";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FormValues } from ".";
import { fetchUserByUsername, login } from "@/services/user-service";
import { User } from "@/types/user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  handleNextStep, // Nhận hàm từ cha
  handlePrevStep, // Nhận hàm từ cha
}) => {
  const [values, setValues] = React.useState<
    Partial<z.infer<typeof formSchema>>
  >({
    password: formValues.password || "", // Khởi tạo với giá trị từ cha
  });

  useEffect(() => {
    updateFormValues(values as { password: string }); // Cập nhật giá trị mỗi khi thay đổi
  }, [values]);

  const router = useRouter();

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await login(formValues.username!, formValues.password!);
      console.log("check_response", response);

      if (response.status == 1) {
        toast.success(response.message);
        // router -> /
        router.push("/")
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <div className="mx-auto my-6 max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Hi, {formValues.user?.firstName}</CardTitle>
            <CardDescription>Enter your password to continue</CardDescription>
          </CardHeader>

          <CardContent>
            <AutoForm
              formSchema={formSchema}
              values={values}
              onValuesChange={setValues}
              onSubmit={handleSubmit}
            >
              <div className="flex justify-between">
                <Button
                  onClick={handlePrevStep}
                  type="button"
                  variant="secondary"
                >
                  Previous
                </Button>
                <AutoFormSubmit>Submit</AutoFormSubmit>
              </div>
            </AutoForm>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SigninPasswordForm;
