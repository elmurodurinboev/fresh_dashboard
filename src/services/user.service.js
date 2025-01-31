import Api from "@/utils/api.js";

const UserService = {
  async getAll() {
    const {data} = await Api.get("/user/")
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