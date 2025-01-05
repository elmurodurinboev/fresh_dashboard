
import api from "@/utils/api.js";

const CashFlowService = {
  async getAll() {
    const {data} = await api.get("/restaurant-finance-flow/")
    return data
  },

  async create(payload){
    const {data} = await api.post("/restaurant-finance-flow/", payload)
    return data
  },
}
export default CashFlowService