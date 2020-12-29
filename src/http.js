import axios from 'axios'
import qs from 'qs'
import {
	road
} from './road.js'

axios.defaults.timeout = 150000; //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; //配置请求头
// axios.defaults.headers.post['isToken'] = 'true';
// axios.defaults.headers.post['Authorization'] = 'Bearer '+window.localStorage.getItem('access_token');

//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
	//在发送请求之前做某件事
	// if(config.method  === 'post'){
	//     config.data = qs.stringify(config.data);
	// }
	if (config.method == 'get') {
		config.data = true
	}
	let access_token = window.localStorage.getItem("access_token")
	if (access_token) {
		config.headers.Authorization = 'Bearer ' + access_token;
	}
	return config;
}, (error) => {
	console.log('错误的传参')
	return Promise.reject(error);
});
let message = true
let message401 = true
let message403 = true
let message404 = true
let message500 = true
let message501 = true
let message503 = true
let message504 = true

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) => {
		//对响应数据做些事
		if (!res.data.success) {
			return Promise.resolve(res);
		}
		return res;
	},
	(error) => {
		console.log(error.response);
		var originalRequest = error.config;
		if (error.code == 'ECONNABORTED' && error.message.indexOf('timeout') != -1 && !originalRequest._retry) {
			originalRequest._retry = true
			//			alert("请求超时，请检查网络或稍后重试。");
			if (message) {
				message = false

				road.$message({
					message: '请求超时，请检查网络或稍后重试',
					type: 'warning',
					duration: 5000,
					onClose: function() {
						message = true
					}
				});
			}
			return Promise.reject(error);
		}

		if (error.response) {
			switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          let info = error.response.data.messageInfo;
          let au = "([\w\-]+)";
          var numRe = new RegExp(au);
          console.log(info);
          if (numRe.test(info)) {
            if (message401) {
              message401 = false
              road.$message({
                message: '登录已超时，请重新登录',
								type: 'warning',
								duration: 5000,
								onClose: function() {
									message401 = true
								}
              });
            }
            window.localStorage.removeItem('access_token');
            road.$emit('goto', '/login');
          }

          break;
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
          if (message403) {
            message403 = false
            road.$message({
              //							message: error.response.data.messageInfo,
              message: "您没有操作权限,请联系管理员",
              type: 'warning',
              duration: 3000,
              onClose: function () {
                message403 = true
              }
            });
          }
          // 清除token
          // localStorage.removeItem('token');
          // store.commit('loginSuccess', null);
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          // road.$emit('goto', '/login');
          break;

					// 404请求不存在
				case 404:
					if (message404) {
						message404 = false
						road.$message({
							message: '404网络请求不存在',
							type: 'warning',
							duration: 5000,
							onClose: function() {
								message404 = true
							}
						});
					}
					break;
				case 503:
					if (message503) {
						message503 = false
						road.$message({
							message: '请检查您的网络',
							type: 'warning',
							duration: 5000,
							onClose: function() {
								message503 = true
							}
						});
					}
					break;
				case 504:
					if (message504) {
						message504 = false
						road.$message({
							message: '服务器开小差了，请联系管理员',
							type: 'warning',
							duration: 5000,
							onClose: function() {
								message504 = true
							}
						});
					}
					break;
				case 501:
					if (message501) {
						message501 = false
						road.$message({
							message: '服务器开小差了，请稍后再试',
							type: 'warning',
							duration: 5000,
							onClose: function() {
								message501 = true
							}
						});
					}
					break;
					// case 500:
					// 	if(message500) {
					// 		message500 = false
					// 		road.$message({
					// 			message: '服务器开小差了，请稍后再试',
					// 			type: 'warning',
					// 			duration:5000,
					// 			onClose: function() {
					// 				message500 = true
					// 			}
					// 		});
					// 	}
					// 	break;

					// 其他错误，暂不处理
					// default:
					// if(error.response.data.message)
					//   alert(error.response.data.message);
					// else
					//   alert(error.response.data);

			}

		}
		return Promise.reject(error);
	});

//返回一个Promise(发送post请求)
export function post(url, params) {
	return new Promise((resolve, reject) => {
		params = qs.stringify(params);
		axios.post(url, params)
			.then(response => {
				resolve(response);
			}, err => {
				reject(err);
			})
			.catch((error) => {
				reject(error)
			})
	})
}
export function post3(url, params) {
	return new Promise((resolve, reject) => {
		params = qs.stringify(params);
		axios.post(url, params, {
				'responseType': 'blob'
			})
			.then(response => {
				resolve(response);
			}, err => {
				reject(err);
			})
			.catch((error) => {
				reject(error)
			})
	})
}
export function post4(url, params) {
	return new Promise((resolve, reject) => {
		axios.post(url, params, {
				'responseType': 'blob'
			})
      .then(response => {
        resolve(response);
      }, err => {
        reject(err);
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function postOriginal(url, params, config) {
  return new Promise((resolve, reject) => {
    axios.post(url, params, config)
      .then(response => {
        resolve(response);
      }, err => {
        reject(err);
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function postRequestJSONResponseBlob(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        resolve(response);
			}, err => {
				reject(err);
			})
			.catch((error) => {
				reject(error)
			})
	})
}
export function post2(url, params) {
	return new Promise((resolve, reject) => {
		axios.post(url, params, {
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then(response => {
				resolve(response);
			}, err => {
				reject(err);
			})
			.catch((error) => {
				reject(error)
			})
	})
}
//返回一个Promise(发送get请求)
export function get(url) {
	return new Promise((resolve, reject) => {
		axios.get(url)
			.then(response => {
				resolve(response)
			}, err => {
				reject(err)
			})
			.catch((error) => {
				reject(error)
			})
	})
}

export function get2(url, params) {
	return new Promise((resolve, reject) => {
		axios.get(url, {
				params: params
			})
			.then(response => {
				resolve(response);
			}, err => {
				reject(err);
			})
			.catch((error) => {
				reject(error)
			})
	})
}
export function put(url, params) {
	return new Promise((resolve, reject) => {
		axios.put(url, params, {
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then(response => {
				resolve(response);
			}, err => {
				reject(err);
			})
			.catch((error) => {
				reject(error)
			})
	})
}

export function deletes(url, params) {
	return new Promise((resolve, reject) => {
		axios.delete(url, params)
			.then(response => {
				resolve(response);
			}, err => {
				reject(err);
			})
			.catch((error) => {
				reject(error)
			})
	})
}

export default {
  post,
  post2,
  post3,
  post4,
  postOriginal,
  postRequestJSONResponseBlob,
  put,
  deletes,
  get,
  get2
}
