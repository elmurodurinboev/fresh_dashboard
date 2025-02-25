import api from "@/utils/api.js";
import Api from "@/utils/api.js";

const ShopService = {
  async getAll({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, page, page_size, search] = queryKey
    const params = new URLSearchParams()
    !!page && params.append("page", page)
    !!page_size && params.append("page_size", page_size)
    !!search && params.append("search", search)
    const {data} = await Api.get(`/shop/?${params.toString()}`)
    return data.result
  },

  async delete(id) {
    const {data} = await api.delete(`/shop/${id}/`)
    return data
  },

  async create(payload){
    const {data} = await api.post("/shop/", payload)
    return data
  },

  async getOne({queryKey}) {
    // eslint-disable-next-line no-unused-vars
    const [_, id] = queryKey
    const {data} = await api.get(`/shop/${id}/`)
    return data
  },

  async update(payload) {
    const {data} = await api.put(`/shop/${payload.id}/`, payload)
    return data
  },

  async getOwners() {
    const {data} = await api.get(`/shop_owners/`,)
    return data
  }
}
export default ShopService