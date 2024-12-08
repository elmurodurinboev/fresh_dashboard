import Api from "@/utils/api.js";

const SubcategoryService = {
  async getAllSub() {
    const {data} = await Api.get("/shop_subcategory/")
    return data
  }
}

export default SubcategoryService