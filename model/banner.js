import { DataSource } from './datasource';

class Banner {
    // 获取轮播
    static async getHomeLocationA() {
        return await DataSource.getBanners();
    }
}

export {
    Banner
}