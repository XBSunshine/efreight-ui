<template>
  <el-dialog title="应收账龄 - 明细" width="1300px" :visible.sync="visible" :close-on-press-escape="false"
             :close-on-click-modal="false" :before-close="handleClose">

    <div ref="receivable_age_detail">
      <el-button style="float: right;margin-right: 5px;margin-bottom: 5px;" type="primary" size="small"
                 v-on:click="exportExcel">导出
      </el-button>

      <el-table border v-loading="loading" :data="data" :max-height="tableHeight" stripe>
        <template v-for="(item,index) in tableColumns">

          <el-table-column v-if="item.prop == 'no'" :key="index" :prop="item.prop" :label="item.label"
                           header-align="center" :width="item.width" :align="item.align" :sortable="item.sortable">
            <template slot-scope="scope"><span>{{ scope.$index + 1 }}</span></template>
          </el-table-column>

          <el-table-column v-else-if="item.prop == 'unverifiedAmount'" :key="index" :prop="item.prop"
                           :label="item.label"
                           header-align="center" :width="item.width" :align="item.align" :sortable="item.sortable">
            <template slot-scope="scope">
              <span v-if="scope.row.unverifiedAmount != '0.00'" style="color:red">{{
                  scope.row.unverifiedAmount
                }}</span>
              <span v-else>{{ scope.row.unverifiedAmount }}</span>
            </template>
          </el-table-column>

          <el-table-column v-else-if="item.prop=='sendBill'" :key="index" :prop="item.prop" align="center"
                           :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
            <template slot-scope="scope">
              <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.sendBill"></i>
            </template>
          </el-table-column>

          <el-table-column v-else :key="index" :prop="item.prop" :label="item.label"
                           header-align="center"
                           :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
        </template>
      </el-table>
    </div>
  </el-dialog>

</template>
<script>

import columns from './report_receivable_age_detail.json'

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
      tableHeight: '530px',
      data: [],
      tableColumns: [],
      loading: false,
    }
  },
  created() {
    this.tableColumns = columns.info;
    this.findByPage()
  },
  methods: {
    setHeight() {
      this.$nextTick(() => {
        let receivable_age_detail = this.$refs.receivable_age_detail.offsetHeight;
        let heightS = window.innerHeight - 92 - receivable_age_detail;
        this.tableH = heightS + "px";
      });
    },
    findByPage() {
      this.setHeight();
      let coopId = this.frow.coopId;
      this.$axios.get("/prm/coopStatement/detail/" + coopId)
        .then(function (response) {
          if (response.data.code == 0) {
            this.data = response.data.data;
          } else {
            this.openError(response.data.messageInfo || '查询失败');
          }
        }.bind(this))
        .catch(function (error) {
          this.openError(error);
        }.bind(this));
    },
    openSuccess() {
      this.$notify({
        title: '',
        message: '操作成功',
        type: 'success',
        position: 'bottom-right'
      });
    },
    openError(info) {
      this.$notify({
        title: '',
        message: info,
        type: 'error',
        position: 'bottom-right'
      });
    },
    exportExcel() {
      let coopId = this.frow.coopId;
      let params = {};
      params['columnStr'] = JSON.stringify(columns.info);
      this.$axios.post3('/prm/coopStatement/exportDetail/' + coopId, params).then((response) => {
        var blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
        });
        var downloadElement = document.createElement('a');
        var href = window.URL.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = '应收账龄明细.xls'; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      }).catch((error) => {
      });
    },
    handleClose() {
      this.$emit('update:visible', false);
    }
  }
}
</script>
<style>

</style>
