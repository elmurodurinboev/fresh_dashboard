import Api from "@/utils/api.js";
import api from "@/utils/api.js";

const ShopCategoryService = {
  async getAllSub({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, page, page_size, search] = queryKey
    const params = new URLSearchParams()
    !!page && params.append("page", page)
    !!page_size && params.append("page_size", page_size)
    !!search && params.append("search", search)
    const {data} = await Api.get(`/shop_category/?${params.toString()}`)
    return data.result
  },

  async create(payload) {
    const {data} = await Api.post("/shop_category/", payload)
    return data
  },

  async update(payload) {
    const {data} = await  Api.patch(`/shop_category/${payload.id}/`, payload.formData)
    return data
  },

  async getOne({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, id] = queryKey
    const {data} = await api.get(`/shop_category/${id}/`)
    return data
  },

  async delete(id) {
    const {data} = await api.delete(`/shop_category/${id}/`)
    return data
  },

}

export default ShopCategoryService