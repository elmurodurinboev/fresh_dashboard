import api from "@/utils/api.js";

const AdsService = {
  async getAll() {
    const {data} = await api.get("/ads-web/")
    return data.result
  },

  async delete(id) {
    const {data} = await api.delete(`/ads-web/${id}/`)
    return data
  },

  async create(payload) {
    const {data} = await api.post("/ads-web/", payload)
    return data
  },

  async getOne({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, id] = queryKey
    const {data} = await api.get(`/ads-web/${id}/`)
    return data
  },


  async updatePatch(payload) {
    const {data} = await api.patch(`/ads-web/${payload.id}/`, payload.formData)
    return data
  }
}
export default AdsService