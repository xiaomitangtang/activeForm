import BaseApiController from "@/config/api/baseapi";
// import * as request from "@/config/api/api.conf";
// import axios from "axios";

/**
 * @class 演示业务功能
 */
class DemoApiController extends BaseApiController {
  /*
    * @method 这里我们只做演示
    * @description 假设这里有很复杂的前端逻辑
    */
  formData = params => {
    return this.get(this.activeForm.formdata, params).then(res => res.data);
    // return axios.get(request.activeForm.demo, params).then(res => res.data);
  };
  formValid = params => {
    return this.get(this.activeForm.formvalid, params).then(res => res.data);
  };
  deleteTable = params => {
    return this.put(this.activeForm.deleteTable, params).then(res => res.data);
  };
  deleteTab = params => {
    return this.put(this.activeForm.deleteTab, params).then(res => res.data);
  };
  saveAnKa = params => {
    return this.put(this.activeForm.save, params).then(res => res.data);
  };
}
export default new DemoApiController();
