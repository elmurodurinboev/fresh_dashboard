import api from "@/utils/api.js";
import Api from "@/utils/api.js";

const RestaurantProductService = {
  async getProducts({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, page, page_size, search] = queryKey
    const params = new URLSearchParams()
    !!page && params.append("page", page)
    !!page_size && params.append("page_size", page_size)
    !!search && params.append("search", search)
    const {data} = await api.get(`/restaurant-product/?${params.toString()}`)
    return data
  },
  async create(payload) {
    const {data} = await api.post("/restaurant-product/", payload)
    return data
  },
  async delete(id) {
    const {data} = await api.delete(`/restaurant-product/${id}`)
    return data
  },
  async getOne({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, id] = queryKey
    const {data} = await api.get(`/restaurant-product/${id}`)
    return data
  },
  async update(payload) {
    const {data} = await api.put(`/restaurant-product/${payload.id}/`, payload.formData)
    return data
  },
  async updatePatch(payload) {
    const {data} = await api.patch(`/restaurant-product/${payload.id}/`, payload.formData)
    return data
  },

  // Best products
  async getBestProducts({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, page, page_size, search] = queryKey
    const params = new URLSearchParams()
    !!page && params.append("page", page)
    !!page_size && params.append("page_size", page_size)
    !!search && params.append("search", search)
    const {data} = await Api.get(`/best-restaurant-product-web/?${params.toString()}`)
    return data.result
  },
  async bestProductCreate(payload) {
    const {data} = await api.post("/best-restaurant-product-web/", payload)
    return data
  },
  async deleteBestProducts(id) {
    const {data} = await api.delete(`/best-restaurant-product-web/${id}`)
    return data
  },
  async getOneBest({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, id] = queryKey
    const {data} = await api.get(`/best-restaurant-product-web/${id}`)
    return data
  },
  async updatePatchBest(payload) {
    const {data} = await api.patch(`/best-restaurant-product-web/${payload.id}/`, payload.formData)
    return data
  },
}

export default RestaurantProductService