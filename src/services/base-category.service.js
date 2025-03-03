import Api from "@/utils/api.js";

const BaseCategoryService = {
  async getAll() {
    const {data} = await Api.get(`/base-category/`)
    return data
  },

  async create(payload) {
    const {data} = await Api.post("/base-category/", payload)
    return data
  },

  async update(payload) {
    const {data} = await  Api.put(`/base-category/${payload.id}/`, {payload})
    return data
  },

  async updatePatch(formData) {
    const {data} = await  Api.patch(`/base-category/${formData.get("id")}/`, formData)
    return data
  },

  async getOne({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, id] = queryKey
    const {data} = await Api.get(`/base-category/${id}/`)
    return data
  },

  async delete(id) {
    const {data} = await Api.delete(`/base-category/${id}/`)
    return data
  },

}

export default BaseCategoryService