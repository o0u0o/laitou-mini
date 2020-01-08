import {Http} from "../utils/http";

class Company{
  static cityName = '深圳'

  static async getCompanyByCity(){
    const name = `${Company.cityName}`
    return await Http.request({
      url: `/app/company/list/city/${Company.cityName}`,
      data:{
        name
      }
    })
  }
}

export {
  Company
}