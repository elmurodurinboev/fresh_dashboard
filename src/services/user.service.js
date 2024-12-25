import Api from "@/utils/api.js";

const UserService = {
  async getAll() {
    const {data} = await Api.get("/user/")
    return data
  },
  async delete(id) {
    const {data} = await Api.delete(`/user/${id}/`)
    return data
  },
  async create(payload) {
    const {data} = await Api.post("/user/", payload)
    return data
  }
}

export default UserService