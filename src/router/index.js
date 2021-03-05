/**
 * Created by yqr on 2018/3/26.
 */
import Vue from 'vue'
import Router from 'vue-router'
import TopNav from '@/components/nav/topNav.vue'
import LeftNav from '@/components/nav/leftNav.vue'
import Home from '@/views/home.vue'
import Dashboard from '@/views/workbench/panel.vue'
import PanelSearch from '@/views/workbench/panelSearch.vue'
import NotFound from '@/components/404.vue'
import NotPermission from '@/components/noPermission.vue'
import prmindex from '@/views/prm/index.vue'
import hrsindex from '@/views/hrs/index.vue'
import afindex from '@/views/af/index.vue'
import cssindex from '@/views/css/index.vue'
import EfForLogin from '@/views/loginEf.vue'
import commonOrderTrackExternal from '@/views/public/order_track_external.vue'

//PRM
const prm_category = resolve => require(['@/views/prm/prm_category.vue'], resolve)
const prm_coop = resolve => require(['@/views/prm/prm_coop.vue'], resolve)
const prm_coop_agreement = resolve => require(['@/views/prm/prm_coop_agreement.vue'], resolve)
const prm_coop_agreement_settlement = resolve => require(['@/views/prm/prm_coop_agreement_settlement.vue'], resolve)
const prm_coop_bill = resolve => require(['@/views/prm/prm_coop_bill.vue'], resolve)
const prm_coop_check = resolve => require(['@/views/prm/bill/prm_bill_base.vue'], resolve)
const prm_coop_settle = resolve => require(['@/views/prm/bill/prm_bill_settle.vue'], resolve)
const prm_log = resolve => require(['@/views/prm/prm_log.vue'], resolve)
const prm_shipperConsignee = resolve => require(['@/views/af/base/af_shipperConsignee.vue'], resolve)
const prm_inquiry_agent = resolve => require(['@/views/prm/prm_inquiry_agent.vue'], resolve)
const prm_service = resolve => require(['@/views/prm/prm_service.vue'], resolve)
const prm_cloud_user = resolve => require(['@/views/prm/prm_cloud_user.vue'], resolve)
const prm_coop_share = resolve => require(['@/views/prm/prm_coop_share.vue'], resolve)
const externalCoopShare = resolve => require(['@/views/prm/coopshare/external_coop_share.vue'], resolve)
const prm_report_receivable_age = resolve => require(['@/views/prm/prm_report_receivable_age.vue'], resolve)
const prm_budget = resolve => require(['@/views/prm/prm_budget.vue'], resolve)

//HRS
const hrs_org = resolve => require(['@/views/hrs/hrs_org.vue'], resolve)
const hrs_permission = resolve => require(['@/views/hrs/hrs_permission.vue'], resolve)
const hrs_role = resolve => require(['@/views/hrs/hrs_role.vue'], resolve)
const hrs_dept = resolve => require(['@/views/hrs/hrs_dept.vue'], resolve)
const hrs_user = resolve => require(['@/views/hrs/hrs_user.vue'], resolve)
const hrs_user_workgroup = resolve => require(['@/views/hrs/workgroup/hrs_user_workgroup.vue'], resolve)
const hrs_log = resolve => require(['@/views/hrs/hrs_log.vue'], resolve)
const hrs_notice = resolve => require(['@/views/hrs/hrs_notice.vue'], resolve)
const hrs_version = resolve => require(['@/views/hrs/hrs_version.vue'], resolve)
const hrs_signtemplate = resolve => require(['@/views/hrs/hrs_signtemplate.vue'], resolve)
const unPermission = resolve => require(['@/components/unPermission.vue'], resolve)
const unDevelop = resolve => require(['@/components/unDev.vue'], resolve)
const hrs_orgUser = resolve => require(['@/views/hrs/hrs_orgUser.vue'], resolve)
const hrs_org_configure = resolve => require(['@/views/hrs/hrs_org_configure.vue'], resolve)
const hrs_doc = resolve => require(['@/views/hrs/hrs_doc.vue'], resolve)

//AFBASE
const af_base = resolve => require(['@/views/af/af_base.vue'], resolve)
const af_orderair = resolve => require(['@/views/af/base/af_shipperConsignee1.vue'], resolve)
const af_order = resolve => require(['@/views/af/af_order.vue'], resolve)
const af_oporder = resolve => require(['@/views/af/af_operation_order.vue'], resolve)
const ai_order = resolve => require(['@/views/af/ai_order.vue'], resolve)
const af_tariff_details = resolve => require(['@/views/af/af_tariff_details.vue'], resolve)
const af_service_template = resolve => require(['@/views/af/af_service_template.vue'], resolve)
const af_operationPlan = resolve => require(['@/views/af/af_operationPlan.vue'], resolve)
const af_operationLook = resolve => require(['@/views/af/af_operationLook.vue'], resolve)
const af_awbPrint = resolve => require(['@/views/af/af_awbPrint.vue'], resolve)
const af_inbound = resolve => require(['@/views/af/af_inbound.vue'], resolve)
const af_css_debit_note = resolve => require(['@/views/af/af_css_debit_note.vue'], resolve)
const af_css_payment = resolve => require(['@/views/af/af_css_payment.vue'], resolve)
const af_enquiry_manage = resolve => require(['@/views/af/af_enquiry_manage.vue'], resolve)
const af_price_search = resolve => require(['@/views/workbench/priceSearch.vue'], resolve)
const send_product = resolve => require(['@/views/workbench/sendProduct.vue'], resolve)
const af_currencyrate = resolve => require(['@/views/af/base/currencyrate/af_currencyrate.vue'], resolve)
const af_service = resolve => require(['@/views/af/base/service/af_service.vue'], resolve)
const af_financial_account = resolve => require(['@/views/af/base/financialAccount/af_financial_account.vue'], resolve)
const af_city = resolve => require(['@/views/af/base/city/af_cities.vue'], resolve)
const af_awb = resolve => require(['@/views/af/base/af_awb.vue'], resolve)
const af_airport = resolve => require(['@/views/af/base/af_airport.vue'], resolve)
const af_warehouse = resolve => require(['@/views/af/base/af_warehouse.vue'], resolve)
const af_warehouse_letter = resolve => require(['@/views/af/base/af_warehouse_letter.vue'], resolve)
const af_carrier = resolve => require(['@/views/af/base/carrier/af_carrier.vue'], resolve)
const af_flight = resolve => require(['@/views/af/base/af_flight.vue'], resolve)
const af_tact = resolve => require(['@/views/af/base/af_tact.vue'], resolve)
const af_tact_public = resolve => require(['@/views/af/base/af_tact_public.vue'], resolve)
const af_order_delivery_notice = resolve => require(['@/views/af/order/deliveryNotice/af_order_delivery_notice_external.vue'], resolve)
const af_aircraft = resolve => require(['@/views/af/base/af_aircraft.vue'], resolve)
const af_order_inquiry = resolve => require(['@/views/af/af_order_inquiry.vue'], resolve)
const af_order_inquiry_quotation = resolve => require(['@/views/af/orderInquiry/other/inquiry_quotation_external.vue'], resolve)
const af_order_lock_unlock_list = resolve => require(['@/views/af/af_order_lock_unlock_list.vue'], resolve)
const af_surcharge = resolve => require(['@/views/af/base/af_surcharge.vue'], resolve)
const orderShareQrcodeTrack = resolve => require(['@/views/af/order/share/orderShareQrcodeTrack.vue'], resolve)
const fhl_operation = resolve => require(['@/views/af/af_fhl_operation.vue'], resolve)
const ai_customs_declaration = resolve => require(['@/views/af/ai_customs_declaration.vue'], resolve)
const ai_operationLook = resolve => require(['@/views/af/ai_operationLook.vue'], resolve)
const branch_line = resolve => require(['@/views/line/af_branch_line_list.vue'], resolve)
const af_customs_declaration = resolve => require(['@/views/af/af_customs_declaration.vue'], resolve)


//CSS
const css_report_receivable_age = resolve => require(['@/views/css/css_report_receivable_age.vue'], resolve)
const css_report_payable_age = resolve => require(['@/views/css/css_report_payable_age.vue'], resolve)
const css_p_r_eport_settle_af = resolve => require(['@/views/af/css_p_r_eport_settle_af.vue'], resolve)
const css_p_r_eport_sale_settle_af = resolve => require(['@/views/af/css_p_r_eport_sale_settle_af.vue'], resolve)
const css_p_r_eport_airline_settle_af = resolve => require(['@/views/af/css_p_r_eport_airline_settle_af.vue'], resolve)
const css_report_cost_list = resolve => require(['@/views/css/css_report_cost_list.vue'], resolve)
const css_income_nodebitnote_list = resolve => require(['@/views/css/css_income_nodebitnote_list.vue'], resolve)
const css_workload = resolve => require(['@/views/css/css_workload.vue'], resolve)
const css_report_business_analysis = resolve => require(['@/views/af/css_report_business_analysis.vue'], resolve)
const css_p_report_customer_contribution = resolve => require(['@/views/css/css_p_report_customer_contribution.vue'], resolve)
const customer_info = resolve => require(['@/views/css/customerContribution/customer_info.vue'], resolve)
const css_report_no_writeoff = resolve => require(['@/views/css/css_report_no_writeoff.vue'], resolve)
const css_P_report_supplier_procurement = resolve => require(['@/views/css/css_P_report_supplier_procurement.vue'], resolve)
const customer_info_menu = resolve => require(['@/views/css/customerContribution/customer_info.vue'], resolve)
const css_voucher_export = resolve => require(['@/views/css/css_voucher_export.vue'], resolve)
const css_financial_expense_report = resolve => require(['@/views/css/css_financial_expense_report.vue'], resolve)
const css_report_income_statement = resolve => require(['@/views/css/css_report_income_statement'], resolve)

//SC
const sc_si_order = resolve => require(['@/views/sc/si/order.vue'], resolve)
const sc_se_order = resolve => require(['@/views/sc/se/order.vue'], resolve)
const sc_order_ship_info = resolve => require(['@/views/sc/base/sc_order_ship_info'], resolve)
const sc_ship_company = resolve => require(['@/views/sc/base/sc_ship_company'], resolve)
const sc_port_maintenance = resolve => require(['@/views/sc/base/sc_port_maintenance'], resolve)
const sc_warehouse = resolve => require(['@/views/sc/base/sc_warehouse'], resolve)
const se_order_delivery_notice = resolve => require(['@/views/sc/se/order/deliveryNotice/se_order_delivery_notice_external.vue'], resolve)
const se_order_waybillMake = resolve => require(['@/views/sc/se/order/other/order_waybillMake.vue'], resolve)

// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/views/login'], resolve)
// const Efyyy = resolve => require(['@/views/loginEf'], resolve)
const ResetPassword = resolve => require(['@/views/resetPassword'], resolve)
const Tutorial = resolve => require(['@/views/workbench/tutorial'], resolve)
const ContactUs = resolve => require(['@/components/contactUs.vue'], resolve)
const Investigate = resolve => require(['@/components/investigate.vue'], resolve)
const CargoTracking = resolve => require(['@/views/workbench/panel/cargoTracking.vue'], resolve)

//TC
const tc_product = resolve => require(['@/views/tc/base/tc_product'], resolve)
const tc_te_order = resolve => require(['@/views/tc/te/order.vue'], resolve)
const tc_warehouse = resolve => require(['@/views/tc/base/tc_warehouse'], resolve)
const te_order_delivery_notice_external = resolve => require(['@/views/tc/te/order/other/te_order_delivery_notice_external.vue'], resolve)

const tc_ti_order = resolve => require(['@/views/tc/ti/order.vue'], resolve)

//LC
const lc_order = resolve => require(['@/views/lc/order.vue'], resolve)
const lc_base_truck = resolve => require(['@/views/lc/truck/base/lc_base_truck.vue'], resolve)

//VL
const vl_order = resolve => require(['@/views/vl/order.vue'], resolve)

//IO
const io_order = resolve => require(['@/views/io/order.vue'], resolve)

//report
const jt_css_p_r_eport_settle_af = resolve => require(['@/views/report/jt_css_p_r_eport_settle_af.vue'], resolve)
const jt_css_report_receivable_age = resolve => require(['@/views/report/jt_css_report_receivable_age.vue'], resolve)
const jt_css_report_payable_age = resolve => require(['@/views/report/jt_css_report_payable_age.vue'], resolve)
const jt_css_report_no_writeoff = resolve => require(['@/views/report/jt_css_report_no_writeoff.vue'], resolve)
const jt_css_report_business_analysis = resolve => require(['@/views/report/jt_css_report_business_analysis.vue'], resolve)
const jt_css_report_income_statement = resolve => require(['@/views/report/jt_css_report_income_statement'], resolve)
const jt_css_p_report_customer_contribution = resolve => require(['@/views/report/jt_css_p_report_customer_contribution.vue'], resolve)
const jt_css_report_supplier_procurement = resolve => require(['@/views/report/jt_css_report_supplier_procurement.vue'], resolve)
const jt_customer_info_menu = resolve => require(['@/views/report/jt_customer_info.vue'], resolve)

Vue.use(Router);

let filterUri = {
	"/dashboard": true, //首页
	"/tutorial": true, //视频教程
	"/noPermission": true, //没有权限
	"/unPermission": true, //没有权限
	"/resetPassword": true, //密码重置
	"/contactUs": true, //联系我们
	"/investigate": true, // 问卷调查
	"/panelSearch": true, //第三方首页搜索页面
	"/seOrderWaybillMake": true, //se运单制作是按钮级权限，所以页面跳转当成无权限访问，用按钮控制
	"/cargoTracking": true, //货物追踪
	"/externalCoopShare": true, //协作绑定
	"/orderShareQrcodeTrack": true //协作订单
};
let router = new Router({
	routes: [{
			path: '/login',
			type: 'login',
			component: Login
		},
		{
			path: '/efForLogin',
			type: 'efForLogin',
			component: EfForLogin
		},
		{
			path: '/resetPassword',
			type: 'resetPassword',
			name: 'resetPassword',
			component: ResetPassword
		},
		{
			path: '*',
			component: NotFound
		},
		{
			path: '/noPermission',
			component: NotPermission
		},
		{
			path: '/af_order_inquiry_quotation',
			component: af_order_inquiry_quotation
		},
		{
			path: '/cargoTracking',
			component: CargoTracking
		},
		{
			path: '/',
			type: 'home',
			name: 'home',
			redirect: '/dashboard',
			component: Home,
			children: [{
					path: '/dashboard',
					name: '首页',
					components: {
						default: Dashboard,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'iconfont icon-home', // 图标样式class
					menuShow: true
				},
				{
					path: '/panelSearch',
					name: '首页',
					components: {
						default: PanelSearch,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'iconfont icon-home', // 图标样式class
					menuShow: true
				},
				{
					path: '/tutorial',
					name: '视频教程',
					components: {
						default: Tutorial,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'iconfont icon-home', // 图标样式class
					menuShow: true
				},
				{
					path: '/contactUs',
					name: '联系我们',
					components: {
						default: ContactUs,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'iconfont icon-home', // 图标样式class
					menuShow: true
				},
				{
					path: '/investigate',
					name: '问卷调查',
					components: {
						default: Investigate,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'iconfont icon-home', // 图标样式class
					menuShow: true
				}
			]
		},
		{
			path: '/externalOrderTrack',
			name: '订单轨迹分享页',
			components: {
				default: commonOrderTrackExternal,
			},
		},
		{
			path: '/externalOrderDeliveryNotice',
			name: '订单送货通知分享页',
			component: af_order_delivery_notice
		},
		{
			path: '/seExternalOrderDeliveryNotice',
			name: 'SE送货通知分享页',
			component: se_order_delivery_notice

		},
		{
			path: '/seOrderWaybillMake',
			name: 'SE运单制作',
			component: se_order_waybillMake
		},
		{
			path: '/teExternalOrderDeliveryNotice',
			name: 'TE送货通知分享页',
			component: te_order_delivery_notice_external

		},
		{
			path: '/externalCoopShare',
			name: '协作公司-绑定设置地址',
			component: externalCoopShare
		},
		{
			path: '/orderShareQrcodeTrack',
			name: '协作订单Track地址',
			component: orderShareQrcodeTrack
		},
		{
			path: '/prmManager',
			type: 'prm',
			name: 'prm',
			redirect: '/prm',
			component: Home,
			menuShow: true,
			children: [{
					path: '/prm',
					name: 'PRM 管理系统',
					components: {
						default: prmindex,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'el-icon-s-home', // 图标样式class
					menuShow: true
				},
				{
					path: '/prm_coop',
					components: {
						default: prm_coop,
						top: TopNav,
						aside: LeftNav
					},
					name: '合作伙伴管理',
					menuShow: true
				},
				{
					path: '/prm_coop_agreement',
					components: {
						default: prm_coop_agreement,
						top: TopNav,
						aside: LeftNav
					},
					name: '合作伙伴协议',
					menuShow: true
				},
				{
					path: '/prm_inquiry_agent',
					components: {
						default: prm_inquiry_agent,
						top: TopNav,
						aside: LeftNav
					},
					name: '询盘代理',
					menuShow: true
				},
				{
					path: '/prm_coop_agreement_settlement',
					components: {
						default: prm_coop_agreement_settlement,
						top: TopNav,
						aside: LeftNav
					},
					name: '合作伙伴结算协议',
					menuShow: true
				},
				{
					path: '/prm_coop_bill',
					components: {
						default: prm_coop_bill,
						top: TopNav,
						aside: LeftNav
					},
					name: '翌飞账单明细',
					menuShow: true
				},
				{
					path: '/prm_coop_check',
					components: {
						default: prm_coop_check,
						top: TopNav,
						aside: LeftNav
					},
					name: '翌飞账单',
					menuShow: false
				},
				{
					path: '/prm_coop_settle',
					components: {
						default: prm_coop_settle,
						top: TopNav,
						aside: LeftNav
					},
					name: '结算报表',
					menuShow: false
				},
				{
					path: '/prm_cloud_user',
					components: {
						default: prm_cloud_user,
						top: TopNav,
						aside: LeftNav
					},
					name: '云用户统计',
					menuShow: false
				},
				{
					path: '/prm_coop_share',
					components: {
						default: prm_coop_share,
						top: TopNav,
						aside: LeftNav
					},
					name: '协作公司',
					menuShow: false
				},
				{
					path: '/prm_category',
					components: {
						default: prm_category,
						top: TopNav,
						aside: LeftNav
					},
					name: '参数管理',
					menuShow: true
				},
				{
					path: '/prm_log',
					components: {
						default: prm_log,
						top: TopNav,
						aside: LeftNav
					},
					name: '合作伙伴日志',
					menuShow: true
				},
				{
					path: '/prm_shipperConsignee',
					components: {
						default: prm_shipperConsignee,
						top: TopNav,
						aside: LeftNav
					},
					name: '收发货人',
					menuShow: true
        },
        {
          path: '/prm_service',
          components: {
            default: prm_service,
            top: TopNav,
            aside: LeftNav
          },
          name: '账单收费项目',
          menuShow: true
        },
        {
          path: '/prm_report_receivable_age',
          components: {
            default: prm_report_receivable_age,
            top: TopNav,
            aside: LeftNav
          },
          name: '应收账龄',
          menuShow: true
        },
        {
          path: '/prm_budget',
          components: {
            default: prm_budget,
            top: TopNav,
            aside: LeftNav
          },
          name: '预算分析',
          menuShow: true
        }


      ]
		},
		{
			path: '/hrsManager',
			type: 'hrs',
			name: 'hrs',
			redirect: '/hrs',
			component: Home,
			menuShow: true,
			children: [{
					path: '/hrs',
					name: 'HRS 管理系统',
					components: {
						default: hrsindex,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'el-icon-s-home', // 图标样式class
					menuShow: true
				},
				{
					path: '/hrs_org',
					name: '签约客户管理',
					components: {
						default: hrs_org,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'el-icon-s-custom', // 图标样式class
					menuShow: true
				},
				{
					path: '/hrs_orgUser',
					name: '签约用户',
					components: {
						default: hrs_orgUser,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'el-icon-s-custom', // 图标样式class
					menuShow: true
				},
				{
					path: '/hrs_org_configure',
					name: '公司配置',
					components: {
						default: hrs_org_configure,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'el-icon-s-custom', // 图标样式class
					menuShow: true
				},
				{
					path: '/hrs_permission',
					name: '系统权限管理',
					components: {
						default: hrs_permission,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'el-icon-s-tools', // 图标样式class
					menuShow: true
				},
				{
					path: '/hrs_role',
					name: '角色管理',
					components: {
						default: hrs_role,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'el-icon-coordinate', // 图标样式class
					menuShow: true
				},
				{
					path: '/hrs_dept',
					name: '部门管理',
					components: {
						default: hrs_dept,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'el-icon-place', // 图标样式class
					menuShow: true
				},
				{
					path: '/hrs_user',
					name: '用户管理',
					components: {
						default: hrs_user,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'el-icon-user-solid', // 图标样式class
					menuShow: true
				},
        {
          path: '/hrs_user_workgroup',
          name: '工作组管理',
          components: {
            default: hrs_user_workgroup,
            top: TopNav,
            aside: LeftNav
          },
          leaf: true, // 只有一个节点
          iconCls: 'el-icon-user-solid', // 图标样式class
          menuShow: true
        },
				{
					path: '/hrs_log',
					name: '日志查询',
					components: {
						default: hrs_log,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'el-icon-tickets', // 图标样式class
					menuShow: true
				},
				{
					path: '/hrs_notice',
					name: '系统公告',
					components: {
						default: hrs_notice,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'el-icon-tickets', // 图标样式class
					menuShow: true
				},
				{
					path: '/hrs_version',
          name: '版本管理',
          components: {
            default: hrs_version,
            top: TopNav,
            aside: LeftNav
          },
          leaf: true, // 只有一个节点
          iconCls: 'el-icon-notebook-2', // 图标样式class
          menuShow: true
        },
        {
          path: '/hrs_doc',
          name: '单证管理',
          components: {
            default: hrs_doc,
            top: TopNav,
            aside: LeftNav
          },
          leaf: true, // 只有一个节点
          iconCls: 'el-icon-notebook-2', // 图标样式class
          menuShow: true
        },
        {
          path: '/hrs_signtemplate',
          name: '签约模板',
          components: {
            default: hrs_signtemplate,
            top: TopNav,
            aside: LeftNav
          },
          leaf: true, // 只有一个节点
          iconCls: 'el-icon-notebook-2', // 图标样式class
					menuShow: true
				},
				{
					path: '/unPermission',
					name: '无权限页面',
					components: {
						default: unPermission,
						top: TopNav,
						aside: LeftNav
					}
				},
				{
					path: '/unDevelop',
					name: '未开发页面',
					components: {
						default: unDevelop,
						top: TopNav,
						aside: LeftNav
					}
				},
			]
		},
		{
			path: '/afManager',
			type: 'af',
			name: 'af',
			redirect: '/af',
			component: Home,
			menuShow: true,
			children: [{
					path: '/af',
					name: 'AF 管理系统',
					components: {
						default: afindex,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'el-icon-s-home', // 图标样式class
					menuShow: true
				},
				{
					path: '/af_base',
					name: '基础信息',
					components: {
						default: af_base,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'el-icon-tickets', // 图标样式class
					menuShow: true
				},
				{
					path: '/af_orderair',
					name: '出口订舱',
					components: {
						default: af_orderair,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'el-icon-tickets', // 图标样式class
					menuShow: true
				},
				{
					path: '/af_order',
					name: '出口订单',
					components: {
						default: af_order,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'el-icon-tickets', // 图标样式class
					menuShow: true
				},
				{
            path: '/af_oporder',
            name: '操作订单',
            components: {
                default: af_oporder,
                top: TopNav,
                aside: LeftNav
            },
            leaf: true, // 只有一个节点
            iconCls: 'el-icon-tickets', // 图标样式class
            menuShow: true
        },
        {
            path: '/fhl_operation',
            name: '分单操作',
            components: {
                default: fhl_operation,
                top: TopNav,
                aside: LeftNav
            },
            leaf: true, // 只有一个节点
            iconCls: 'el-icon-tickets', // 图标样式class
            menuShow: true
        },
        {
            path: '/ai_operationLook',
            name: '操作看板',
            components: {
                default: ai_operationLook,
                top: TopNav,
                aside: LeftNav
            },
            leaf: true, // 只有一个节点
            iconCls: 'el-icon-tickets', // 图标样式class
            menuShow: true
        },
        {
            path: '/branch_line',
            name: '支线管理',
            components: {
                default: branch_line,
                top: TopNav,
                aside: LeftNav
            },
            leaf: true, // 只有一个节点
            iconCls: 'el-icon-tickets', // 图标样式class
            menuShow: true
        },{
            path: '/af_customs_declaration',
            name: '出口报关单',
            components: {
                default: af_customs_declaration,
                top: TopNav,
                aside: LeftNav
            },
            leaf: true, // 只有一个节点
            iconCls: 'el-icon-tickets', // 图标样式class
            menuShow: true
        },
				{
					path: '/ai_order',
					name: '进口订单',
					components: {
						default: ai_order,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'el-icon-tickets', // 图标样式class
					menuShow: true
        },{
          path: '/ai_customs_declaration',
          name: '进口报关单',
          components: {
            default: ai_customs_declaration,
            top: TopNav,
            aside: LeftNav
          },
          leaf: true, // 只有一个节点
          iconCls: 'el-icon-tickets', // 图标样式class
          menuShow: true
				},
				{
					path: '/af_tariff_details',
					name: '税则查询',
					components: {
						default: af_tariff_details,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'el-icon-tickets', // 图标样式class
					menuShow: true
				},
				{
					path: '/af_service_template',
					name: '服务模板',
					components: {
						default: af_service_template,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'el-icon-tickets', // 图标样式class
					menuShow: true
				},
				{
					path: '/af_operationPlan',
					name: '操作计划',
					components: {
						default: af_operationPlan,
						top: TopNav,
						aside: LeftNav
					}
				},
				{
					path: '/af_operationLook',
					name: '操作看板',
					components: {
						default: af_operationLook,
						top: TopNav,
						aside: LeftNav
					}
				},
				{
					path: '/af_awbPrint',
					name: '单证制作',
					components: {
						default: af_awbPrint,
						top: TopNav,
						aside: LeftNav
					}
				},
				{
					path: '/af_inbound',
					name: '操作出重',
					components: {
						default: af_inbound,
						top: TopNav,
						aside: LeftNav
					}
				},
				{
					path: '/af_css_debit_note',
					name: '应收账单',
					components: {
						default: af_css_debit_note,
						top: TopNav,
						aside: LeftNav
					}
				},
				{
					path: '/af_css_payment',
					name: '成本对账',
					components: {
						default: af_css_payment,
						top: TopNav,
						aside: LeftNav
					}
				},
				{
					path: '/css_p_r_eport_settle_af',
					name: '结算报表',
					components: {
						default: css_p_r_eport_settle_af,
						top: TopNav,
						aside: LeftNav
					}
				},{
					path: '/jt_css_p_r_eport_settle_af',
					name: '集团分析报表-结算报表',
          props:true,
					components: {
						default: jt_css_p_r_eport_settle_af,
						top: TopNav,
						aside: LeftNav
					}
				},
        {
          path: '/css_p_r_eport_airline_settle_af',
          name: '结算报表',
          components: {
            default: css_p_r_eport_airline_settle_af,
            top: TopNav,
            aside: LeftNav
          }
        },
        {
          path: '/css_p_r_eport_sale_settle_af',
          name: '销售结算报表',
          components: {
            default: css_p_r_eport_sale_settle_af,
            top: TopNav,
            aside: LeftNav
          }
        },
				{
					path: '/af_enquiry_manage',
					name: '询价管理',
					components: {
						default: af_enquiry_manage,
						top: TopNav,
						aside: LeftNav
					}
				},
				{
					path: '/af_price_search',
					name: '价格查询',
					components: {
						default: af_price_search,
						top: TopNav,
						aside: LeftNav
					}
				},
				{
					path: '/send_product',
					name: '产品发布',
					components: {
						default: send_product,
						top: TopNav,
						aside: LeftNav
					}
				},
				{
					path: '/af_currencyrate',
					name: '',
					components: {
						default: af_currencyrate,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'el-icon-myzhanglingfenxi iconfont', // 图标样式class
					menuShow: true
				},
				{
					path: '/af_service',
					name: '',
					components: {
						default: af_service,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'el-icon-myshanghujiesuanbaobiao iconfont', // 图标样式class
					menuShow: true
				},
				{
					path: '/af_financial_account',
					name: '科目代码',
					components: {
						default: af_financial_account,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'el-icon-myshanghujiesuanbaobiao iconfont', // 图标样式class
					menuShow: true
				},
        {
          path: '/af_city',
          name: '城市信息',
          components: {
            default: af_city,
            top: TopNav,
            aside: LeftNav
          },
          leaf: true, // 只有一个节点
          iconCls: 'el-icon-myshanghujiesuanbaobiao iconfont', // 图标样式class
          menuShow: true
        },
				{
					path: '/af_awb',
					name: '',
					components: {
						default: af_awb,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: '', // 图标样式class
					menuShow: true
				},
				{
					path: '/af_airport',
					name: '机场信息',
					components: {
						default: af_airport,
						top: TopNav,
						aside: LeftNav
					}
				},
				{
					path: '/af_warehouse',
					name: '',
					components: {
						default: af_warehouse,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: '', // 图标样式class
					menuShow: true
				},
				{
					path: '/af_warehouse_letter',
					name: '',
					components: {
						default: af_warehouse_letter,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: '', // 图标样式class
					menuShow: true
				},
				{
					path: '/af_carrier',
					name: '',
					components: {
						default: af_carrier,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: '', // 图标样式class
					menuShow: true
				},
				{
					path: '/af_flight',
					name: '',
					components: {
						default: af_flight,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: '', // 图标样式class
					menuShow: true
				},
				{
					path: '/af_tact',
					name: '',
					components: {
						default: af_tact,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: '', // 图标样式class
					menuShow: true
				},
				{
					path: '/af_tact_public',
					name: 'TACT公布价',
					components: {
						default: af_tact_public,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: '', // 图标样式class
					menuShow: true
				},
				{
					path: '/af_aircraft',
					name: '',
					components: {
						default: af_aircraft,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: '', // 图标样式class
					menuShow: true
				},
				{
					path: '/af_order_inquiry',
					name: '询价单',
					components: {
						default: af_order_inquiry,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: '', // 图标样式class
					menuShow: true
				},
				{
					path: '/af_order_lock_unlock_list',
					name: '财务锁账',
					components: {
						default: af_order_lock_unlock_list,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: '', // 图标样式class
					menuShow: true
				},
				{
					path: '/af_surcharge',
					name: '',
					components: {
						default: af_surcharge,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: '', // 图标样式class
					menuShow: true
				}
			]
		},
		{
			path: '/cssManager',
			type: 'css',
			name: 'css',
			redirect: '/css',
			component: Home,
			menuShow: true,
			children: [{
					path: '/css',
					name: 'CSS 管理系统',
					components: {
						default: cssindex,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'el-icon-s-home', // 图标样式class
					menuShow: true
				},
				{
					path: '/css_report_receivable_age',
					name: '应收账龄',
					components: {
						default: css_report_receivable_age,
						top: TopNav,
						aside: LeftNav
					}
				},
        {
        	path: '/jt_css_report_receivable_age',
        	name: '集团分析报表-应收账龄',
        	components: {
        		default: jt_css_report_receivable_age,
        		top: TopNav,
        		aside: LeftNav
        	}
        },
				{
					path: '/css_report_payable_age',
					name: '应付账龄',
					components: {
						default: css_report_payable_age,
						top: TopNav,
						aside: LeftNav
					}
				},
        {
        	path: '/jt_css_report_payable_age',
        	name: '集团分析报表-应付账龄',
        	components: {
        		default: jt_css_report_payable_age,
        		top: TopNav,
        		aside: LeftNav
        	}
        },
				{
					path: '/css_report_business_analysis',
					name: '经营分析表',
					components: {
						default: css_report_business_analysis,
						top: TopNav,
						aside: LeftNav
					}
				},{
					path: '/jt_css_report_business_analysis',
					name: '集团分析报表-经营分析表',
					components: {
						default: jt_css_report_business_analysis,
						top: TopNav,
						aside: LeftNav
					}
				}, {
					path: '/css_p_report_customer_contribution',
					name: '客户贡献度分析',
					components: {
						default: css_p_report_customer_contribution,
						top: TopNav,
						aside: LeftNav
					}
				},{
					path: '/jt_css_p_report_customer_contribution',
					name: '集团分析报表-客户贡献度分析',
					components: {
						default: jt_css_p_report_customer_contribution,
						top: TopNav,
						aside: LeftNav
					}
				}, {
					path: '/customer_info',
					name: '客户贡献度分析客户明细',
					components: {
						default: customer_info,
						top: TopNav,
						aside: LeftNav
					},
					leaf: true, // 只有一个节点
					iconCls: 'el-icon-s-home', // 图标样式class
					menuShow: true
				},
				{
					path: '/css_report_cost_list',
					name: '成本查询',
					components: {
						default: css_report_cost_list,
						top: TopNav,
						aside: LeftNav
					}
				}, {
					path: '/css_income_nodebitnote_list',
					name: '成本查询',
					components: {
						default: css_income_nodebitnote_list,
						top: TopNav,
						aside: LeftNav
					}
				},
				{
					path: '/css_workload',
					name: '工作量统计',
					components: {
						default: css_workload,
						top: TopNav,
						aside: LeftNav
					}
				}, {
					path: '/css_report_no_writeoff',
					name: '往来情况查询',
					components: {
						default: css_report_no_writeoff,
						top: TopNav,
						aside: LeftNav
					}
				}, {
					path: '/jt_css_report_no_writeoff',
					name: '集团分析报表-往来情况查询',
					components: {
						default: jt_css_report_no_writeoff,
						top: TopNav,
						aside: LeftNav
					}
				}, {
					path: '/css_report_supplier_procurement',
					name: '供应商采购分析',
					components: {
						default: css_P_report_supplier_procurement,
						top: TopNav,
						aside: LeftNav
					}
				},{
					path: '/jt_css_report_supplier_procurement',
					name: '集团分析报表-供应商采购分析',
					components: {
						default: jt_css_report_supplier_procurement,
						top: TopNav,
						aside: LeftNav
					}
				},
				{
					path: '/customer_info_menu',
					name: '航线分析',
					components: {
						default: customer_info_menu,
						top: TopNav,
						aside: LeftNav
					}
				},{
					path: '/jt_customer_info_menu',
					name: '集团分析报表-航线分析',
					components: {
						default: jt_customer_info_menu,
						top: TopNav,
						aside: LeftNav
					}
				},
				{
					path: '/css_voucher_export',
					name: '凭证导出',
					components: {
						default: css_voucher_export,
						top: TopNav,
						aside: LeftNav
					}
				}, {
					path: '/css_financial_expense_report',
					name: '费用报销',
					components: {
						default: css_financial_expense_report,
						top: TopNav,
						aside: LeftNav
					}
				}, {
					path: '/css_report_income_statement',
					name: '损益表',
					components: {
						default: css_report_income_statement,
						top: TopNav,
						aside: LeftNav
					}
				},{
					path: '/jt_css_report_income_statement',
					name: '集团分析报表-损益表',
					components: {
						default: jt_css_report_income_statement,
						top: TopNav,
						aside: LeftNav
					}
				}
			]
		},
		{
			path: '/scManager',
			name: 'sc海运进口',
			component: Home,
			children: [{
					path: '/si_order',
					name: '进口订单',
					components: {
						default: sc_si_order,
						top: TopNav,
						aside: LeftNav
					}
				},
				{
					path: '/se_order',
					name: '出口订单',
					components: {
						default: sc_se_order,
						top: TopNav,
						aside: LeftNav
					}
				},
				{
					path: '/sc_order_ship_info',
					name: '海运基础信息船名信息',
					components: {
						default: sc_order_ship_info,
						top: TopNav,
						aside: LeftNav
					}
				},
				{
					path: '/sc_ship_company',
					name: '海运基础信息船司信息',
					components: {
						default: sc_ship_company,
						top: TopNav,
						aside: LeftNav
					}
				},
				{
					path: '/sc_port_maintenance',
					name: '海运基础信息海港信息',
					components: {
						default: sc_port_maintenance,
						top: TopNav,
						aside: LeftNav
					}
				}, {
					path: '/sc_warehouse',
					name: '海运基础信息堆场仓库',
					components: {
						default: sc_warehouse,
						top: TopNav,
						aside: LeftNav
					}
				}, {
					path: '/tc_product',
					name: '铁路产品',
					components: {
						default: tc_product,
						top: TopNav,
						aside: LeftNav
					}
				}, {
					path: '/te_order',
					name: '铁路订单TE',
					components: {
						default: tc_te_order,
						top: TopNav,
						aside: LeftNav
					}
				}, {
					path: '/ti_order',
					name: '铁路订单TI',
					components: {
						default: tc_ti_order,
						top: TopNav,
						aside: LeftNav
					}
				}, {
					path: '/tc_warehouse',
					name: '铁路基础信息堆场仓库',
					components: {
						default: tc_warehouse,
						top: TopNav,
						aside: LeftNav
					}
				}
			]
		},
		{
			path: '/lcManager',
			name: 'lc国内运输',
			component: Home,
			children: [{
					path: '/lc_order',
					name: '运输订单',
					components: {
						default: lc_order,
						top: TopNav,
						aside: LeftNav
					}
				},
				{
					path: '/vl_order',
					name: '车辆配载',
					components: {
						default: vl_order,
						top: TopNav,
						aside: LeftNav
					}
				},
				{
					path: '/lc_base_truck',
					name: '基础信息维护-陆运信息-车辆信息',
					components: {
						default: lc_base_truck,
						top: TopNav,
						aside: LeftNav
					}
				}
			]
		},
		{
			path: '/ioManager',
			name: 'io其他业务',
			component: Home,
			children: [{
				path: '/io_order',
				name: '其他订单',
				components: {
					default: io_order,
					top: TopNav,
					aside: LeftNav
				}
			}]
		}
	]
});

router.beforeEach((to, from, next) => {
	if (to.path.startsWith('/login')  || to.path == "/customer_info" || to.path == "/externalOrderTrack" || to.path == "/efForLogin" || to.path == "/teExternalOrderDeliveryNotice" || to.path == "/seExternalOrderDeliveryNotice" || to.path == "/externalOrderDeliveryNotice" || to.path == "/af_order_inquiry_quotation") {
		next()
	}else {
		let user = window.localStorage.getItem('access_token')
		if (!user) {
			next({
				path: '/login'
			})
		} else {
			//权限控制
			//首页不拦截,异常页不拦截,修改密码页面不拦截,订单轨迹不拦截
			if (filterUri[to.path]) {
				next()
			} else {
				let menuinfo = window.localStorage.getItem('menuinfo');
				if (menuinfo == null) {
					next({
						path: '/unPermission'
					})
				} else {
					menuinfo = JSON.parse(menuinfo);
					let BreakException = {}
					let flag = false
					try {
						menuinfo.forEach((menu) => {
							if (menu.path == to.path) {
								throw BreakException
							} else {
								menu.children.forEach((child) => {
									if (child.path == to.path) {
										throw BreakException
									} else {
										child.children.forEach((supChild) => {
											if (supChild.path == to.path) {
												throw BreakException
											}
										})
									}
								})
							}
						})

					} catch (e) {
						if (e === BreakException) {
							flag = true
						} else {
							throw e
						}
					}
					if (flag) {
						next()
					} else {
						next({
							path: '/unPermission'
						})
					}
				}
			}
		}
	}

});

export default router
