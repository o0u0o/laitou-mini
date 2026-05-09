import { DataSource } from './datasource';

class Company {
  static cityName = '深圳'

  static async getCompanyByCity() {
    return await DataSource.getCompaniesByCity(Company.cityName);
  }

  static async searchByKeyword(keyword) {
    return await DataSource.searchCompanies(keyword);
  }

  static async addCompanyInfo(companyData) {
    return await DataSource.addCompany(companyData);
  }
}

export {
  Company
}