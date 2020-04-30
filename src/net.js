import axios from 'axios';
// 创建实例时设置配置的默认值


const baseUrl = 'http://47.115.74.95:3000'

axios.defaults.timeout = 30000
axios.defaults.baseURL = baseUrl
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.adapter = function (config) {
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  return new Promise((resolve, reject) => {
    let data = config.method === 'get' ? config.params : config.data
    // wx小程序 发起请求相应 log 就可以看到熟悉的返回啦
    // console.log(config)
    wx.request({
      url: config.baseURL + config.url,
      method: config.method,
      data: data,
      success: (res) => {
        return resolve(res)
      },
      fail: (err) => {
        return reject(err)
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  })
}

// 请求拦截器
axios.interceptors.request.use(function (request) {
  // request.headers.token = 'token=11124654654687';
  // console.log(request) // 请求成功
  return request
}, function (error) {
  // console.log(error); // 请求失败
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  console.log(response.data.data) // 响应成功
  return response
}, function (error) {
  // console.log(error); // 响应失败
  return Promise.reject(error)
})
var instance = axios.create();
export default instance;