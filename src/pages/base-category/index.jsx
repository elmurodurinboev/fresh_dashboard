import {Layout} from "@/components/custom/layout.jsx";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {useQuery, useMutation} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {toast} from "@/hooks/use-toast.js";
import DeleteConfirmationModal from "@/components/custom/delete-confirmation-modal.jsx";
import BaseCategoryService from "@/services/base-category.service.js";
import CategoryTable from "./components/category-table.jsx";
import {Button} from "@/components/ui/button.jsx";

const BaseCategoryPage = () => {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState({});
    const navigate = useNavigate();

    const categoryData = useQuery({
        queryKey: ["getAllBaseCategories"],
        queryFn: BaseCategoryService.getAll,
    });

    const deleteMutation = useMutation({
        mutationFn: BaseCategoryService.delete,
        onSuccess: async () => {
            toast({title: "OK", variant: "success", description: "Muvaffaqiyatli o'chirildi"});
            setDeleteModal(false);
            setSelectedCategory({});
            await categoryData.refetch();
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Error",
                description: error?.message || "Messages.error_occurred",
            });
            setDeleteModal(false);
        },
    });

    const handleDelete = (category) => {
        setSelectedCategory(category);
        setDeleteModal(true);
    };

    return (
        <Layout>
            <Layout.Header/>
            <Layout.Body>
                <div className="flex items-center justify-between space-y-2 mb-4">
                    <h2 className="text-2xl font-bold tracking-tight">Umumiy kategoriyalar</h2>
                    <Button onClick={() => navigate("create")}>Qo'shish</Button>
                </div>

                <div className="-mx-4 flex-1 overflow-auto px-4 py-1">
                    {categoryData?.isLoading ? (
                        <Skeleton className="rounded-md border h-[500px]"/>
                    ) : (
                        <CategoryTable
                            categories={categoryData.data?.result || []}
                            onEdit={(id) => navigate(`/base-category/update/${id}`)}
                            onDelete={handleDelete}
                        />
                    )}
                </div>

                <DeleteConfirmationModal
                    open={deleteModal}
                    setOpen={setDeleteModal}
                    handleDelete={() => deleteMutation.mutate(selectedCategory.id)}
                    handleClose={() => {
                        setDeleteModal(false);
                        setSelectedCategory({});
                    }}
                />
            </Layout.Body>
        </Layout>
    );
};

export default BaseCategoryPage;
