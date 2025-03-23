// src/pages/order/index.jsx
import {Layout} from "@/components/custom/layout.jsx";
import {useQuery} from "@tanstack/react-query";
import OrderService from "@/services/order.service.js";
import {ErrorBoundary} from "react-error-boundary";
import {GeneralErrorFallback} from "@/components/custom/general-error-fallback.jsx";
import OrderList from "./components/order-list.jsx";
import {useTranslations} from "use-intl";
import {Skeleton} from "@/components/ui/skeleton.jsx";

const OrderPage = () => {
    const t = useTranslations()
    const orderData = useQuery({
        queryKey: ["getAllOrders"],
        queryFn: OrderService.getAll,
    });

    return (
        <Layout>
            <Layout.Header/>
            <Layout.Body>
                <div className="mb-2 flex items-center justify-between space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">{t('orders')}</h2>
                </div>

                <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <ErrorBoundary fallback={<GeneralErrorFallback/>}>
                        {
                            orderData?.isLoading ? (
                                <Skeleton className={"w-full h-[500px] rounded-md"}/>
                            ) : (
                                orderData?.isSuccess && orderData?.data ? (
                                    <OrderList orders={orderData.data.result}/>
                                ) : (
                                    <p>{t('error.something_went_wrong')}</p>
                                )
                            )
                        }
                    </ErrorBoundary>
                </div>
            </Layout.Body>
        </Layout>
    );
};

export default OrderPage;
