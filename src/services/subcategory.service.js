import Api from "@/utils/api.js";

const SubcategoryService = {
  async getAllSub({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, page, page_size, search] = queryKey
    const params = new URLSearchParams()
    !!page && params.append("page", page)
    !!page_size && params.append("page_size", page_size)
    !!search && params.append("search", search)
    const {data} = await Api.get(`/shop_subcategory/?${params.toString()}`)
    return data.result
  },
  async create(payload) {
    const {data} = await Api.post("/shop_subcategory/",payload)
    return data
  },
  async delete(id) {
    const {data} = await Api.delete(`/shop_subcategory/${id}/`)
    return data
  },

  async update(formData) {
    const {data} = await Api.patch(`/shop_subcategory/${formData.get("id")}/`, formData)
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