import Api from "@/utils/api.js";

const CountryService = {
  async getAll() {
    const {data} = await Api.get("/country/")
    return data
  },
  async create(payload) {
    const {data} = await Api.post("/country/", payload)
    return data
  },
  async delete(id) {
    const {data} = await Api.delete(`/country/${id}/`)
    return data
  },
  async update(payload) {
    const {data} = await Api.put(`/country/${payload.id}/`, payload)
    return data
  },
  async getById({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, id] = queryKey
    const {data} = await Api.get(`/country/${id}/`)
    return data
  },
}

export default CountryService