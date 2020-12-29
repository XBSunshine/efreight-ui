<template>
	<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="参数表" name="first" v-if="permission.sys_base_category.isShow">
    	<component :is="first" keep-alive></component>
    </el-tab-pane>
    <el-tab-pane label="主单号管理" name="awb" v-if="permission.sys_base_awb.isShow">
    	<component :is="awb" keep-alive></component>
    </el-tab-pane>
    <el-tab-pane label="币种/汇率" name="second" v-if="permission.sys_base_currencyrate.isShow">
    	<component :is="second" keep-alive></component>
    </el-tab-pane>
    <el-tab-pane label="机场" name="third" v-if="permission.sys_base_airport.isShow">
    	<component :is="third" keep-alive></component>
    </el-tab-pane>
    <el-tab-pane label="货站/仓库" name="nineth" v-if="permission.sys_base_warehouse.isShow">
    	<component :is="nineth" keep-alive></component>
	</el-tab-pane>
	<el-tab-pane label="货站托书" name="Wletter" v-if="isWletter==='1'">
    	<component :is="Wletter" keep-alive></component>
	</el-tab-pane>
	<el-tab-pane label="航司" name="sixth" v-if="permission.sys_base_carrier.isShow">
    	<component :is="sixth" keep-alive></component>
	</el-tab-pane>
	<el-tab-pane label="TACT" name="seventh" v-if="permission.sys_base_tact.isShow">
    	<component :is="seventh" keep-alive></component>
	</el-tab-pane>
	<el-tab-pane label="航班" name="eighth" v-if="permission.sys_base_flight.isShow">
    	<component :is="eighth" keep-alive></component>
	</el-tab-pane>
<!--
	<el-tab-pane label="客户项目" name="coopProject">
    	<component :is="coopProject" keep-alive></component>
	</el-tab-pane>
-->
<!--	<el-tab-pane label="收发货人" name="shipperConsignee" >
    	<component :is="shipperConsignee" keep-alive></component>
	</el-tab-pane>-->
	<el-tab-pane label="服务类别" name="tenth" v-if="permission.sys_base_service.isShow">
    	<component :is="tenth" keep-alive></component>
	</el-tab-pane>
	 <el-tab-pane label="操作日志" name="eleventh" v-if="permission.sys_base_log.isShow">
    	<component :is="eleventh" keep-alive></component>
	</el-tab-pane>
  </el-tabs>

</template>
<script>
	const af_category = resolve => require(['@/views/af/base/af_category.vue'], resolve)
	const af_awb = resolve => require(['@/views/af/base/af_awb.vue'], resolve)
	const currencyrate = resolve => require(['@/views/af/base/currencyrate/af_currencyrate.vue'], resolve)
	const af_airport = resolve => require(['@/views/af/base/af_airport.vue'], resolve)
	const af_city = resolve => require(['@/views/af/base/af_city.vue'], resolve)
	const af_nation = resolve => require(['@/views/af/base/nation/af_nation.vue'], resolve)
	const af_carrier = resolve => require(['@/views/af/base/carrier/af_carrier.vue'], resolve)
	const af_tact = resolve => require(['@/views/af/base/af_tact.vue'], resolve)
	const af_flight = resolve => require(['@/views/af/base/af_flight.vue'], resolve)
	const af_warehouse = resolve => require(['@/views/af/base/af_warehouse.vue'], resolve)
	const af_warehouse_letter = resolve => require(['@/views/af/base/af_warehouse_letter.vue'], resolve)
	const af_operation = resolve => require(['@/views/af/base/af_operation.vue'], resolve)
	const af_coopProject = resolve => require(['@/views/af/base/af_coopProject.vue'], resolve)
	const af_service = resolve => require(['@/views/af/base/service/af_service.vue'], resolve)
	const af_log = resolve => require(['@/views/af/base/log/af_log.vue'], resolve)
	const af_shipperConsignee = resolve => require(['@/views/af/base/af_shipperConsignee.vue'], resolve)
	export default {
	    data() {
	      return {
	      	isWletter:'',
	        activeName: '',
	        awb: '',
	        first: '',
	        second: '',
	        third: '',
	        fourth: '',
	        fifth: '',
	        sixth: '',
	        seventh: '',
	        eighth: '',
	        nineth: '',
	        Wletter:'',
	        coopProject: '',
	        shipperConsignee: '',
	        tenth: '',
	        eleventh: '',
          permission: {
              sys_base_category: { isShow: false, name: 'first'},
              sys_base_awb: { isShow: false, name: 'awb'},
              sys_base_currencyrate: { isShow: false, name: 'second'},
              sys_base_airport: { isShow: false, name: 'third'},
              sys_base_warehouse: { isShow: false, name: 'nineth'},
              sys_base_carrier: { isShow: false, name: 'sixth'},
              sys_base_tact: { isShow: false, name: 'seventh'},
              sys_base_flight: { isShow: false, name: 'eighth'},
              sys_base_service: { isShow: false, name: 'tenth'},
              sys_base_log: { isShow: false, name: 'eleventh'},
          }
	      };
	    },
		created() {
        this.loadPermission();
        this.isWletter=window.localStorage.getItem('orgId');
			//this.checkVue('first');
		},
	    methods: {
	      loadPermission(){
	          let privileges = localStorage.getItem("buttonInfo");
            for (let permissionKey in this.permission) {
                if(privileges.indexOf(permissionKey) > -1){
                    this.permission[permissionKey].isShow = true;

                    if(!this.activeName){//只赋值一次
                        this.activeName = this.permission[permissionKey].name;
                        this.checkVue(this.activeName);
                    }
                }
            }
        },
	      handleClick(tab, event) {
//	         console.log(tab, event);
	        this.checkVue(tab.name)
	      },
	      checkVue (name) {
	      	switch (name) {
	      		case 'first' :
			      	this.first = af_category
		         	break
		        case 'awb' :
			      	this.awb = af_awb
		         	break
	      		case 'second' :
			      	this.second = currencyrate
		         	break
		        case 'third' :
			      	this.third = af_airport
		         	break
		        case 'fourth' :
			      	this.fourth = af_city
		         	break
		        case 'fifth' :
			      	this.fifth = af_nation
		         	break
		        case 'sixth' :
			      	this.sixth = af_carrier
		         	break
		        case 'seventh' :
			      	this.seventh = af_tact
		         	break
		        case 'eighth' :
			      	this.eighth = af_flight
		         	break
		        case 'nineth' :
			      	this.nineth = af_warehouse
		         	break
		        case 'Wletter' :
			      	this.Wletter = af_warehouse_letter
		         	break
		        case 'coopProject' :
			      	this.coopProject = af_coopProject
		         	break
		        case 'shipperConsignee' :
			      	this.shipperConsignee = af_shipperConsignee
		         	break
		        case 'tenth' :
			      	this.tenth = af_service
		         	break
		        case 'eleventh' :
			      	this.eleventh = af_log
		         	break
	      	}
	      }
	    }
	};
</script>
