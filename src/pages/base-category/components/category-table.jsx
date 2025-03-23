import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/custom/button";
import {DotsHorizontalIcon} from "@radix-ui/react-icons";
import DefaultImage from "@/components/custom/default-image";

const CategoryTable = ({categories, onEdit, onDelete}) => {
    return (
        <div className="rounded-md border min-h-[600px] flex flex-col justify-between">
            {
                categories && categories?.length > 0 ?
                    (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nomi va rasmi</TableHead>
                                    <TableHead className="text-end"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    categories.map((category) => (
                                        <TableRow key={category?.id} className="bg-secondary">
                                            <TableCell className="flex gap-2 items-center overflow-hidden">
                                                {category?.image ? (
                                                    <img
                                                        src={category?.image}
                                                        alt="category_image"
                                                        className="w-[48px] h-[48px] rounded-md object-cover"
                                                    />
                                                ) : (
                                                    <DefaultImage/>
                                                )}
                                                <span>{category?.name}</span>
                                            </TableCell>
                                            <TableCell className="text-end">
                                                <div className="w-auto flex justify-end items-center">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                                                            >
                                                                <DotsHorizontalIcon className="h-4 w-4"/>
                                                                <span className="sr-only">Open menu</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-[160px]">
                                                            <DropdownMenuItem onClick={() => onEdit(category?.id)}>Edit</DropdownMenuItem>
                                                            <DropdownMenuSeparator/>
                                                            <DropdownMenuItem
                                                                onClick={() => onDelete(category)}>Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    )
                    :
                    (
                        <div className={"text-center my-2"}>Ma'lumot topilmadi</div>
                    )

            }
        </div>
    )
};

export default CategoryTable;
