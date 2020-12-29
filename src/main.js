// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './app'
import router from './router'
import ElementUI from 'element-ui'
// import axios from 'axios'
// import qs from 'qs'
import store from './store.js'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/iconfont.css'
import '@/assets/css/style.css'
import http from './http.js'
// import echarts from "echarts";
import globalFunc from "@/common/formatStr.js";
import '@/assets/icon-logo/iconfont.css'
// import $ from 'jquery'
//import AFTableColumn from 'af-table-column'
import VueQr from 'vue-qr'
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap,{ak:'eE2Ps0gGCg5cHKnpgbQTq1G2DGKjGu2m'})
// Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(globalFunc)
//Vue.use(AFTableColumn)
Vue.use(VueQr)
Vue.prototype.$axios = http
// Vue.prototype.$axios2 = http2

Vue.component('footer-copyright', {
	template: '<p class="footer-msg"></p>'
});

Vue.filter('formatDateTime', function(value) {
	if(!value) return ''
	let date = new Date(value);
	let y = date.getFullYear() + '/';
	let mon = (date.getMonth() + 1) + '/';
	let d = date.getDate();
	return y + mon + d;
});

new Vue({
	router,
	store,
	el: '#app',
	render: h => h(App)
})
