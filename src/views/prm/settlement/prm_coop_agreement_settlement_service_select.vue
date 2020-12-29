<template>
	<el-dialog title="收费项目 - 选择" width="40%" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
      <div>
      <el-table v-loading="loading" :indent="30" row-key="serviceId" default-expand-all :tree-props="{children: 'billServiceDetails'}" stripe :data="data1" style="width: 100%;" border height="520px">
        <el-table-column  align="center" label="操作" width="60px" type="index">
          <template slot-scope="scope">
            <el-button type="text" size="small" v-on:click="doSelect(scope.row)" v-show="scope.row.serviceCode.length === 6">选择</el-button>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="serviceName" label="名称" >
        </el-table-column>
        <el-table-column align="center" prop="serviceCode" label="服务编码" width="80">
        </el-table-column>
      </el-table>
      </div>

	</el-dialog>
</template>
<script>
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			frow: Object
		},
		data() {
			return {
        loading: false,
        data1: [],
        query: {
          businessScope: 'AE'
        }
      }
    },

    created: function(){
      this.queryList();
    },
    inject:['setServiceValue'],
    methods: {
      doSelect(rrow){
        this.setServiceValue(rrow);
        this.handleClose();
      } ,
      queryList(){
          this.data1=[];
          this.$axios.get2('/prm/coopBill/searchBillServiceSelect',).then(function(response) {
              if(response.data.code == '0') {
                  this.data1 = response.data.data;
              } else {
                  this.$notify.error({
                      title: '错误',
                      message: '查询失败'
                  });
              }
          }.bind(this)).catch(function(error) {
              console.log(error)
          });
      },
     openSuccess() {
        this.$notify({
          title: '',
          message: '操作成功',
          type: 'success',
          position: 'bottom-right'
        });
      },
      openError(info, flag) {
        this.$notify({
          title: '',
          message: flag + '失败，' + info,
          type: 'error',
          position: 'bottom-right'
        });
      },

	handleClose() {
		this.$emit('update:visible', false);
	}
    }
  }
</script>
<style type="text/css">

</style>
