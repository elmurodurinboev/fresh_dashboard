import api from "@/utils/api.js";

const ShopProductService = {
  async getProducts({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, page, page_size, search] = queryKey
    const params = new URLSearchParams()
    !!page && params.append("page", page)
    !!page_size && params.append("page_size", page_size)
    !!search && params.append("search", search)
    const {data} = await api.get(`/shop_product/?${params.toString()}`)
    return data.result
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