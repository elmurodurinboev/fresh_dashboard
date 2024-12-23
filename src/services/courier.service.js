import Api from "@/utils/api.js";

const CourierService = {
  async getAll() {
    const {data} = await Api.get("/get-couiers/")
    return data
  },
  async delete(id) {
    const {data} = await Api.delete(`/courier-profile/${id}/`)
    return data
  }
}

export default CourierService