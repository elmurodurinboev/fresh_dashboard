import api from "@/utils/api.js";

const RestaurantService = {
  async getAll() {
    const {data} = await api.get("/restaurant/")
    return data
  },

  async delete(id) {
    const {data} = await api.delete(`/restaurant/${id}/`)
    return data
  },

  async create(payload){
    const {data} = await api.post("/restaurant/", payload)
    return data
  },

  async getOne({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, id] = queryKey
    const {data} = await api.get(`/restaurant/${id}/`)
    return data
  },

  async update(payload) {
    const {data} = await api.put(`/restaurant/${payload.id}/`, payload)
    return data
  },
}
export default RestaurantService