import {Http} from "../utils/http";

class Banner{

    //获取轮播
    static async getHomeLocationA(){
        return await Http.request({
            url: `banner/list`
        })
    }
}

export {
    Banner
}