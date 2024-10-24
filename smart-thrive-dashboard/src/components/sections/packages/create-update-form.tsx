"use client";
import { CalendarIcon, ChevronLeft, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";


import RichEditor from "@/components/common/react-draft-wysiwyg";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import packageService from "@/services/package-service";
import { BlogCreateCommand, BlogUpdateCommand, } from "@/types/commands/blog-command";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { storage } from "../../../../firebase";

interface BlogFormProps {
    initialData: any | null;
}

const formSchema = z.object({
    id: z.string().optional(),
    userId: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    status: z.string().optional(),
    backgroundImage: z.string().optional(),
    createdDate: z.date().optional(),
    createdBy: z.string().optional(),
    isDeleted: z.boolean(),
});

export const BlogForm: React.FC<BlogFormProps> = ({initialData}) => {
    const [loading, setLoading] = useState(false);
    const [imgLoading, setImgLoading] = useState(false);
    const title = initialData ? "Edit blog" : "Create blog";
    const description = initialData ? "Edit a blog." : "Add a new blog";
    const toastMessage = initialData ? "Blog updated." : "Blog created.";
    const action = initialData ? "Save changes" : "Create";
    const [firebaseLink, setFirebaseLink] = useState<string | null>(null);
    const [date, setDate] = useState<Date>();

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // Lưu tạm file đã chọn

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFirebaseLink(URL.createObjectURL(file)); // Hiển thị preview
            setSelectedFile(file); // Lưu file vào state thay vì upload
        }
    };

    const handleImageDelete = () => {
        setFirebaseLink(""); // Xóa preview của hình ảnh
        setSelectedFile(null); // Đặt file về null để xóa file đã chọn
        form.setValue("backgroundImage", ""); // Xóa giá trị hình ảnh trong form nếu có
    };

    const uploadImageFirebase = async (values: z.infer<typeof formSchema>) => {
        if (selectedFile) {
            const storageRef = ref(storage, `Blog/${selectedFile.name}`);
            const uploadTask = uploadBytesResumable(storageRef, selectedFile);

            const uploadPromise = new Promise<string>((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    null,
                    (error) => reject(error),
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((url) => resolve(url));
                    }
                );
            });

            const downloadURL = await uploadPromise;
            return {...values, backgroundImage: downloadURL}; // Trả về values đã cập nhật
        }
        return values; // Trả về values gốc nếu không có file
    };
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const updatedValues = await uploadImageFirebase(values); // Chờ upload hoàn tất và nhận values mới
            const blogCommand = {
                id: initialData ? values.id : null,
                title: values.title,
                description: values.description,
                status: values.status,
                backgroundImage: updatedValues.backgroundImage,
            };
            if (initialData) {
                const response = await packageService.update(blogCommand as BlogUpdateCommand);
                if (response.status != 1) return toast.error(response.message);
                toast.success(response.message);
            } else {
                const response = await packageService.create(blogCommand as BlogCreateCommand);
                if (response.status != 1) return toast.error(response.message);
                toast.success(response.message);
            }
        } catch (error: any) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            status: "",
            backgroundImage: "",
            createdBy: "N/A",
            createdDate: new Date(),
            isDeleted: false,
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                id: initialData.id || "",
                title: initialData.title || "",
                status: initialData.Status || "",
                description: initialData.description || +"",
                backgroundImage: initialData.backgroundImage || "",
                createdDate: initialData.createdDate
                    ? new Date(initialData.createdDate)
                    : new Date(),
                createdBy: initialData.createdBy || "",
                isDeleted: !!initialData.isDeleted,
            });

            setDate(
                initialData.createdDate ? new Date(initialData.createdDate) : new Date()
            );

            //setImagePreview(initialData.backgroundImage || "");
            setFirebaseLink(initialData.backgroundImage || "");
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
                            <Link href="/blogs">
                                <Button variant="outline" size="icon" className="h-7 w-7">
                                    <ChevronLeft className="h-4 w-4"/>
                                    <span className="sr-only">Back</span>
                                </Button>
                            </Link>

                            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                                Blog Controller
                            </h1>
                            <Badge variant="outline" className="ml-auto sm:ml-0">
                                <FormField
                                    control={form.control}
                                    name="isDeleted"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <p>{field.value ? "Disactived" : "Actived"}</p>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </Badge>
                            <div className="hidden items-center gap-2 md:ml-auto md:flex">
                                <Button variant="outline" size="sm">
                                    Discard
                                </Button>
                                <Button type="submit" size="sm" disabled={loading}>
                                    {loading ? "Processing..." : action}
                                </Button>
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                                <Card x-chunk="dashboard-07-chunk-0">
                                    <CardHeader>
                                        <CardTitle>Blog Details</CardTitle>
                                        <CardDescription>
                                            Lipsum dolor sit amet, consectetur adipiscing elit
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-6">
                                            <div className="grid gap-3">
                                                <FormField
                                                    control={form.control}
                                                    name="title"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel>Title</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Enter title" {...field} />
                                                            </FormControl>
                                                            <FormDescription>
                                                                This is your public display name.
                                                            </FormDescription>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="status"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel>Status</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Enter status" {...field} />
                                                            </FormControl>
                                                            <FormDescription>
                                                                This is your public display name.
                                                            </FormDescription>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="grid gap-3">
                                                <FormField
                                                    control={form.control}
                                                    name="description"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Dialog>
                                                                    <DialogTrigger asChild>
                                                                        <Button variant="outline">Content</Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent
                                                                        className="w-full h-full max-w-[80%] max-h-[90%]">

                                                                        <RichEditor
                                                                            description={field.value || ""} // Pass the current value from form field
                                                                            onChange={field.onChange} // Pass the onChange handler
                                                                        />
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card
                                    className="overflow-hidden"
                                    x-chunk="dashboard-07-chunk-2"
                                >
                                    <CardHeader>
                                        <CardTitle>Blog Background</CardTitle>
                                        <CardDescription>
                                            Lipsum dolor sit amet, consectetur adipiscing elit
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <FormField
                                            control={form.control}
                                            name="backgroundImage"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Blog Background</FormLabel>
                                                    <FormControl>
                                                        <div className="grid gap-2">
                                                            {firebaseLink ? (
                                                                <>
                                                                    <Image
                                                                        alt="Blog Background"
                                                                        className="aspect-square w-full rounded-md object-cover"
                                                                        height={300}
                                                                        src={firebaseLink}
                                                                        width={300}
                                                                    />
                                                                    {/* <p
                                    className="text-blue-500 underline"
                                    {...field}
                                  >
                                    <a
                                      href={firebaseLink!}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {firebaseLink}
                                    </a>
                                  </p> */}
                                                                    <Button
                                                                        onClick={handleImageDelete}
                                                                        variant="destructive"
                                                                    >
                                                                        Delete Image
                                                                    </Button>
                                                                </>
                                                            ) : (
                                                                <div className="grid grid-cols-3 gap-2">
                                                                    <button
                                                                        type="button"
                                                                        className="flex aspect-square w-full items-center justify-center rounded-md bblog bblog-dashed"
                                                                        onClick={() =>
                                                                            fileInputRef.current?.click()
                                                                        }
                                                                    >
                                                                        <Upload
                                                                            className="h-4 w-4 text-muted-foreground"/>
                                                                        <span className="sr-only">Upload</span>
                                                                    </button>
                                                                </div>
                                                            )}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                ref={fileInputRef}
                                                                className="hidden"
                                                                onChange={handleImageChange}
                                                            />
                                                            <FormMessage/>
                                                        </div>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
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
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel>Email</FormLabel>
                                                            <FormControl>
                                                                <Input disabled placeholder="N/A" {...field} />
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="grid gap-3">
                                                <FormField
                                                    control={form.control}
                                                    name="createdDate"
                                                    render={({field}) => {
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
                                                                                <CalendarIcon className="mr-2 h-4 w-4"/>
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
                                                                <FormMessage/>
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
                                        <CardTitle>Archive Blog</CardTitle>
                                        <CardDescription>
                                            Lipsum dolor sit amet, consectetur adipiscing elit.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div></div>
                                        <Button size="sm" variant="secondary">
                                            Archive Blog
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 md:hidden">
                            <Button variant="outline" size="sm">
                                Discard
                            </Button>
                            <Button size="sm">Save Blog</Button>
                        </div>
                    </div>
                </form>
            </Form>
        </>
    );
};
