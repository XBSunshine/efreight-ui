<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="未确认账单" name="unmake" v-if="uncheckBillButtonFlag">
      <component :is="unmake" keep-alive></component>
    </el-tab-pane>
    <el-tab-pane label="已确认账单" name="made" v-if="checkedBillButtonFlag">
      <component :is="made" keep-alive></component>
    </el-tab-pane>
    <el-tab-pane label="核销单" name="writeOff" v-if="writeOffBillButtonFlag">
      <component :is="writeOff" keep-alive></component>
    </el-tab-pane>
  </el-tabs>

</template>
<script>
const prm_unmake = resolve => require(['@/views/prm/prm_unmake_bill.vue'], resolve)
const madebill = resolve => require(['@/views/prm/prm_made_bill.vue'], resolve)
const write_off = resolve => require(['@/views/prm/writeoff/prm_write_off.vue'], resolve)
export default {
  data() {
    return {
      activeName: '',
      unmake: '',
      made: '',
      writeOff: '',
      uncheckBillButtonFlag: false,
      checkedBillButtonFlag: false,
      writeOffBillButtonFlag: false,
      };
  },
    created() {

        let tab = {
            unmake : false,
            made :false,
            writeOff : false
        }
        let buttonInfo = window.localStorage.getItem('buttonInfo')
        if (buttonInfo.indexOf('prm_coop_unconfirms_bill')>-1) {
            this.uncheckBillButtonFlag=true;
            tab.unmake = true
        }
        if (buttonInfo.indexOf('prm_coop_checked_bill')>-1) {
            this.checkedBillButtonFlag=true;
            tab.made = true
        }
        if (buttonInfo.indexOf('prm_coop_writeoff_bill')>-1) {
            this.writeOffBillButtonFlag=true;
            tab.writeOff = true
        }
        for (let tabKey in tab) {
            if(tab[tabKey]){
                this.checkVue(tabKey);
                break;
            }
        }

    },
    methods: {
        handleClick(tab, event) {
            this.checkVue(tab.name)
        },
        checkVue (name) {
          this.activeName = name
          switch (name) {
            case 'unmake' :
              this.unmake = prm_unmake
              break
            case 'made' :
              this.made = madebill
              break
            case "writeOff":
              this.writeOff = write_off
              break;
            }
        }
    }
    };
</script>
