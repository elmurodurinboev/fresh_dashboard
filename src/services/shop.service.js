import api from "@/utils/api.js";

const ShopService = {
  async getAll() {
    const {data} = await api.get("/shop/")
    return data
  },
  async delete(id) {
    const {data} = await api.delete(`/shop/${id}`)
    return data
  },

  async create(payload){
    const {data} = await api.post("/shop/", payload)
    return data
  }
}
export default ShopService