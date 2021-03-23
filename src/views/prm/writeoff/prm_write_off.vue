<template>
  <div class="warp-main">
    <el-row v-loading="loading" element-loading-text="拼命加载中">
      <el-col class="toolbar" style="padding-bottom: 0;">
        <el-form>
          <el-row>
            <el-col class="elementWidth">
              <el-form-item label="账单月份" label-width="85px">
                <el-date-picker v-model="query.statementDateBegin" type="month" value-format="yyyy-MM" placeholder=""
                                style="width: 135px;">
                </el-date-picker>
                <span>-</span>
                <el-date-picker v-model="query.statementDateEnd" type="month" value-format="yyyy-MM" placeholder=""
                                style="width: 135px;">
                </el-date-picker>
              </el-form-item>
            </el-col>

            <el-col class="elementWidth">
              <el-form-item label="收款客户" label-width="85px">
                <el-input v-model="query.coopName" clearable style="width: 135px;">
                </el-input>
              </el-form-item>
            </el-col>

            <el-col class="elementWidth">
              <el-form-item label="核销日期" label-width="85px">
                <el-date-picker v-model="query.writeOffTimeBegin" type="date" value-format="yyyy-MM-dd" placeholder=""
                                style="width: 135px;">
                </el-date-picker>
                <span>-</span>
                <el-date-picker v-model="query.writeOffTimeEnd" type="date" value-format="yyyy-MM-dd" placeholder=""
                                style="width: 135px;">
                </el-date-picker>
              </el-form-item>
            </el-col>

            <el-col class="elementWidth">
              <el-form-item style="margin-left: 15px;">
                <el-button type="text" size="small" v-if=showFlag v-on:click="showFlag=false">收起</el-button>
                <el-button type="text" size="small" v-if=!showFlag v-on:click="showFlag=true">展开</el-button>
                <el-button type="primary" size="small" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;"
                           @click="queryPage">查询
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <template v-if="showFlag">

            <el-row>
              <el-col class="elementWidth">
                <el-form-item label="业务区域" label-width="85px">
                  <el-select v-model="query.zoneCode" style="width: 85px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="华北" value="BJS"></el-option>
                    <el-option label="华南" value="CAN"></el-option>
                    <el-option label="华东" value="SHA"></el-option>
                    <el-option label="西北" value="XIY"></el-option>
                    <el-option label="总部" value="EFT"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label="发票号" label-width="62px">
                  <el-input v-model="query.invoiceNumber" clearable style="width: 135px;">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label="账单名称" label-width="85px">
                  <el-input v-model="query.statementName" clearable style="width: 135px;">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label="操作日期" label-width="85px">
                  <el-date-picker v-model="query.optTimeBegin" type="date" value-format="yyyy-MM-dd" placeholder=""
                                  style="width: 135px;">
                  </el-date-picker>
                  <span>-</span>
                  <el-date-picker v-model="query.optTimeEnd" type="date" value-format="yyyy-MM-dd" placeholder=""
                                  style="width: 135px;">
                  </el-date-picker>
                </el-form-item>
              </el-col>

              <el-col class="elementWidth">
                <el-form-item style="margin-left: 44px;">
                  <el-button
                    style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF"
                    type="primary" size="small" v-on:click="setting">设置
                  </el-button>
                  <el-button
                    style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF"
                    type="primary" size="small" v-on:click="exportExcel">导出
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col class="elementWidth">
                <el-form-item label="核销人" label-width="85px">
                  <el-input v-model="query.writeOffUser" clearable style="width: 85px;">
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col class="elementWidth">
                <el-form-item label="核销单号" label-width="80px">
                  <el-input v-model="query.writeOffNum" clearable style="width: 135px;">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label="发票抬头" label-width="105px">
                  <el-input v-model="query.invoiceTitle" clearable style="width: 135px;">
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col class="elementWidth">
                <el-form-item label="发票日期" label-width="100px">
                  <el-date-picker v-model="query.invoiceDateBegin" type="date" value-format="yyyy-MM-dd" placeholder=""
                                  style="width: 135px;">
                  </el-date-picker>
                  <span>-</span>
                  <el-date-picker v-model="query.invoiceDateEnd" type="date" value-format="yyyy-MM-dd" placeholder=""
                                  style="width: 135px;">
                  </el-date-picker>
                </el-form-item>
              </el-col>

            </el-row>
          </template>
          <el-row>
            <el-table :data="data" border>
              <el-table-column label="操作" align="center" width="50">
                <template slot-scope="scope">
                  <el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
                    <i class="el-icon-s-operation"></i>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item></el-dropdown-item>
                      <el-dropdown-item command="delete" v-if="deleteWriteOffButtonFlag">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>

              <template v-for="(item,index) in tableColumns">
                <el-table-column v-if="item.prop == 'amountReceived'" :key="index" :prop="item.prop" :label="item.label"
                                 header-align="center" :sort-method="sortAmountReceived"
                                 :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
                <el-table-column v-else-if="item.prop == 'amountWriteOff'" :key="index" :prop="item.prop"
                                 :label="item.label"
                                 header-align="center" :sort-method="sortAmountWriteOff"
                                 :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
                <el-table-column v-else :key="index" :prop="item.prop" :label="item.label"
                                 header-align="center"
                                 :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>

              </template>
            </el-table>
            <div class="pagination">

              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="pageConf.pageCode"
                :page-sizes="pageConf.pageOption"
                :page-size.sync="pageConf.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageConf.totalPage">
              </el-pagination>
            </div>
          </el-row>
        </el-form>
      </el-col>
    </el-row>

    <setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible" :frow="this.frow"></setVisibleTag>
  </div>
</template>

<script>
import columns from "./prm_write_off_column.json";
import setVisibleVue from './prm_write_off_template_setting'

export default {
  name: "prm_write_off",
  data() {
    return {
      loading: false,
      showFlag: false,
      deleteWriteOffButtonFlag: false,
      query: {
        statementDateBegin: '',
        statementDateEnd: '',
        coopName: '',
        writeOffTimeBegin: '',
        writeOffTimeEnd: '',

        zoneCode: '',
        invoiceNumber: '',
        statementName: '',
        optTimeBegin: '',
        optTimeEnd: '',

        writeOffUser: '',
        writeOffNum: '',
        invoiceTitle: '',
        invoiceDateBegin: '',
        invoiceDateEnd: '',
      },
      tableColumns: [],
      setVisible: false,
      frow: Object,
      pageConf: {
        //设置一些初始值(会被覆盖)
        pageCode: 1, //当前页
        pageSize: 10, //每页显示的记录数
        totalPage: 0, //总记录数
        pageOption: [10, 30, 50], //分页选项
      },
      data: [],
      pageName: '翌飞结算管理/账单管理/账单确认/核销单',
    }
  },
  components: {
    'setVisibleTag': setVisibleVue,
  },
  methods: {
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
    setting() {
      this.setVisible = true;
    },
    handleSizeChange() {
      this.findByPage();
    },
    //当前页改变时触发的函数
    handleCurrentChange() {
      this.findByPage();
    },
    handleCommand(command) {
      if (command == "delete") {
        this.confirmDelete();
      }
    },
    handleChange(row) {
      this.currRow = row;
    },
    confirmDelete() {
      this.$confirm('是否删除此核销数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.deleteWriteOff()
      }).catch(() => {
      });
    },
    deleteWriteOff() {
      this.$axios.deletes("/prm/writeOff/delete/" + this.currRow["rowUuid"] + "/" + this.currRow['statementRowUuid'])
        .then(function (response) {
          if (response.data.code == 0) {
            this.openSuccess();
            this.queryPage();
          } else {
            this.openError(response.data.messageInfo || "删除失败请重试")
          }
        }.bind(this))
        .catch(function (error) {
          console.error(error);
          this.openError("删除异常")
        })
    },
    queryPage() {
      this.pageConf.pageCode = 1;
      this.findByPage();
    },
    findByPage() {
      //从数据库查询设置信息
      this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + this.pageName)
        .then(function (response) {
          let column_template = response.data.data;
          if (column_template && column_template.length > 0) {
            this.tableColumns = this.sortBykey(column_template, 'index');
          } else {
            this.tableColumns = this.sortBykey(columns.columns, 'index');
          }
          this.loading = true;
          this.query['size'] = this.pageConf.pageSize;
          this.query['current'] = this.pageConf.pageCode;

          this.$axios.get2("/prm/writeOff/page", this.query)
            .then(function (response) {
              this.loading = false
              if (response.data.code == 0) {
                this.data = response.data.data.records;
                this.pageConf.totalPage = response.data.data.total;
              } else {
                this.openError(response.data.messageInfo || '数据查询失败');
              }
            }.bind(this))
            .catch(function (error) {
              this.loading = false
              console.error(error);
              this.openError("数据查询异常")
            }.bind(this))
        }.bind(this))
        .catch(function (error) {
          console.error(error)
          this.openError("数据加载失败");
        }.bind(this))
    },
    exportExcel() {
      this.$confirm('是否根据结果字段导出数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let column = this.tableColumns;
        this.query.columnStrs = JSON.stringify(this.sortBykey(column, "index"))
        this.exportExcelSure();
      }).catch(() => {
        this.query.columnStrs = JSON.stringify(this.sortBykey(columns.columns, "index"))
        this.exportExcelSure();
      });
    },
    sortBykey(ary, key) {
      return ary.sort(function (a, b) {
        let x = a[key]
        let y = b[key]
        return ((x < y) ? -1 : (x > y) ? 1 : 0)
      })
    },
    exportExcelSure() {
      this.$axios.post3('/prm/writeOff/export', this.query)
        .then((response) => {
          let blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
          });
          let downloadElement = document.createElement('a');
          let href = window.URL.createObjectURL(blob); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = '核销单' + '.xls'; // 下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        }).catch(err => {
        let errorinfo = error.response.data.messageInfo;
        this.openError(errorinfo);
      })
      this.query.columnStrs = '';
    },
    getCurrentDate() {
      let date = new Date();
      let months = parseInt(date.getMonth() + 1);
      let days = date.getDate();
      if (months < 10) {
        months = '0' + months
      }
      if (days < 10) {
        days = '0' + days
      }
      let datas = date.getFullYear() + '-' + months + '-' + days + " 00:00:00";
      return datas;
    },
    sortAmountReceived(a, b) {
      return parseFloat(a.amountReceived) - parseFloat(b.amountReceived);
    },
    sortAmountWriteOff(a, b) {
      return parseFloat(a.amountWriteOff) - parseFloat(b.amountWriteOff);
    }
  },
  provide() {
    return {
      "findByPage": this.queryPage
    }
  },
  created() {
      let buttonInfo = window.localStorage.getItem('buttonInfo')
      if (buttonInfo.indexOf('prm_coop_delete_writeoff')>-1) {
          this.deleteWriteOffButtonFlag=true;
      }
    //从数据库查询设置信息
    let pageName = '翌飞结算管理/账单管理/账单确认/核销单';
    this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
      .then(function (response) {
        let template_list_column = response.data.data;
        if (template_list_column && template_list_column.length > 0) {
          this.tableColumns = this.sortBykey(template_list_column, 'index');
        } else {
          this.tableColumns = this.sortBykey(columns.columns, 'index');
        }
      }.bind(this));
  },
  mounted() {
    this.query.writeOffTimeBegin = this.getCurrentDate();
  }
}
</script>

<style scoped>

</style>
