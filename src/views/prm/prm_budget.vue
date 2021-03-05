<template>
  <div class="warp-main">
    <el-form :inline="false" :model="query" label-width="100px" class="prm_budget">
      <div ref="prm_budget">
        <el-row>

          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input style="width:162px;">
                <template slot="prepend">区间</template>
                <el-date-picker slot="suffix" v-model="query.startDate" clearable type="month" value-format="yyyy-MM"
                                placeholder="开始" style="width: 113px;margin-right: -5px;">
                </el-date-picker>
              </el-input>
              <span>-</span>
              <el-date-picker v-model="query.endDate" clearable type="month" value-format="yyyy-MM" placeholder="结束"
                              style="width: 113px;">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input style="width:240px;">
                <template slot="prepend">产品名称</template>
                <el-select slot="suffix" v-model="query.serviceId" style="width: 163px;margin-right: -5px;">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="item in budgetService" :key="item.serviceId" :label="item.serviceName"
                             :value="item.serviceId"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input style="width: 157px">
                <template slot="prepend">业务区域</template>
                <el-select slot="suffix" v-model="query.zoneCode" style="width: 80px; margin-right: -5px">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="华北" value="BJS"></el-option>
                  <el-option label="华南" value="CAN"></el-option>
                  <el-option label="华东" value="SHA"></el-option>
                  <el-option label="西北" value="XIY"></el-option>
                  <el-option label="总部" value="EFT"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label="" label-width="10px">
              <el-input style="width:320px;">
                <template slot="prepend">销售负责人</template>
                <el-select slot="suffix" clearable v-model="query.saleIds" filterable multiple placeholder="请选择"
                           style="width:229px;margin-right: -5px;">
                  <el-option v-for="item in seller" :key="item.value" :label="item.label" :value="item.value">
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-button type="primary" size="small" :loading="loading" v-on:click="queryList"
                         style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询
              </el-button>
              <el-button type="primary" size="small" :loading="buttonLoading" v-on:click="exportExcel"
                         style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">导出
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div>
      <el-table :data="budgetData" :span-method="spanMethod" border style="width: 100%; margin-top: 20px"
                :cell-class-name="cellClassName">
        <el-table-column align="center" prop="zoneName" :resizable="false" label="业务区域" width="80"></el-table-column>
        <el-table-column align="center" prop="serviceName" :resizable="false" label="产品名称"
                         width="180"></el-table-column>
        <el-table-column label="新业务" align="center" :resizable="false" label-class-name="prm_budget_new-header-class">
          <el-table-column align="right" header-align="center" :resizable="false" prop="newActuralCharge" label="实际(万元)"
                           width="100" label-class-name="prm_budget_new-header-class"></el-table-column>
          <el-table-column align="right" header-align="center" :resizable="false" prop="newBudget" label="预算(万元)"
                           width="100" label-class-name="prm_budget_new-header-class"></el-table-column>
          <el-table-column align="right" header-align="center" :resizable="false" prop="newFillRate" label="完成率"
                           width="100" label-class-name="prm_budget_new-header-class"></el-table-column>
        </el-table-column>
        <el-table-column label="老业务" align="center" :resizable="false" label-class-name="prm_budget_old-header-class">
          <el-table-column align="right" header-align="center" :resizable="false" prop="oldActuralCharge" label="实际(万元)"
                           width="100" label-class-name="prm_budget_old-header-class"></el-table-column>
          <el-table-column align="right" header-align="center" :resizable="false" prop="oldBudget" label="预算(万元)"
                           width="100" label-class-name="prm_budget_old-header-class"></el-table-column>
          <el-table-column align="right" header-align="center" :resizable="false" prop="oldFillRate" label="完成率"
                           width="100" label-class-name="prm_budget_old-header-class"></el-table-column>
        </el-table-column>
        <el-table-column label="合计" align="center" label-class-name="prm_budget_agv-header-class">
          <el-table-column align="right" header-align="center" :resizable="false" prop="totalActuralCharge"
                           label="实际(万元)" width="100" label-class-name="prm_budget_agv-header-class"></el-table-column>
          <el-table-column align="right" header-align="center" :resizable="false" prop="totalBudget" label="预算(万元)"
                           width="100" label-class-name="prm_budget_agv-header-class"></el-table-column>
          <el-table-column align="right" header-align="center" :resizable="false" prop="totalFillRate" label="完成率"
                           width="100" label-class-name="prm_budget_agv-header-class"></el-table-column>
        </el-table-column>
        <el-table-column label="同期对比" align="center" :resizable="false">
          <el-table-column align="right" header-align="center" :resizable="false" prop="samePeriod" label="同期实际(万元)"
                           width="120"></el-table-column>
          <el-table-column align="right" header-align="center" :resizable="false" prop="growthRate" label="增长率"
                           width="100"></el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "prm_budget",
  data() {
    return {
      query: {
        startDate: '',
        endDate: '',
        zoneCode: "",
        serviceId: "",
        saleIds: "",
      },
      budgetService: [],
      budgetData: [],
      loading: false,
      buttonLoading: false,
      rowspan: {},
      zoneData: {
        "BJS": "华北",
        "CAN": "华南",
        "SHA": "华东",
        "XIY": "西北",
        "EFT": "总部",
        "aggregate": "合计"
      },
      seller: [],
      dangerExclude: {
        "zoneName": true,
        "serviceName": true,
        "totalActuralCharge": true,
        "totalBudget": true,
        "totalFillRate": true,
      },
      rowBeginIndex: {},
    }
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
    queryList() {
      if ((this.query.startDate || "").length == 0) {
        this.openError("请选择区间开始日期");
        return;
      }
      if ((this.query.endDate || '').length == 0) {
        this.openError("请选择区间结束日期");
        return;
      }
      if (this.query.endDate.substring(0, 4) != this.query.startDate.substring(0, 4)) {
        this.openError("请选择同一年月份");
        return;
      }
      this.loading = true;
      this.$axios.post2("/prm/budget/list", this.query)
        .then(function (response) {
          this.loading = false;
          if (response.data.code == 0) {
            this.rowspan = {};
            let tmpData = response.data.data;
            tmpData.forEach((ele) => {
              let v = this.rowspan[ele.zoneCode];
              this.rowspan[ele.zoneCode] = v == null ? 1 : v + 1;
            });
            this.rowBeginIndex = {};
            this.budgetData = response.data.data;
          } else {
            this.openError(response.data.messageInfo);
          }

        }.bind(this))
        .catch(function (error) {
          this.loading = false;
          console.error(error);
          this.openError("查询异常");
        }.bind(this))
    },
    loadBudgetService() {
      this.$axios.get("/prm/budget/service")
        .then(function (response) {
          if (response.data.code == 0) {
            this.budgetService = response.data.data;
          } else {
            this.openError(response.data.messageInfo);
          }
        }.bind(this))
        .catch(function (error) {
          console.error(error);
        }.bind(this))
    },
    spanMethod({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        let zoneCode = row.zoneCode;
        let v = this.rowspan[zoneCode];
        let index = this.rowBeginIndex[zoneCode];
        if (index == null) {
          index = this.rowBeginIndex[zoneCode] = rowIndex;
        }
        if (v >= 1 && rowIndex == index) {
          //合并列的情况
          return {
            rowspan: v,
            colspan: 1
          };
        } else if (rowIndex < (index + v)) {
          //没有列的情况
          return {
            rowspan: 0,
            colspan: 0
          };
        }
        //正常情况
      }
      //正常情况
    },
    exportExcel() {
      this.buttonLoading = true;
      this.$axios.postRequestJSONResponseBlob('/prm/budget/export', this.query)
        .then(function (response) {
          this.buttonLoading = false
          let blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
          });
          let downloadElement = document.createElement('a');
          let href = window.URL.createObjectURL(blob); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = '预算分析' + '.xls'; // 下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        }.bind(this)).catch(function (error) {
        this.buttonLoading = false;
        this.openError(error);
      }.bind(this));
    },
    loadSeller() {
      this.$axios.get('/hrs/dept/selectUser').then(function (response) {
        this.seller = response.data.data;
      }.bind(this))
    },
    cellClassName({row, column, rowIndex, columnIndex}) {
      let key = column.property;
      return this.dangerExclude[key] ? "" : (row[key] || "").indexOf("-") >= 0 ? "prm_budget-danger" : "";
    }
  },
  created() {
    this.loadBudgetService();
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    this.query.startDate = year + "-01";
    this.query.endDate = (year + "-" + (month < 10 ? "0" + month : month + ""));
    this.loadSeller();
  }
}
</script>

<style>
.prm_budget .el-input__icon {
  line-height: 30px !important;
}

.prm_budget .el-form-item__content {
  line-height: 30px !important;
}

.prm_budget .el-input-group__append, .prm_budget .el-input-group__prepend {
  padding: 0px 10px !important;
}

.prm_budget_new-header-class {
  background-color: #fee1e3 !important;
}

.prm_budget_old-header-class {
  background-color: #fdf5e6 !important;
}

.prm_budget_agv-header-class {
  background-color: #d2f4c0 !important;
}

.prm_budget-danger {
  color: red;
}

</style>
