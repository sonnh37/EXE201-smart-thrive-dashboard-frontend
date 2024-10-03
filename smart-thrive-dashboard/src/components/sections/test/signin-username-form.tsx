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

const formSchema = z.object({
  username: z.string(),
});

interface SigninUsernameFormProps {
  formValues: { username?: string };
  updateFormValues: (values: { username: string }) => void;
}

const SigninUsernameForm: React.FC<SigninUsernameFormProps> = ({
  formValues,
  updateFormValues,
}) => {
  const [values, setValues] = React.useState<
    Partial<z.infer<typeof formSchema>>
  >({
    username: formValues.username || "", // Khởi tạo với giá trị từ cha
  });

  useEffect(() => {
    updateFormValues(values as { username: string }); // Cập nhật giá trị mỗi khi thay đổi
  }, [values]);

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
              onSubmit={console.log}
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
