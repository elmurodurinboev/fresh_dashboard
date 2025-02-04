import Api from "@/utils/api.js";

const OrderService = {
  async getAll() {
    const {data} = await Api.get("/order-history/")
    return data
  },
  async change(payload) {
    const {data} = await Api.patch(`/order/update/${payload.id}/?type=${payload.type}`, {status: payload.status})
    return data
  }
}

export default OrderService