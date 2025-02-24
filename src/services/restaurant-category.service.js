import Api from "@/utils/api.js";

const RestaurantCategoryService = {
  async getAll({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, page, page_size, search] = queryKey
    const params = new URLSearchParams()
    !!page && params.append("page", page)
    !!page_size && params.append("page_size", page_size)
    !!search && params.append("search", search)
    const {data} = await Api.get(`/restaurant-category/${params.toString()}`)
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

  async updatePatch(formData) {
    const {data} = await  Api.patch(`/restaurant-category/${formData.get("id")}/`, formData)
    return data
  },

  async getOne({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, id] = queryKey
    const {data} = await Api.get(`/restaurant-category/${id}/`)
    return data
  },

  async delete(id) {
    const {data} = await Api.delete(`/restaurant-category/${id}/`)
    return data
  },

}

export default RestaurantCategoryService