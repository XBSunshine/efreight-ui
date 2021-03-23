<template>
  <div class="warp-main">
    <el-form :inline="false" :model="query" label-width="100px" class="css_report_receivable_age">
      <div ref="prm_receivable_header">
        <el-row>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input style="width:149px;">
                <template slot="prepend">是否超期</template>
                <el-select slot="suffix" v-model="query.overdue" style="width: 80px;margin-right: -5px;">
                  <el-option label="全部" value="">
                  </el-option>
                  <el-option label="是" value="1">
                  </el-option>
                  <el-option label="否" value="0">
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input style="width:180px;">
                <template slot="prepend">是否超额</template>
                <el-select slot="suffix" v-model="query.excess" style="width: 111px;margin-right: -5px;">
                  <el-option label="全部" value="">
                  </el-option>
                  <el-option label="是" value="1">
                  </el-option>
                  <el-option label="否" value="0">
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input style="width: 450px;" v-model="query.coopName" auto-complete="off" clearable>
                <template slot="prepend">客&emsp;&emsp;户</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="20px">
              <el-button type="text" size="mini" v-if="showFlag" v-on:click="showFlagSearch">收起</el-button>
              <el-button type="text" size="mini" v-if="!showFlag" v-on:click="showFlagSearch">展开</el-button>
              <el-button type="primary" size="small" v-on:click="findByPage"
                         style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if=showFlag>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input style="width:149px;">
                <template slot="prepend">业务区域</template>
                <el-select slot="suffix" v-model="query.billTemplate" style="width: 80px;margin-right: -5px;" clearable>
                  <el-option label="全部"   value=""></el-option>
                  <el-option label="华北" value="BJS"></el-option>
                  <el-option label="华南" value="CAN"></el-option>
                  <el-option label="华东" value="SHA"></el-option>
                  <el-option label="总部" value="EFT"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input style="width: 180px;" v-model="query.customerResponsible" auto-complete="off" clearable>
                <template slot="prepend">客户负责人</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input style="width: 450px;" v-model="overdueInterval" auto-complete="off" clearable>
                <template slot="prepend">分布区间</template>
              </el-input>
            </el-form-item>
            <span style="float: left;margin-left: 80px;margin-top: -12px;font-size: smaller;color: red;">格式：正整数以';'分隔,最多五个数值</span>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="39px">
              <el-button style="margin-left: 13px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
              <el-button :loading="buttonLoading"
                         style="margin-left: 12px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF"
                         type="primary" size="small" v-on:click="exportExcelList">导出
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <!-- @cell-click="handlerCellClick" -->
    <el-table border v-loading="loading" :max-height="tableHeight" class="table_rec" highlight-current-row :data="data" :cell-class-name="addPullRightClass" :cell-style="addCellStayle" @header-dragend="cellWidth"
              stripe
              show-summary
              :summary-method="getSummary"
    >
      <template v-for="(item,index) in tableColumns">
        <el-table-column v-if="item.label=='序号'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.label=='客户名称'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center">
          <template slot-scope="scope">
            <a href="javascript:void(0)" @click="cellClick(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row[item.prop]}}</a>
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.prop=='whitelistDate'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
          <template slot-scope="scope">
            <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.whitelistDate"></i>
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.prop=='overdueDays'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
          <template slot-scope="scope">
            <span v-if="scope.row.hasOverdueDays" style="color: red;">{{ scope.row.overdueDays }}</span>
            <span v-else>{{ scope.row.overdueDays < 0 ? 0 : scope.row.overdueDays }}</span>
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.prop=='amountReceived'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortAmountReceived">
          <template slot-scope="scope">
            <span v-if="scope.row.hasOverdueAmount" style="color: red;">{{ scope.row.amountReceived }}</span>
            <span v-else>{{ scope.row.amountReceived }}</span>
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.prop=='accountPeriodAmount'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortAccountPeriodAmount">
        </el-table-column>
        <el-table-column v-else-if="item.prop=='overdueAmount'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortOverdueAmount">
          <template slot-scope="scope">
            <span v-if="scope.row.overdueAmount == 0">{{ scope.row.overdueAmount }}</span>
            <span v-else style="color: red;">{{ scope.row.overdueAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.prop=='distribute' && column.length > 0" label="超期应收账款分布情况" header-align="center">
          <el-table-column v-for="(item,index) in column" :key="index" :prop="item.prop" :label="item.label"
                           header-align="center" align="right" width="120">
          </el-table-column>
        </el-table-column>

        <el-table-column v-else header-align="center" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
        </el-table-column>

      </template>
    </el-table>
    <detail ref="addMission" v-if="detailVisible" :visible.sync="detailVisible" :frow="frow"></detail>
    <setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible" :frow="frow"></setVisibleTag>
  </div>
</template>
<script>
import Detail from './reportReceivableAge/report_receivable_age_detail'
import setVisibleVue from './reportReceivableAge/prm_report_receivable_age_list_setting.vue'
import columns from './reportReceivableAge/prm_report_receivable_age_list_column.json'
export default {
  data() {
    return {
      tableHeight: '750px',
      /*表数据*/
      data: [],
      tableColumns: [],
      column: [],
      pageConf: {
        //设置一些初始值(会被覆盖)
        pageCode: 1, //当前页
        pageSize: 10, //每页显示的记录数
        totalPage: 0, //总记录数
        pageOption: [5, 10, 20]
      },
      query: {
        overdue: '',
        excess: '',
        coopName: null,
        customerResponsible: null,
        overdueInterval: [],
        billTemplate: '',
        columnStrs: ''
      },
      overdueInterval: '30;60;90;180',
      loading: false,
      showFlag: false,
      detailVisible: false,
      buttonLoading: false,
      currRow: {},
      frow: {},
      aggregate: {},
      tableColumn: [],
      setVisible: false,
    }
  },
  created() {
      //从数据库查询设置信息
      let pageName = '翌飞结算管理/报表管理/应收账龄';
      this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
          .then(function(response) {
              let lock_list_column = response.data.data;
              if (lock_list_column && lock_list_column.length > 0) {
                  this.tableColumns = this.sortBykey(lock_list_column, 'index');
              } else {
                  this.tableColumns = this.sortBykey(columns.prmReportReceivableAgeInfo, 'index');
              }
          }.bind(this));
  },
  provide() {
      return {
          findByPage: this.findByPage
      }
  },
  components: {
    'detail': Detail,
    'setVisibleTag': setVisibleVue,
  },
  methods: {
    setting() {
        //this.frow.businessScope = this.query.businessScope
        this.setVisible = true;
    },
    sortBykey(ary, key) {
        return JSON.parse(JSON.stringify(ary)).sort(function(a, b) {
            let x = a[key]
            let y = b[key]
            return ((x < y) ? -1 : (x > y) ? 1 : 0)
        })
    },
    //标题样式
    addPullRightClass({
                          row,
                          column,
                          rowIndex,
                          columnIndex
                      }) {
    },
    addCellStayle(data) {

    },
    cellWidth(newWidth, oldWidth, column, event) {
        let strColumn = JSON.stringify(columns.prmReportReceivableAgeInfo);
        let userId = window.localStorage.getItem('userId');
        let arrayC = JSON.parse(strColumn);
        if (arrayC && arrayC.length > 0) {
            try {
                arrayC.forEach((item, index) => {
                    if (column.label == item.label) {
                        item.width = newWidth
                        throw Error('end')
                    }
                })
            } catch (e) {
                //TODO handle the exception
            }
            arrayC = this.sortBykey(arrayC, 'index')
            localStorage.setItem(userId + '_prm_report_receivable_age_list_column_width', JSON.stringify(arrayC))
        }
    },
    sortAmountReceived(a, b) {
        return a.amountReceived.replace(/,/g, "") - b.amountReceived.replace(/,/g, "")
    },
    sortOverdueAmount(a, b) {
        return a.overdueAmount.replace(/,/g, "") - b.overdueAmount.replace(/,/g, "")
    },
    sortAccountPeriodAmount(a, b) {
        return a.accountPeriodAmount.replace(/,/g, "") - b.accountPeriodAmount.replace(/,/g, "")
    },
    showFlagSearch() {
      this.showFlag = !this.showFlag;
      this.setHeight();
    },
    setHeight() {
      this.$nextTick(() => {
        let prm_receivable_header = this.$refs.prm_receivable_header.offsetHeight;
        let heightS = window.innerHeight - 92 - prm_receivable_header;
        this.tableHeight = heightS + "px";
      });
    },
    cellClick(row) {
      this.frow.coopId = row.coopId;
      this.frow.billTemplate = row.billTemplate;
      this.detailVisible = true;
    },
    findByPage() {
      this.setHeight();
        //从数据库查询设置信息
        let pageName = '翌飞结算管理/报表管理/应收账龄';
        this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
            .then(function(response) {
                let lock_list_column = response.data.data;
                if (lock_list_column && lock_list_column.length > 0) {
                    this.tableColumns = this.sortBykey(lock_list_column, 'index');
                } else {
                    this.tableColumns = this.sortBykey(columns.prmReportReceivableAgeInfo, 'index');
                }

                let regx = /^(\d+(;\d+)*)?$/g
                if (!regx.test(this.overdueInterval)) {
                    this.openError('统计区间格式有误,必须是正整数以";"分隔')
                    return
                }
                if (this.overdueInterval.split(';').length > 5) {
                    this.openError('统计区间最多录入5个数值')
                    return
                }
                if (Array.from(new Set(this.overdueInterval.split(';'))).length != this.overdueInterval.split(';').length) {
                    this.openError('统计区间录入数值不可重复')
                    return
                }
                this.query.overdueInterval = this.overdueInterval.split(';').sort((e1, e2) => parseInt(e1) - parseInt(e2));
                this.customerType = this.query.customerType
                this.loading = true
                this.$axios.post2("/prm/coopStatement/list", this.query)
                    .then(function (response) {
                        if (response.data.code == 0) {
                            this.buildIntervalAmountColumn();
                            this.data = response.data.data.coopStatementList;
                            this.aggregate = response.data.data;
                            this.loading = false;
                        } else {
                            this.openError(response.data.messageInfo || '查询失败');
                            this.loading = false;
                        }
                    }.bind(this))
                    .catch(function (error) {
                        this.openError(error)
                        this.loading = false;
                    });
            }.bind(this));

    },
    buildIntervalAmountColumn() {
      this.column = [];
      let tmp = this.query.overdueInterval;
      for (let i = 0; i < tmp.length; i++) {
        let num = parseInt(tmp[i]);
        let label = "";
        if (i == 0) {
          label = "1-" + num;
        } else {
          label = (parseInt(tmp[i - 1]) + 1) + "-" + num;
        }
        this.column.push({"label": label, "prop": "intervalAmount" + (i + 1)});
      }
      if (tmp.length > 0) {
        let len = tmp.length;
        this.column.push({"label": tmp[len - 1] + "+", "prop": "intervalAmount" + (len + 1)});
      }
    },
    exportExcelList() {
        if (this.data.length == 0) {
            this.openError("查询结果列表为空，不允许导出")
            return;
        }
        this.exportExcelSure();
        /*this.$confirm('是否根据结果字段导出数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
        }).then(() => {
            this.query.columnStrs = JSON.stringify(this.tableColumns);
            this.exportExcelSure();
        }).catch(() => {
            let excelList = this.sortBykey(columns.prmReportReceivableAgeInfo, 'index');
            this.query.columnStrs = JSON.stringify(excelList);
            this.exportExcelSure();
        });*/
    },
    exportExcelSure() {
        let regx = /^(\d+(;\d+)*)?$/g
        if (!regx.test(this.overdueInterval)) {
            this.openError('统计区间格式有误,必须是正整数以";"分隔')
            return
        }
        if (this.overdueInterval.split(';').length > 5) {
            this.openError('统计区间最多录入5个数值')
            return
        }
        if (Array.from(new Set(this.overdueInterval.split(';'))).length != this.overdueInterval.split(';').length) {
            this.openError('统计区间录入数值不可重复')
            return
        }
        let exportColumn = [];
        this.tableColumn.forEach((item) => {
            if (item.property) {
                exportColumn.push({"label": item.label, "prop": item.property})
            }
        })
        this.query.columnStr = JSON.stringify(exportColumn);
        this.query.overdueInterval = this.overdueInterval.split(';').sort((e1, e2) => parseInt(e1) - parseInt(e2)).join();
        this.customerType = this.query.customerType;
        this.loading = true
        this.buttonLoading = true

        this.$axios.post3('/prm/coopStatement/exportList', this.query)
            .then(function (response) {
                this.loading = false
                this.buttonLoading = false
                let blob = new Blob([response.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
                });
                let downloadElement = document.createElement('a');
                let href = window.URL.createObjectURL(blob); // 创建下载的链接
                downloadElement.href = href;
                downloadElement.download = '应收账龄报表' + '.xls'; // 下载后文件名
                document.body.appendChild(downloadElement);
                downloadElement.click(); // 点击下载
                document.body.removeChild(downloadElement); // 下载完成移除元素
                window.URL.revokeObjectURL(href); // 释放掉blob对象
            }.bind(this)).catch(function (error) {
            this.loading = false
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
    //pageSize改变时触发的函数
    handleSizeChange() {
      this.findByPage();
    },
    //当前页改变时触发的函数
    handleCurrentChange() {
      this.findByPage();
    },
    getSummary(param) {
      const {columns, data} = param;
      this.tableColumn = columns;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价';
          return;
        }
        sums[index] = this.aggregate[column.property];
      })
      return sums;
    }
  },

}
</script>
<style>
.css_report_receivable_age .el-table .cell {
  white-space: pre-line !important;
  /*保留换行符*/
}

.css_report_receivable_age .table_rec tr.current-row > td {
  background: #FDF5E6 !important;
}

.css_report_receivable_age .el-input__icon {
  line-height: 30px !important;
}

.css_report_receivable_age .el-form-item__content {
  line-height: 30px !important;
}

.css_report_receivable_age .el-input-group__prepend {
  padding: 0 6px;
}

.css_report_receivable_age .widthWithThree .el-input-group__prepend {
  padding: 0 13px !important;
}

.css_report_receivable_age .el-checkbox__inner {
  background-color: #FFF !important;
}

.css_report_receivable_age .el-button {
  margin-top: -5px !important
}
</style>
