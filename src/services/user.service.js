import Api from "@/utils/api.js";

const UserService = {
  async getAll({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, page, page_size, search, role] = queryKey
    const params = new URLSearchParams()
    !!page && params.append("page", page)
    !!search && params.append("search", search)
    !!role && params.append("user_role", role)
    !!page_size && params.append("page_size", page_size)
    const {data} = await Api.get(`/user/?${params.toString()}`)
    return data
  },

  async getById({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, id] = queryKey
    const {data} = await Api.get(`/user/${id}/`)
    return data
  },

  async delete(id) {
    const {data} = await Api.delete(`/user/${id}/`)
    return data
  },
  async create(payload) {
    const {data} = await Api.post("/user/", payload)
    return data
  },
  async update(formData) {
    const {data} = await Api.patch(`/user/${formData.get("id")}/`, formData)
    return data
  }
}

export default UserService