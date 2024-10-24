"use client";
import {CalendarIcon, ChevronLeft, Upload} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useForm} from "react-hook-form";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";

import {Input} from "@/components/ui/input";

import RichEditor from "@/components/common/react-draft-wysiwyg";
import {Calendar} from "@/components/ui/calendar";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import courseService from "@/services/course-service";

import {zodResolver} from "@hookform/resolvers/zod";
import {format} from "date-fns";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {useEffect, useRef, useState} from "react";
import {toast} from "sonner";
import {z} from "zod";
import {storage} from "../../../../firebase";
import {CourseCreateCommand, CourseUpdateCommand} from "@/types/commands/course-command";
import { useRouter } from "next/navigation";
import { Const } from "@/lib/const";
import { CourseStatus, CourseType } from "@/types/enums/course";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import providerService from "@/services/provider-service";
import { Subject } from "@/types/subject";
import { Provider } from "@/types/provider";
import subjectService from "@/services/subject-service";

interface CourseFormProps {
    initialData: any | null;
}

const formSchema = z.object({
    id: z.string().optional(),
    subjectId: z.string().optional(),
    providerId: z.string().optional(),
    teacherName: z.string().optional(),
    type: z.nativeEnum(CourseType).optional(),
    name: z.string().min(1, "Name is required"),
    code: z.string().optional(),
    courseName: z.string().optional(),
    description: z.string().optional(),
    backgroundImage: z.string().optional(),
    price: z.number().optional(),
    soldCourses: z.number().optional(),
    totalSlots: z.number().optional(),
    totalSessions: z.number().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    status: z.nativeEnum(CourseStatus).optional(),
    isActive: z.boolean(),
    createdDate: z.date().optional(),
    createdBy: z.string().optional(),
    isDeleted: z.boolean(),
});

export const CourseForm: React.FC<CourseFormProps> = ({initialData}) => {
    const [loading, setLoading] = useState(false);
    const [imgLoading, setImgLoading] = useState(false);
    const title = initialData ? "Edit course" : "Create course";
    const description = initialData ? "Edit a course." : "Add a new course";
    const toastMessage = initialData ? "Course updated." : "Course created.";
    const action = initialData ? "Save changes" : "Create";
    const [firebaseLink, setFirebaseLink] = useState<string | null>(null);
    const [date, setDate] = useState<Date>();
    const router = useRouter();
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
            const storageRef = ref(storage, `Course/${selectedFile.name}`);
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
            const courseCommand = {
                id: initialData ? values.id : null,
                name: values.name,
                description: values.description,
                status: values.status,
                backgroundImage: updatedValues.backgroundImage,
                price: values.price,
                totalSlots: values.totalSlots,
                totalSessions: values.totalSessions,
                startTime: values.startTime,
                endTime: values.endTime,
                isActive: values.isActive,
            };
            if (initialData) {
                const response = await courseService.update(courseCommand as CourseUpdateCommand);
                if (response.status != 1) return toast.error(response.message);
                toast.success(response.message);
            } else {
                const response = await courseService.create(courseCommand as CourseCreateCommand);
                if (response.status != 1) return toast.error(response.message);
                toast.success(response.message);
            }
        } catch (error: any) {
            toast.error(error);
        } finally {
            setLoading(false);
            router.push(Const.URL_COURSE)
        }
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            status: undefined,
            backgroundImage: "",
            price: 0,
            totalSlots: 0,
            totalSessions: 0,
            startTime: "",
            endTime: "",
            isActive: true,
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
                description: initialData.description || "",
                backgroundImage: initialData.backgroundImage || "",
                price: initialData.price || 0,
                totalSlots: initialData.totalSlots || 0,
                totalSessions: initialData.totalSessions || 0,
                startTime: initialData.startTime || "",
                endTime: initialData.endTime || "",
                isActive: !!initialData.isActive,
                createdDate: initialData.createdDate
                    ? new Date(initialData.createdDate)
                    : new Date(),
                createdBy: initialData.createdBy || "",
                isDeleted: !!initialData.isDeleted,
            });

            setDate(
                initialData.createdDate ? new Date(initialData.createdDate) : new Date()
            );

            setFirebaseLink(initialData.backgroundImage || "");
        } else {
            setDate(new Date());
        }
    }, [initialData, form]);

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [providers, setProviders] = useState<Provider[]>([]);

useEffect(() => {
    const fetchData = async () => {
        try {
            // Gọi API lấy danh sách subjectId
            const response_subjects = await providerService.fetchAll();
            setSubjects(response_subjects.data?.results!); 
            
            // Gọi API lấy danh sách providerId
            const response_providers = await subjectService.fetchAll();
            setProviders(response_providers.data?.results!); 
        } catch (error) {
            console.error(error);
        }
    };

    fetchData();
}, []);
    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid max-w-[59rem] flex-1 auto-rows-max gap-4">
                        <div className="flex items-center gap-4">
                            <Link href="/courses">
                                <Button variant="outline" size="icon" className="h-7 w-7">
                                    <ChevronLeft className="h-4 w-4"/>
                                    <span className="sr-only">Back</span>
                                </Button>
                            </Link>

                            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                                Course Controller
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
                                        <CardTitle>Course Details</CardTitle>
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
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel>Name</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Enter name" {...field} />
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
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Status</FormLabel>
                                                            <FormControl>
                                                                <Select
                                                                    onValueChange={(value) => field.onChange(Number(value))} // Chuyển đổi string sang number
                                                                    value={field.value?.toString()} // Chuyển đổi number sang string
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select status" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value={CourseStatus.Pending.toString()}>Pending</SelectItem>
                                                                        <SelectItem value={CourseStatus.Approved.toString()}>Approved</SelectItem>
                                                                        <SelectItem value={CourseStatus.Rejected.toString()}>Rejected</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormDescription>Select the current status of the course.</FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                            </div>

                                            <div className="grid gap-3">
                                            <FormField
                                                control={form.control}
                                                name="subjectId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Subject</FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                onValueChange={(value) => field.onChange(value)}
                                                                value={field.value}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select subject" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {subjects.map((subject: any) => (
                                                                        <SelectItem key={subject.id} value={subject.id}>
                                                                            {subject.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>Select the subject of the course.</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="providerId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Provider</FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                onValueChange={(value) => field.onChange(value)}
                                                                value={field.value}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select provider" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {providers.map((provider: any) => (
                                                                        <SelectItem key={provider.id} value={provider.id}>
                                                                            {provider.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>Select the provider for this course.</FormDescription>
                                                        <FormMessage />
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
                                        <CardTitle>Course Background</CardTitle>
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
                                                    <FormLabel>Course Background</FormLabel>
                                                    <FormControl>
                                                        <div className="grid gap-2">
                                                            {firebaseLink ? (
                                                                <>
                                                                    <Image
                                                                        alt="Course Background"
                                                                        className="aspect-square w-full rounded-md object-cover"
                                                                        height={300}
                                                                        src={firebaseLink}
                                                                        width={300}
                                                                    />
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
                                                                        className="flex aspect-square w-full items-center justify-center rounded-md bcourse bcourse-dashed"
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
                                        <CardTitle>Archive Course</CardTitle>
                                        <CardDescription>
                                            Lipsum dolor sit amet, consectetur adipiscing elit.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div></div>
                                        <Button size="sm" variant="secondary">
                                            Archive Course
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 md:hidden">
                            <Button variant="outline" size="sm">
                                Discard
                            </Button>
                            <Button size="sm">Save Course</Button>
                        </div>
                    </div>
                </form>
            </Form>
        </>
    );
};
