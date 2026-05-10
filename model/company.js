import { DataSource } from './datasource';

class Company {
  static async getByCity(cityName) {
    return await DataSource.getCompaniesByCity(cityName);
  }

  static async searchByKeyword(keyword) {
    return await DataSource.searchCompanies(keyword);
  }

  static async getById(id) {
    return await DataSource.getCompanyById(id);
  }

  static async addCompanyInfo(companyData) {
    return await DataSource.addCompany(companyData);
  }
}

export {
  Company
}