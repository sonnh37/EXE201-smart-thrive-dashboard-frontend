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
  PackageXCourseCreateCommand,
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
import { getEnumOptions } from "@/lib/utils";
import { CourseStatus, CourseType } from "@/types/enums/course";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DataTable } from "@/components/common/data-table-generic/data-table";
import DataTableCourses from "./courses";
import { Course } from "@/types/course";
import { Package } from "@/types/package";
import packageXCourseService from "@/services/package-x-course-service";
import { PackageXCourse } from "@/types/package-x-course";

interface PackageFormProps {
  initialData: any | null;
}

const packageXCourseSchema = z.object({
  id: z.string().optional(),
  packageId: z.string().default(""),
  courseId: z.string().default(""),
});

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required").default(""),
  totalPrice: z.number().default(0),
  quantityCourse: z.number().default(0),
  status: z.nativeEnum(PackageStatus).default(PackageStatus.Pending),
  isActive: z.boolean().default(false),
  createdDate: z.date().default(() => new Date()), // hoặc sử dụng new Date() nếu cần giá trị cố định
  createdBy: z.string().default("N/A"),
  isDeleted: z.boolean().default(false),
  packageXCourses: z.array(packageXCourseSchema).default([]),
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

  const deletePackageXCourses = async (
    packageXCoursesToRemove: PackageXCourse[]
  ) => {
    await Promise.all(
      packageXCoursesToRemove.map((pxc) => packageXCourseService.delete(pxc.id))
    );
  };

  const createPackageXCourses = async (
    packageXCourseCreateCommands: PackageXCourseCreateCommand[]
  ) => {
    await Promise.all(
      packageXCourseCreateCommands.map((packageXCourse) =>
        packageXCourseService.create(packageXCourse)
      )
    );
  };

  const handleUpdate = async (
    values: z.infer<typeof formSchema>,
    initialData: Package
  ) => {
    const initialPackageXCourses = initialData.packageXCourses || [];
    const initialCourseIds = initialPackageXCourses.map(
      (course) => course.courseId
    );
    const newCourseIds = values.packageXCourses.map(
      (course) => course.courseId
    );

    // Tìm các packageXCourse cần xóa
    const packageXCoursesToRemove = initialPackageXCourses.filter(
      (pxc) => !newCourseIds.includes(pxc.courseId!)
    );
    // Tìm các CourseId cần thêm
    const coursesToAdd = newCourseIds.filter(
      (id) => !initialCourseIds.includes(id)
    );

    // Tạo lệnh thêm packageXCourse
    const packageXCourseCreateCommand: PackageXCourseCreateCommand[] =
      coursesToAdd.map((courseId) => ({
        courseId: courseId,
        packageId: initialData.id, // Sử dụng ID của package hiện tại
      }));

    // Xóa các packageXCourse cũ và thêm các packageXCourse mới
    await deletePackageXCourses(packageXCoursesToRemove);
    await createPackageXCourses(packageXCourseCreateCommand);

    // Cập nhật package
    const packageCommand: PackageUpdateCommand = {
      ...values,
      packageXCourses: [],
    };
    const response = await packageService.update(packageCommand);

    if (response.status !== 1) throw new Error(response.message);
    toast.success(response.message);
  };

  const handleCreate = async (values: z.infer<typeof formSchema>) => {
    const packageCommand: PackageCreateCommand = { ...values };
    const response = await packageService.create(packageCommand);

    if (response.status !== 1) throw new Error(response.message);

    // Tạo lệnh thêm packageXCourse cho package mới
    const packageXCourseCreateCommand: PackageXCourseCreateCommand[] =
      values.packageXCourses.map((pxc) => ({
        courseId: pxc.courseId,
        packageId: response.data?.id, // ID của package mới tạo
      }));

    await createPackageXCourses(packageXCourseCreateCommand);
    toast.success(response.message);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      if (initialData) {
        await handleUpdate(values, initialData);
      } else {
        await handleCreate(values);
      }

      router.push(Const.URL_PACKAGE);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    console.log("check_init", initialData);
    if (initialData) {
      form.reset({
        ...initialData,
        createdDate: initialData.createdDate
          ? new Date(initialData.createdDate)
          : new Date(),
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
                          name="packageXCourses"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline">
                                      packageXCourses
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="w-full h-full max-w-[80%] max-h-[90%] overflow-y-auto">
                                    <DataTableCourses
                                      packageId={
                                        initialData && initialData.id
                                          ? initialData.id
                                          : undefined
                                      }
                                      onChange={(pxcs) => {
                                        console.log("check_onchange", pxcs);
                                        field.onChange(pxcs);
                                      }}
                                      packageXCourses={field.value} // Truyền giá trị từ field.value
                                    />
                                  </DialogContent>
                                </Dialog>
                              </FormControl>
                              {/* Hiển thị thông tin khóa học đã chọn */}
                              {field.value && (
                                <div className="mt-2">
                                  <span className="font-bold">
                                    Selected Course IDs:
                                  </span>
                                  <ul>
                                    {field.value.map((pxc) => (
                                      <li>{pxc.courseId}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />

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
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={(value) =>
                                    field.onChange(Number(value))
                                  } // Chuyển đổi string sang number
                                  value={field.value?.toString()} // Chuyển đổi number sang string
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getEnumOptions(PackageStatus).map(
                                      (option) => (
                                        <SelectItem
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormDescription>
                                Select the current status of the course.
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
