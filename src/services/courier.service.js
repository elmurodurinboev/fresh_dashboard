import Api from "@/utils/api.js";

const CourierService = {
  async getAll({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, page, page_size, search] = queryKey
    const params = new URLSearchParams()
    !!page && params.append("page", page)
    !!search && params.append("search", search)
    !!page_size && params.append("page_size", page_size)
    const {data} = await Api.get(`/courier/?${params.toString()}`)
    return data.result
  },
  async create(payload) {
    const {data} = await Api.post("/courier/create/", payload)
    return data
  },
  async getById({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, id] = queryKey
    const {data} = await Api.get(`/courier/${id}/`)
    return data.result
  },
  async delete(id) {
    const {data} = await Api.delete(`/courier/${id}/`)
    return data
  },
  async update(formData) {
    const {data} = await Api.put(`/courier/${formData.get("id")}/`, formData)
    return data
  }
}

export default CourierService