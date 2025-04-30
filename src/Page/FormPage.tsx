import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({
    name: z.string().min(2, "Name is required"),
    description: z.string().optional(),
    latitude: z.string().min(1, "Latitude is required"),
    longitude: z.string().min(1, "Longitude is required"),
    image: z.any().optional(),
})

type FormData = z.infer<typeof schema>
type FormPageProps = {
    coordinates: { lat: number; lng: number } | null,
    onSubmitValues: (values: FormData) => void
}

function FormPage({ coordinates, onSubmitValues }: FormPageProps) {

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            description: "",
            latitude: "",
            longitude: "",
            image: undefined,
        },
    })

    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (coordinates) {
            form.setValue("latitude", String(coordinates.lat))
            form.setValue("longitude", String(coordinates.lng))
        }
    }, [coordinates, form])

    const onSubmit = (data: FormData) => {
        onSubmitValues(data)
        form.reset();

        form.setValue("image", undefined);
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

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {["name", "latitude", "longitude"].map((fieldName) => (
                    <FormField
                        key={fieldName}
                        control={form.control}
                        name={fieldName as keyof FormData}
                        render={({ field: formField }) => (
                            <FormItem>
                                <FormLabel className="capitalize">{fieldName}</FormLabel>
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
                    render={({ field: formField }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    className="w-full border rounded-lg py-1.5 shadow px-2 text-slate-700 focus-visible:outline-none focus-visible:ring-1"
                                    {...formField}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="image"
                    render={() => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
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
                {previewUrl && (
                    <div className="pt-2">
                        <p className="text-sm text-gray-600 mb-1">Preview:</p>
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded border"
                        />
                    </div>
                )}
                <Button type="submit" className="w-full">Submit</Button>
            </form>
        </Form>
    )
}

export default FormPage;