import Api from "@/utils/api.js";

const ReportService = {
  async getSalesChart({queryKey}) {
    let [, type, start_date, end_date] = queryKey

    const params = new URLSearchParams()

    if (type === "week") {
      type = "day"
    }
    type && params.append("type", type)
    start_date && params.append("start_date", start_date)
    end_date && params.append("end_date", end_date)

    const {data} = await Api.get(`/reports/sales/chart/?${params.toString()}`)
    return data
  },
}

export default ReportService