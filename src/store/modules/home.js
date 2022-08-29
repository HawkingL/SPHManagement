import mockRequest from '@/utils/mockRequest';

const actions = {
  //发请求获取首页mock数据
  async getData({ commit }) {
    let result = await mockRequest.get('./home/list');
    if (result.code == 20000) {
      commit('GETSATA', result.data);
    }
  }
};
const mutations = {
  GETSATA(state, list) {
    state.list = list;
  }
};
const state = {
  list: {}
};
const getters = {};
export default {
  actions,
  mutations,
  state,
  getters
}