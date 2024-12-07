import api from "@/utils/api.js";

const ProductService = {
  async getProducts() {
    const {data} = await api.get("/shop_product/")
    return data
  },
  async create(payload){
    const {data} = await api.post("/shop_product/", payload)
    return data
  }
}

export default ProductService