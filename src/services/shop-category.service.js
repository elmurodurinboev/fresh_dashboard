import Api from "@/utils/api.js";
import api from "@/utils/api.js";

const ShopCategoryService = {
  async getAllSub() {
    const {data} = await Api.get("/shop_category/")
    return data
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