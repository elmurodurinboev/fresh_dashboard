import api from "@/utils/api.js";

const RestaurantProductService = {
  async getProducts() {
    const {data} = await api.get("/restaurant-product/")
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
  async getBestProducts() {
    const {data} = await api.get("/best-restaurant-product-web/")
    return data
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