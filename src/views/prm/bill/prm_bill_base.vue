<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <!--<el-tab-pane label="参数表" name="first">
      <component :is="first" keep-alive></component>
    </el-tab-pane>-->
    <el-tab-pane label="未确认账单" name="unmake">
      <component :is="unmake" keep-alive></component>
    </el-tab-pane>
    <el-tab-pane label="已确认账单" name="made">
      <component :is="made" keep-alive></component>
    </el-tab-pane>
  <!--  <el-tab-pane label="机场" name="third">
      <component :is="third" keep-alive></component>
    </el-tab-pane>
    <el-tab-pane label="货站/仓库" name="nineth">
      <component :is="nineth" keep-alive></component>
    </el-tab-pane>
    <el-tab-pane label="航司" name="sixth">
      <component :is="sixth" keep-alive></component>
    </el-tab-pane>
    <el-tab-pane label="TACT" name="seventh">
      <component :is="seventh" keep-alive></component>
    </el-tab-pane>
    <el-tab-pane label="航班" name="eighth">
      <component :is="eighth" keep-alive></component>
    </el-tab-pane>
    <el-tab-pane label="客户项目" name="coopProject">
      <component :is="coopProject" keep-alive></component>
    </el-tab-pane>
    <el-tab-pane label="服务类别" name="tenth">
      <component :is="tenth" keep-alive></component>
    </el-tab-pane>
    <el-tab-pane label="操作日志" name="eleventh">
      <component :is="eleventh" keep-alive></component>
    </el-tab-pane>-->
  </el-tabs>

</template>
<script>
   // const af_category = resolve => require(['@/views/af/base/af_category.vue'], resolve)
    const prm_unmake = resolve => require(['@/views/prm/prm_unmake_bill.vue'], resolve)
    const madebill = resolve => require(['@/views/prm/prm_made_bill.vue'], resolve)
    /* const af_airport = resolve => require(['@/views/af/base/af_airport.vue'], resolve)
     const af_city = resolve => require(['@/views/af/base/af_city.vue'], resolve)
     const af_nation = resolve => require(['@/views/af/base/nation/af_nation.vue'], resolve)
     const af_carrier = resolve => require(['@/views/af/base/carrier/af_carrier.vue'], resolve)
     const af_tact = resolve => require(['@/views/af/base/af_tact.vue'], resolve)
     const af_flight = resolve => require(['@/views/af/base/af_flight.vue'], resolve)
     const af_warehouse = resolve => require(['@/views/af/base/af_warehouse.vue'], resolve)
     const af_operation = resolve => require(['@/views/af/base/af_operation.vue'], resolve)
     const af_coopProject = resolve => require(['@/views/af/base/af_coopProject.vue'], resolve)
     const af_service = resolve => require(['@/views/af/base/service/af_service.vue'], resolve)
     const af_log = resolve => require(['@/views/af/base/log/af_log.vue'], resolve)*/
    export default {
        data() {
            return {
                activeName: 'unmake',
                unmake: '',
                made: '',
                /*first: '',
                second: '',
                third: '',
                fourth: '',
                fifth: '',
                sixth: '',
                seventh: '',
                eighth: '',
                nineth: '',
                coopProject: '',
                tenth: '',
                eleventh: ''*/
            };
        },
        created() {
            this.checkVue('unmake');
        },
        methods: {
            handleClick(tab, event) {
//	         console.log(tab, event);
                this.checkVue(tab.name)
            },
            checkVue (name) {
                switch (name) {
                    /*case 'first' :
                        this.first = af_category
                        break*/
                    case 'unmake' :
                        this.unmake = prm_unmake
                        break
                    case 'made' :
                        this.made = madebill
                        break
            /*        case 'third' :
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
                    case 'coopProject' :
                        this.coopProject = af_coopProject
                        break
                    case 'tenth' :
                        this.tenth = af_service
                        break
                    case 'eleventh' :
                        this.eleventh = af_log
                        break*/
                }
            }
        }
    };
</script>
