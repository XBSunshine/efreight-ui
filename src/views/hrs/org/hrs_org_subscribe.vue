<template>
  <el-dialog title="订阅明细" width="1000px" :visible.sync="visible" :close-on-press-escape="false"
             :close-on-click-modal="false" :before-close="handleClose">
    <el-form :model="ruleForm" ref="ruleForm">
      <el-row>
        <el-col class="elementWidth" :span="12">
          <el-form-item prop="data">
            <el-input auto-complete="off" style="width: 170px">
              <template slot="prepend">月份</template>
              <el-select slot="suffix" v-model="ruleForm.date" filterable placeholder="请选择" @change="querySubscribe"
                         style="width: 101px; margin-right: -5px">
                <el-option v-for="item in dateOptions" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item>
            <el-button style="position: absolute; margin-left: 10px" size="mini" type="primary"
                       @click="exportSubscribe">导出
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-table :indent="8" :data="dataList" highlight-current-row stripe border max-height="700px">
          <el-table-column prop="date" label="月份" align="center" width="80"></el-table-column>
          <el-table-column prop="businessScope" label="业务类型" width="80" align="center"></el-table-column>
          <el-table-column prop="awbNumber" label="主运单号" align="center"></el-table-column>
          <el-table-column prop="hawbNumber" label="分运单号" align="center"></el-table-column>
          <el-table-column prop="creator" label="操作人" width="100" align="center"></el-table-column>
          <el-table-column prop="createTime" label="操作时间" width="150" align="center"></el-table-column>
          <el-table-column prop="createIp" label="IP地址" width="120" align="center"></el-table-column>
        </el-table>
        <el-col :span="24" class="pagination">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption"
                         :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper"
                         :total="pageConf.totalPage">
          </el-pagination>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  name: "hrs_org_subscribe",
  data() {
    return {
      dataList: [],
      dateOptions: [],
      ruleForm: {
        date: '',
        size: 10,
        current: 1,
      },
      pageConf: {
        //设置一些初始值(会被覆盖)
        pageCode: 1, //当前页
        pageSize: 10, //每页显示的记录数
        totalPage: 0, //总记录数
        pageOption: [10, 30, 50], //分页选项
      },
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false);
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
        message: '操作失败，' + info,
        type: 'error',
        position: 'bottom-right'
      });
    },
    querySubscribe() {
      this.ruleForm.size = this.pageConf.pageSize;
      this.ruleForm.current = this.pageConf.pageCode;

      this.$axios.get2("/afbase/awbSubscription/pageSubscribe", this.ruleForm).then(function (response) {
        if (response.data.code == 0) {
          this.pageConf.totalPage = response.data.data.total;
          this.dataList = response.data.data.records;
        } else {
          this.openError(response.data.messageInfo);
        }
      }.bind(this)).catch(function (error) {
        this.openError(error);
      }.bind(this))
    },
    exportSubscribe() {
      this.$axios.post3('/afbase/awbSubscription/exportSubscribe', this.ruleForm)
        .then(function (response) {
          let blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
          });
          let downloadElement = document.createElement('a');
          let href = window.URL.createObjectURL(blob); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = '订阅明细.xls'; // 下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        }.bind(this));
    },
    generateDateOption() {
      for (let i = 0; i < 2; i++) {
        let timeInterval = i * 30 * 24 * 60 * 60 * 1000;
        let date = new Date(new Date().getTime() - timeInterval);
        let month = date.getMonth() + 1;
        if (month < 10) {
          month = "0" + month;
        }
        let item = date.getFullYear() + "-" + (month);
        this.dateOptions.push({label: item, value: item});
      }
    },
    handleSizeChange() {
      this.querySubscribe();
    },
    //当前页改变时触发的函数
    handleCurrentChange() {
      this.querySubscribe();
    },
  },
  created() {
    this.generateDateOption();
    this.ruleForm.date = this.dateOptions[0].value;
    this.querySubscribe();
  }
}
</script>

<style scoped>

</style>
