import avtiveform from "@/pages/activeForm/z-routes";

let routes = [];
// 添加业务路由
routes = routes.concat(avtiveform);
routes = routes.concat([{ path: "*", redirect: "/activeForm" }]);
export default routes;
