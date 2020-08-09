import axios from '../axios'
import YftestUrls from '../urls/yftest'

export default {
  // API-新增
  fetchYftestCreate (data) {
    return axios.post(YftestUrls.yftest, data)
  },
  // API-删除
  fetchYftestDelete (ids) {
    return axios.delete(YftestUrls.yftest, { ids })
  },
  // API-修改
  fetchYftestUpdate (data) {
    return axios.put(YftestUrls.yftest, data)
  },
  // API-详情
  fetchYftestDetail (data) {
    return axios.get(YftestUrls.yftest + `/${data.id}`)
  },
  // API-列表
  fetchYftestList (data) {
    return axios.get(YftestUrls.yftestList, data)
  },
  // API-验证
  fetchyftestUnique (data) {
    return axios.get(YftestUrls.yftestUnique, data)
  }
}
