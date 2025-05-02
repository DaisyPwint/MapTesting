import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FormValues } from '@/type/type';
import { Eye, Pencil } from 'lucide-react';
import { useState } from 'react';
import FormPage from './FormPage';
import Map from './Map';

interface LocationListProps {
    locations: FormValues[];
}

function LocationList({ locations }: LocationListProps) {
    const [selected, setSelected] = useState<FormValues | null>(null);
    const [mode, setMode] = useState<'view' | 'edit' | null>(null);

    const openModal = (location: FormValues, type: 'view' | 'edit' | null) => {
        setSelected(location);
        setMode(type);
    }

    const closeModal = () => {
        setSelected(null);
        setMode(null);
    }

    const handleEdit = (value: boolean) => {
        if (value) closeModal()
    }

    return (
        <>
            <Table className="rounded-md border my-5 bg-white">
                <TableHeader>
                    <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Latitude</TableHead>
                        <TableHead>Longitude</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        locations?.map((location: FormValues, index: number) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>{location.name}</TableCell>
                                <TableCell>{location.latitude}</TableCell>
                                <TableCell>{location.longitude}</TableCell>
                                <TableCell>{location.description}</TableCell>
                                <TableCell>
                                    <div className="flex justify-center gap-2">
                                        <Button variant="outline" size="sm" onClick={() => openModal(location, "view")}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            Detail
                                        </Button>
                                        <Button variant="default" size="sm" onClick={() => openModal(location, "edit")}>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                        )
                    }
                </TableBody>
            </Table>

            <Dialog open={!!selected} onOpenChange={closeModal}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{mode === "view" ? "Location Details" : "Edit Location"}</DialogTitle>
                    </DialogHeader>
                    {
                        (selected && mode === "view") && (
                            <>
                                <div className='flex gap-3 mb-2'>
                                    {
                                        selected?.image && <img
                                            src={URL.createObjectURL(selected.image)}
                                            alt="Image"
                                            className="w-12 h-12 object-cover rounded-full border"
                                        />
                                    }
                                    <div className="flex flex-col gap-1">
                                        <span className="text-lg">{selected.name}</span>
                                        {selected?.description && <p style={{ marginBlock: 1 }}>{selected?.description}</p>}
                                        <div>
                                            <span className="text-sm text-slate-600">{selected.latitude}</span>, <span className="text-sm text-slate-600">{selected.longitude}</span>
                                        </div>
                                    </div>
                                </div>
                                <Map locationData={selected} viewOnly={true} />
                            </>
                        )
                    }
                    {
                        (selected && mode === "edit") && <FormPage detailData={selected} handleEdit={handleEdit} />
                    }
                </DialogContent>
            </Dialog>
        </>
    )
}

export default LocationList