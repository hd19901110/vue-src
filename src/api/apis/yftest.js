import axios from '../axios'
import YftestUrls from '../urls/yftest'

export default {
  // 研发测试-新增
  fetchYftestCreate (data) {
    return axios.post(YftestUrls.yftest, data)
  },
  // 研发测试-删除
  fetchYftestDelete (ids) {
    return axios.delete(YftestUrls.yftest, { ids })
  },
  // 研发测试-修改
  fetchYftestUpdate (data) {
    return axios.put(YftestUrls.yftest, data)
  },
  // 研发测试-详情
  fetchYftestDetail (data) {
    return axios.get(YftestUrls.yftest + `/${data.id}`)
  },
  // 研发测试-列表
  fetchYftestList (data) {
    return axios.get(YftestUrls.yftestList, data)
  },
  // 研发测试-验证
  fetchyftestUnique (data) {
    return axios.get(YftestUrls.yftestUnique, data)
  },
  // 学年学期
  // 学年学期-列表
  fetchYfXnxqList (data) {
    return axios.get(YftestUrls.yfXnxqList, data)
  },
  // 学年学期-详情
  fetchYfXnxqDetail (data) {
    return axios.get(YftestUrls.yfXnxq + `/${data.id}`)
  },
  // 学年学期-新增
  fetchYfXnxqCreate (data) {
    return axios.post(YftestUrls.yfXnxq, data)
  },
  // 学年学期-修改
  fetchYfXnxqUpdate (data) {
    return axios.put(YftestUrls.yfXnxq, data)
  },
  // 学年学期-删除
  fetchYfXnxqDelete (ids) {
    return axios.delete(YftestUrls.yfXnxq, { ids })
  },
  // 学年学期-验证
  fetchYfXnxqUnique (data) {
    return axios.get(YftestUrls.yfXnxqUnique, data)
  },
  // 班级
  // 班级-列表
  fetchYfBjList (data) {
    return axios.get(YftestUrls.yfBjList, data)
  },
  // 班级-详情
  fetchYfBjDetail (data) {
    return axios.get(YftestUrls.yfBj + `/${data.id}`)
  },
  // 学年学期-新增
  fetchYfBjCreate (data) {
    return axios.post(YftestUrls.yfBj, data)
  },
  // 班级-修改
  fetchYfBjUpdate (data) {
    return axios.put(YftestUrls.yfBj, data)
  },
  // 班级-删除
  fetchYfBjDelete (ids) {
    return axios.delete(YftestUrls.yfBj, { ids })
  },
  // 班级-验证
  fetchYfBjUnique (data) {
    return axios.get(YftestUrls.yfBjUnique, data)
  }

}
