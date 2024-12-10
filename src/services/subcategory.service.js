import Api from "@/utils/api.js";

const SubcategoryService = {
  async getAllSub() {
    const {data} = await Api.get("/shop_subcategory/")
    return data
  },
  async create(payload) {
    const {data} = await Api.post("/shop_subcategory/",payload)
    return data
  },
  async delete(id) {
    const {data} = await Api.delete(`/shop_subcategory/${id}/`)
    return data
  },

  async update(payload) {
    const {data} = await Api.put(`/shop_subcategory/${payload.id}/`, payload)
    return data
  },

  async getOne({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, id] = queryKey
    const {data} = await Api.get(`/shop_subcategory/${id}/`)
    return data
  },

}

export default SubcategoryService