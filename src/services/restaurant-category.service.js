import Api from "@/utils/api.js";
import api from "@/utils/api.js";

const RestaurantCategoryService = {
  async getAll() {
    const {data} = await Api.get("/restaurant-category/")
    return data
  },

  async create(payload) {
    const {data} = await Api.post("/restaurant-category/", payload)
    return data
  },

  async update(payload) {
    const {data} = await  Api.put(`/restaurant-category/${payload.id}/`, {payload})
    return data
  },

  async updatePatch(payload) {
    const {data} = await  Api.put(`/restaurant-category/${payload.id}/`, {payload})
    return data
  },

  async getOne({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, id] = queryKey
    const {data} = await api.get(`/restaurant-category/${id}/`)
    return data
  },

  async delete(id) {
    const {data} = await api.delete(`/restaurant-category/${id}/`)
    return data
  },

}

export default RestaurantCategoryService