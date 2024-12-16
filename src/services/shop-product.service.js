import api from "@/utils/api.js";

const ShopProductService = {
  async getProducts() {
    const {data} = await api.get("/shop_product/")
    return data
  },
  async create(payload) {
    const {data} = await api.post("/shop_product/", payload)
    return data
  },
  async delete(id) {
    const {data} = await api.delete(`/shop_product/${id}`)
    return data
  },
  async getOne({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, id] = queryKey
    const {data} = await api.get(`/shop_product/${id}`)
    return data
  },
  async update(payload) {
    const {data} = await api.put(`/shop_product/${payload.id}/`, payload.formData)
    return data
  },
  async updatePatch(payload) {
    const {data} = await api.patch(`/shop_product/${payload.id}/`, payload.formData)
    return data
  },


}

export default ShopProductService