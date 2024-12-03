import api from "@/utils/api.js";

const ProductService = {
  async getProducts() {
    const {data} = await api.get("/shop_product/")
    return data
  }
}

export default ProductService