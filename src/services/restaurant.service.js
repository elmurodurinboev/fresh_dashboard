import api from "@/utils/api.js";

const RestaurantService = {
  async getAll({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, page, page_size, search, owner] = queryKey
    const params = new URLSearchParams()
    !!page && params.append("page", page)
    !!search && params.append("search", search)
    !!owner && params.append("owner", owner)
    !!page_size && params.append("page_size", page_size)
    const {data} = await api.get(`/restaurant/?${params.toString()}`)
    return data.result
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
    const {data} = await api.put(`/restaurant/${payload.id}/`, payload.formData)
    return data
  },

  async updatePatch(payload) {
    const {data} = await api.patch(`/restaurant/${payload.id}/`, payload.formData)
    return data
  },

  async getOwners() {
    const {data} = await  api.get("/restaurant_owners/")
    return data
  }
}
export default RestaurantService