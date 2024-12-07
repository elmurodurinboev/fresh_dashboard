import api from "@/utils/api.js";

const ShopService = {
  async getAll() {
    const {data} = await api.get("/shop/")
    return data
  },

  async delete(id) {
    const {data} = await api.delete(`/shop/${id}/`)
    return data
  },

  async create(payload){
    const {data} = await api.post("/shop/", payload)
    return data
  },

  async getOne({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, id] = queryKey
    const {data} = await api.get(`/shop/${id}/`)
    return data
  },

  async update(payload) {
    const {data} = await api.put(`/shop/${payload.id}/`, {name: payload.name})
    return data
  },
}
export default ShopService