import Api from "@/utils/api.js";

const OrderService = {
  async getAll() {
    const {data} = await Api.get("/order-history/")
    return data
  }
}

export default OrderService