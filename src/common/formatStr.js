function packageStrTrim(param){
  //return "a"+param.trim().replace(/^\n+|\n+$/g,"")+"b";
  // return "a"+param.trim()+"b";
  return param.trim();
}

function packageFormatStr2(param){

  return param.trim();
}

/**
 * 设置权限数据
 * @param permission 权限数据对象，key必须与数据库中的权限key保持一致
 */
function loadPermission(permission){
  permission = permission || {};
  let privileges = JSON.parse(localStorage.getItem("buttonInfo") || '[]');
  let privilegesDIC = {};
  privileges.forEach((item) => {
    if (item) {
      privilegesDIC[item] = true;
    }
  })
  for (let permissionKey in permission) {
    permission[permissionKey].isShow = privilegesDIC[permissionKey] || false;
  }
}

/**
 * 日期格式化
 * @param fmt 格式
 * @return {*}
 */
Date.prototype.format = function (fmt) {
  let o = {
    "M+": this.getMonth() + 1,                 //月份
    "d+": this.getDate(),                    //日
    "h+": this.getHours(),                   //小时
    "m+": this.getMinutes(),                 //分
    "s+": this.getSeconds(),                 //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}


export default {
  // Vue.js的插件应当有一个公开方法 install。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象。
  install: function (Vue) {
    Vue.prototype.strTrim = (param) => packageStrTrim(param);
    Vue.prototype.global_formatStr2 = (param) => packageFormatStr2(param);
    Vue.prototype.loadPermission = (permission) => loadPermission(permission);
  }
}
