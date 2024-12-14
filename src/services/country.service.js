import Api from "@/utils/api.js";

const CountryService = {
  async getAll() {
    const {data} = await Api.get("/country/")
    return data
  }
}

export default CountryService