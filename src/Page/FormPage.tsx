import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { editLocation } from "@/store/locationSlice"
import { AppDispatch } from "@/store/store"
import { Coordinates, FormValues } from "@/type/type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { z } from "zod"
import MapPage from "./Map"

const schema = z.object({
    name: z.string().min(2, "Name is required"),
    description: z.string().optional(),
    latitude: z.string().min(1, "Latitude is required"),
    longitude: z.string().min(1, "Longitude is required"),
    image: z
        .instanceof(File)
        .refine((file) => file.size > 0, { message: "Image is required" }),
})

type FormData = z.infer<typeof schema>
type FormPageProps = {
    coordinates?: Coordinates | null,
    detailData?: FormValues,
    onSubmitValues?: (values: FormData) => void,
    handleEdit?: (values: boolean) => void
}

function FormPage({ coordinates, detailData, onSubmitValues, handleEdit }: FormPageProps) {

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: detailData?.name || "",
            description: detailData?.description || "",
            latitude: detailData?.latitude || "",
            longitude: detailData?.longitude || "",
            image: detailData?.image || undefined,
        },
    })
    const imageUrl = detailData?.image instanceof File ? URL.createObjectURL(detailData?.image) : detailData?.image || ""

    const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl || null)
    const [isUpdateImage, setIsUpdateImage] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null)
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        if (coordinates) {
            form.setValue("latitude", String(coordinates.lat))
            form.setValue("longitude", String(coordinates.lng))
        }
        if (detailData?.image) form.setValue("image", detailData.image);
    }, [coordinates, form, detailData])

    const onSubmit = (data: FormData) => {
        if (!detailData) {
            onSubmitValues?.(data)
        } else {
            handleEdit?.(true)
            dispatch(editLocation({ ...data, id: detailData?.id }));
        }
        form.reset();
        form.resetField("image");
        setPreviewUrl(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            form.setValue("image", file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    }

    const handleSelectMap = ({ lat, lng }: Coordinates) => {
        form.setValue("latitude", String(lat))
        form.setValue("longitude", String(lng))
    }

    const handleUpdateImage = () => {
        form.resetField("image");
        setIsUpdateImage(true)
    }

    return (
        <>
            {detailData && <MapPage locationData={detailData} viewOnly={true} setLocation={handleSelectMap} />}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {["name", "latitude", "longitude"].map((fieldName) => (
                        <FormField
                            key={fieldName}
                            control={form.control}
                            name={fieldName as "name" | "latitude" | "longitude"}
                            render={({ field: formField }) => (
                                <FormItem>
                                    {!detailData && <FormLabel className="capitalize">{fieldName === 'latitude' || fieldName === 'longitude' ? `${fieldName} (Select from Map)` : fieldName}</FormLabel>}
                                    <FormControl>
                                        <Input
                                            className="w-full border rounded-lg py-1.5 shadow px-2 text-slate-700 focus-visible:outline-none focus-visible:ring-1 placeholder:text-sm"
                                            placeholder={fieldName} {...formField} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))
                    }
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                {!detailData && <FormLabel>Description</FormLabel>}
                                <FormControl>
                                    <Textarea
                                        className="w-full border rounded-lg py-1.5 shadow px-2 text-slate-700 focus-visible:outline-none focus-visible:ring-1"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {
                        (!detailData || isUpdateImage) &&
                        <FormField
                            control={form.control}
                            name="image"
                            render={() => (
                                <FormItem>
                                    {!detailData && <FormLabel>Image</FormLabel>}
                                    <FormControl>
                                        <Input
                                            ref={fileInputRef}
                                            type="file"
                                            className="w-full border rounded-lg py-1.5 shadow px-2 text-slate-700 placeholder:text-sm cursor-pointer"
                                            accept="image/*"
                                            onChange={handleImageChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    }
                    {(previewUrl && !isUpdateImage) && (
                        <div className="flex gap-1 items-end">
                            <div className="pt-2">
                                {!detailData && <p className="text-sm text-gray-600 mb-1">Preview:</p>}
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-28 h-28 object-cover rounded border"
                                />
                            </div>
                            {detailData && <Button variant={"outline"} onClick={handleUpdateImage}>Update Image</Button>}
                        </div>
                    )}
                    <Button type="submit" className="w-full">{detailData ? 'Save Changes' : 'Submit'}</Button>
                </form>
            </Form>
        </>
    )
}

export default FormPage;