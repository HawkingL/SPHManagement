//获取品牌管理的数据
import request from '@/utils/request';

//获取品牌列表接口
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' });

//修改品牌的请求和添加品牌的请求（添加品牌的请求不需要传ID，ID是有服务器生成的）
export const reqAddUpdateTradeMark = (tradeMark) => {
  //检测传过来的参数是否有id，从而判断应该发送修改品牌的请求还是添加品牌的请求
  if (tradeMark.id) {
    //修改品牌信息
    return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark });
  } else {
    //添加品牌信息
    return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark });
  }
}

//删除品牌的接口
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' });
