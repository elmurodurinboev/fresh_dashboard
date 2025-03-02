import api from "@/utils/api.js";

const CashFlowService = {
  async getAll() {
    const {data} = await api.get("/restaurant-finance-flow/")
    return data
  },

  async create(payload) {
    const {data} = await api.post("/restaurant-finance-flow/", payload)
    return data
  },

  async getRestaurantsAccounts() {
    const {data} = await api.get("/get-restaurant-fee/")
    return data.result
  },
  async getAccountsHistory({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, page, page_size,restaurant, start_date, end_date] = queryKey
    const params = new URLSearchParams()
    !!page && params.append("page", page)
    !!page_size && params.append("page_size", page_size)
    !!start_date && params.append("start_date", start_date)
    !!end_date && params.append("end_date", end_date)
    !!restaurant && params.append("restaurant", restaurant)
    const {data} = await api.get(`/restaurant-fee/?${params.toString()}`)
    return data
  },

}
export default CashFlowService