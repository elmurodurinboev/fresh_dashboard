import api from "@/utils/api.js";

const ProductService = {
  async getProducts() {
    const {data} = await api.get("/shop_product/")
    return data
  },
  async create(payload){
    const {data} = await api.post("/shop_product/", payload)
    return data
  },
  async delete(id) {
    const {data} = await api.delete(`/shop_product/${id}`)
    return data
  }
}

export default ProductService