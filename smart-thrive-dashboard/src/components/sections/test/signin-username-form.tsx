import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchUserByUsername } from "@/services/user-service";
import { User } from "@/types/user";
import React, { useEffect } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { FormValues } from ".";

const formSchema = z.object({
  username: z.string(),
});

interface SigninUsernameFormProps {
  formValues: FormValues;
  updateFormValues: (values: FormValues) => void;
  handleNextStep: () => void; // Thêm handleNextStep để chuyển bước
  handlePrevStep: () => void; // Thêm handleNextStep để chuyển bước
}

const SigninUsernameForm: React.FC<SigninUsernameFormProps> = ({
  formValues,
  updateFormValues,
  handleNextStep, // Nhận hàm từ cha
  handlePrevStep, // Nhận hàm từ cha
}) => {
  const [values, setValues] = React.useState<
    Partial<z.infer<typeof formSchema>>
  >({
    username: formValues.username || "", // Khởi tạo với giá trị từ cha
  });

  useEffect(() => {
    updateFormValues(values as { username: string }); // Cập nhật giá trị mỗi khi thay đổi
  }, [values]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await fetchUserByUsername(formValues.username!);
      console.log("check_response", response);

      if (response.status == 1 && response.data) {
        const userData = response.data as User; // Giả sử response trả về user

        // Cập nhật formValues với cả username và user
        updateFormValues({
          ...values,
          user: userData, // Gán thông tin user từ API vào formValues
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
    <div>
      <div className="mx-auto my-6 max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Enter Username</CardTitle>
            <CardDescription>Enter your username to continue</CardDescription>
          </CardHeader>

          <CardContent>
            <AutoForm
              formSchema={formSchema}
              values={values}
              onValuesChange={setValues}
              onSubmit={handleSubmit}
            >
              <AutoFormSubmit>Submit</AutoFormSubmit>
            </AutoForm>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SigninUsernameForm;
