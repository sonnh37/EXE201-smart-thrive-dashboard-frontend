"use client";
import { CalendarIcon, ChevronLeft, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import packageService from "@/services/package-service";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, isValid, parse } from "date-fns";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { storage } from "../../../../firebase";
import {
  PackageCreateCommand,
  PackageUpdateCommand,
} from "@/types/commands/package-command";
import { useRouter } from "next/navigation";
import { Const } from "@/lib/const";
import { PackageStatus } from "@/types/enums/package";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import providerService from "@/services/provider-service";
import { Subject } from "@/types/subject";
import { Provider } from "@/types/provider";
import subjectService from "@/services/subject-service";
import { Textarea } from "@/components/ui/textarea";
import TimePicker from "react-time-picker";
import { convertToISODate } from "@/lib/date-helper";
import { formatCurrency } from "@/lib/currency-helper";
import { formatTimeSpan } from "@/lib/format-timespan";

interface PackageFormProps {
  initialData: any | null;
}

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  totalPrice: z.number().optional(),
  quantityCourse: z.number().optional(),
  status: z.nativeEnum(PackageStatus).optional(),
  isActive: z.boolean(),
  createdDate: z.date().optional(),
  createdBy: z.string().optional(),
  isDeleted: z.boolean(),
});

export const PackageForm: React.FC<PackageFormProps> = ({ initialData }) => {
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const title = initialData ? "Edit package" : "Create package";
  const description = initialData ? "Edit a package." : "Add a new package";
  const toastMessage = initialData ? "Package updated." : "Package created.";
  const action = initialData ? "Save changes" : "Create";
  const [firebaseLink, setFirebaseLink] = useState<string | null>(null);
  const [date, setDate] = useState<Date>();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const packageCommand = {
        id: initialData ? values.id : null,
        name: values.name,
        status: values.status,
        totalPrice: values.totalPrice,
        quantityCourse: values.quantityCourse,
        isActive: values.isActive,
      };

      console.log("check_package", packageCommand)

      if (initialData) {
        const response = await packageService.update(
          packageCommand as PackageUpdateCommand
        );
        if (response.status != 1) throw new Error(response.message);
        toast.success(response.message);
      } else {
        const response = await packageService.create(
          packageCommand as PackageCreateCommand
        );
        if (response.status != 1) throw new Error(response.message);
        toast.success(response.message);
      }

      router.push(Const.URL_PACKAGE);
    } catch (error: any) {
      return toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantityCourse: 0,
      status: PackageStatus.Pending,
      totalPrice: 0,
      isActive: false,
      createdBy: "N/A",
      createdDate: new Date(),
      isDeleted: false,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        id: initialData.id || "",
        name: initialData.name || "",
        status: initialData.status || "",
        totalPrice: initialData.totalPrice || 0,
        quantityCourse: initialData.quantityCourse || 0,
        isActive: initialData.isActive || false,
        createdDate: initialData.createdDate
          ? new Date(initialData.createdDate)
          : new Date(),
        createdBy: initialData.createdBy || "",
        isDeleted: !!initialData.isDeleted,
      });
    } else {
      setDate(new Date());
    }
  }, [initialData, form]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
              <Link href="/packages">
                <Button variant="outline" size="icon" className="h-7 w-7">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
              </Link>

              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Package Controller
              </h1>
              <Badge variant="outline" className="ml-auto sm:ml-0">
                <FormField
                  control={form.control}
                  name="isDeleted"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <p>
                          {initialData
                            ? field.value
                              ? "Deleted"
                              : "Last Updated: " + initialData.updatedDate
                            : "New"}
                        </p>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Badge>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Link href="/packages" passHref>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/packages");
                    }} // Ngăn chặn submit
                  >
                    Discard
                  </Button>
                </Link>
                <Button type="submit" size="sm" disabled={loading}>
                  {loading ? "Processing..." : action}
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>Package Details</CardTitle>

                    <CardDescription>
                      Lipsum dolor sit amet, consectetur adipiscing elit
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter name" {...field} />
                              </FormControl>
                              <FormDescription>
                                This is your public display name.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="totalPrice"
                          render={({ field }) => {
                            const inputRef = useRef<HTMLInputElement>(null);

                            return (
                              <FormItem>
                                <FormLabel>Total Price</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    ref={inputRef}
                                    placeholder="Nhập giá..."
                                    type="text"
                                    className="mt-2 w-full"
                                    min="0"
                                    value={
                                      field.value !== undefined
                                        ? formatCurrency(field.value)
                                        : ""
                                    }
                                    onChange={(e) => {
                                      const rawValue = e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                      );
                                      const parsedValue =
                                        parseFloat(rawValue) || 0;

                                      // Cập nhật giá trị trong form
                                      field.onChange(parsedValue);

                                      // Giữ vị trí con trỏ
                                      if (inputRef.current) {
                                        const cursorPosition =
                                          e.target.selectionStart || 0;
                                        setTimeout(() => {
                                          inputRef.current?.setSelectionRange(
                                            cursorPosition,
                                            cursorPosition
                                          );
                                        }, 0);
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-3">
                  <CardHeader>
                    <CardTitle>Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="createdBy"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input disabled placeholder="N/A" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="createdDate"
                          render={({ field }) => {
                            const handleDateSelect = (selectedDate: any) => {
                              setDate(selectedDate);
                              field.onChange(
                                selectedDate
                                  ? new Date(selectedDate)
                                  : new Date()
                              );
                            };
                            return (
                              <FormItem>
                                <FormLabel>Created Date</FormLabel>
                                <FormControl>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        disabled
                                        variant={"outline"}
                                        className={`w-[280px] justify-start text-left font-normal ${
                                          !date ? "text-muted-foreground" : ""
                                        }`}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? (
                                          format(date, "PPP")
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                      <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={handleDateSelect}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card x-chunk="dashboard-07-chunk-5">
                  <CardHeader>
                    <CardTitle>Quantity</CardTitle>
                    <CardDescription>
                      Lipsum dolor sit amet, consectetur adipiscing elit.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="quantityCourse"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity courses</FormLabel>
                            <FormControl>
                              <Input
                                {...field} // Kết nối field với input
                                placeholder=""
                                type="number"
                                disabled // Đặt trường này ở trạng thái disabled
                                className="mt-2 w-full"
                                onChange={(e) =>
                                  field.onChange(e.target.value || 0)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
