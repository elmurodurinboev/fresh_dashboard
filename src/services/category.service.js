import Api from "@/utils/api.js";

const CategoryService = {
  async getAllSub() {
    const {data} = await Api.get("/shop_subcategory/")
    return data
  }
}

export default CategoryService