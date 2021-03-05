<template>
  <div class="warp-main ">
    <el-row v-loading="loading" element-loading-text="拼命加载中">
      <el-col class="toolbar" style="padding-bottom: 0;">
        <el-form :model="query" class="doc-page">
          <el-row>
            <el-col class="elementWidth">
              <el-form-item label="" label-width="10px">
                <el-input style="width:200px;">
                  <template slot="prepend">业务范畴</template>
                  <el-select slot="suffix" v-model="query.businessScope" placeholder="请选择"
                             style="width:131px;margin-right: -5px;" @change="changeBusiness">
                    <el-option v-for="item in businessList" :key="item.paramText" :label="item.paramText"
                               :value="item.paramText">
                    </el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input v-model="query.docName" auto-complete="off" style="width: 330px;" clearable>
                  <template slot="prepend">单证名称</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input style="width:210px;">
                  <template slot="prepend">上传日期</template>
                  <el-date-picker slot="suffix" v-model="query.uploadTimeStart" clearable type="date"
                                  value-format="yyyy-MM-dd" placeholder="开始" style="width: 141px;margin-right: -5px;">
                  </el-date-picker>
                </el-input>
                <span>-</span>
                <el-date-picker v-model="query.uploadTimeEnd" clearable type="date" value-format="yyyy-MM-dd"
                                placeholder="结束" style="width: 135px;">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item style="margin-left: 31px;">
                <el-button type="text" size="small" v-if=showFlag v-on:click="showFlag=false">收起</el-button>
                <el-button type="text" size="small" v-if=!showFlag v-on:click="showFlag=true">展开</el-button>
                <el-button type="primary" size="small" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;"
                           @click="findQuery">查询
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <template v-if="showFlag">
            <el-row>
              <el-col class="elementWidth">
                <el-form-item label-width="10px">
                  <el-input v-model="query.number" auto-complete="off" style="width: 200px;" clearable>
                    <template slot="prepend">提单号</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label-width="10px">
                  <el-input v-model="query.orderCode" auto-complete="off" style="width: 160px;" clearable>
                    <template slot="prepend">订单号</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label-width="10px">
                  <el-input v-model="query.customerNumber" auto-complete="off" style="width: 160px;" clearable>
                    <template slot="prepend">客户单号</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label-width="10px">
                  <el-input style="width:210px;">
                    <template slot="prepend">{{ dateName }}</template>
                    <el-date-picker slot="suffix" v-model="query.dateTimeStart" clearable type="date"
                                    value-format="yyyy-MM-dd" placeholder="开始" style="width: 141px;margin-right: -5px;">
                    </el-date-picker>
                  </el-input>
                  <span>-</span>
                  <el-date-picker v-model="query.dateTimeEnd" clearable type="date" value-format="yyyy-MM-dd"
                                  placeholder="结束" style="width: 135px;">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item style="margin-left: 58px">
                  <el-button
                    style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF"
                    type="primary" size="small" @click="setting">设置
                  </el-button>
                  <el-button
                    style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF"
                    type="primary" size="small" @click="exportExcel">导出
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="elementWidth">
                <el-form-item label-width="10px">
                  <el-input v-model="query.seller" auto-complete="off" style="width: 200px;" clearable>
                    <template slot="prepend">责任销售</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label-width="10px">
                  <el-input v-model="query.customerService" auto-complete="off" style="width: 160px;" clearable>
                    <template slot="prepend">责任客服</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label-width="10px">
                  <el-input v-model="query.operator" auto-complete="off" style="width: 160px;" clearable>
                    <template slot="prepend">责任操作</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label-width="10px">
                  <el-input v-model="query.customer" auto-complete="off" style="width: 360px;" clearable>
                    <template slot="prepend">客户</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="elementWidth">
                <el-form-item label="" label-width="10px">
                  <el-input style="width:200px;">
                    <template slot="prepend">单证类型</template>
                    <el-select slot="suffix" clearable v-model="query.docType" placeholder="请选择"
                               style="width:131px;margin-right: -5px;">
                      <el-option label="文件" value="文件"></el-option>
                      <el-option label="照片" value="照片"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label-width="10px">
                  <el-input v-model="query.docOperator" auto-complete="off" style="width: 160px;" clearable>
                    <template slot="prepend">单证操作人</template>
                  </el-input>
                </el-form-item>
              </el-col>

            </el-row>
          </template>
        </el-form>
      </el-col>

      <el-table :data="data" border @header-dragend="cellWidth">

        <el-table-column label="操作" align="center" width="50">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
              <i class="el-icon-s-operation"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item></el-dropdown-item>
                <el-dropdown-item command="download">下载</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

        <template v-for="(item,index) in tableColumns">
          <template v-if="!item.hidden">
            <el-table-column v-if="item.prop == 'dateTime'" :label="dateName" :key="index" :prop="item.prop"
                             :width="item.width"
                             :align="item.align" :sortable="item.sortable"></el-table-column>

            <el-table-column v-else-if="item.prop == 'customerNumber'" :label="customerNumberName" :key="index"
                             :prop="item.prop" :width="item.width"
                             :align="item.align" :sortable="item.sortable"></el-table-column>

            <el-table-column v-else-if="item.prop=='fileName'" :key="index" :prop="item.prop" :label="item.label"
                             header-align="center"
                             :width="item.width" :align="item.align" :sortable="item.sortable">
              <template slot-scope="scope">
                <a href="javascript:void(0)" @click="cellClick(scope.row)"
                   style="color: #137DFA;text-decoration: underline;">{{ scope.row.fileName }}</a>
              </template>
            </el-table-column>

            <el-table-column v-else :key="index" :prop="item.prop" hidden="hidden" :label="item.label"
                             header-align="center"
                             :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
          </template>
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
    <setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible"
                   :frow="this.frow"></setVisibleTag>
  </div>
</template>

<script>
import setVisibleVue from './doc/hrs_doc_template_setting'
import columns from './doc/hrs_doc_column.json'

export default {
  name: "hrs_doc",
  data() {
    return {
      frow: {},
      showFlag: false,
      loading: false,
      businessList: [],
      data: [],
      dateName: '开航日期',
      customerNumberName: '客户单号',
      currRow: Object,
      tableColumns: [],
      setVisible: false,
      labelName: {
        dateTime: {
          "AE": "开航日期",
          "AI": "到港日期",
          "SE": "开航日期",
          "SI": "到港日期",
          "TE": "发车日期",
          "TI": "到达日期",
          "LC": "用车日期",
          "VL": "用车日期",
          "IO": "业务日期",
          "OTHER": "其它日期",
        },
        customerNumber: {
          "SE": "合约号",
          "OTHER": "客户单号",
        }
      },
      hiddenDic: {
        "VL": {
          "number": true,
          "customerNumber": true,
          "salesName": true,
          "servicerName": true
        },
        "LC": {
          "number": true,
        },
        "IO": {
          "number": true,
        },
      },
      pageConf: {
        //设置一些初始值(会被覆盖)
        pageCode: 1, //当前页
        pageSize: 10, //每页显示的记录数
        totalPage: 0, //总记录数
        pageOption: [10, 30, 50], //分页选项
      },
      query: {
        businessScope: null,
        docName: null,
        uploadTimeStart: null,
        uploadTimeEnd: null,
        orderCode: null,
        customerNumber: null,
        dateTimeStart: null,
        dateTimeEnd: null,
        seller: null,
        customerService: null,
        operator: null,
        customer: null,
        docType: null,
        docOperator: null,
      }
    }
  },
  components: {
    'setVisibleTag': setVisibleVue,
  },
  methods: {
    cellWidth(newWidth, oldWidth, column, event) {
      let strColumn = JSON.stringify(this.tableColumns);
      let userId = window.localStorage.getItem('userId');
      let arrayC = JSON.parse(strColumn);
      if (arrayC && arrayC.length > 0) {
        arrayC.forEach(function (item, index) {
          if (column.label == item.label) {
            item.width = newWidth;
          }
        });
        arrayC = this.sortBykey(arrayC, 'index');
        localStorage.setItem(userId + '_hrs_doc_column_width', JSON.stringify(arrayC))
      }
    },
    loadBusiness() {
      this.$axios.get('/afbase/category/docBusinessScope').then(function (response) {
        this.businessList = response.data.data;
        if (this.businessList.length > 0) {
          this.query.businessScope = this.businessList[0].paramText;
        }
      }.bind(this)).catch(function (error) {
        console.error(error)
      })
    },
    changeBusiness() {
      let scope = this.query.businessScope;
      this.dateName = this.labelName.dateTime[scope] || this.labelName.dateTime.OTHER;
      this.customerNumberName = this.labelName.customerNumber[scope] || this.labelName.customerNumber.OTHER;
      this.processColumn();
      this.data = [];
    },
    processColumn() {
      let dic = (this.hiddenDic[this.query.businessScope] || {});
      this.tableColumns.forEach((item) => {
        item['hidden'] = dic[item.prop] || false;
      })
    },
    findQuery() {
      this.pageConf.pageCode = 1;
      this.submitQuery();
    },
    submitQuery() {
      //从数据库查询设置信息
      let pageName = '组织机构管理/单证管理';
      this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
        .then(function (response) {
          let column_template = response.data.data;
          if (column_template && column_template.length > 0) {
            this.tableColumns = this.sortBykey(column_template, 'index');
          } else {
            this.tableColumns = this.sortBykey(columns.info, 'index');
          }
          this.processColumn();
          this.loading = true
          this.query['current'] = this.pageConf.pageCode;
          this.query['size'] = this.pageConf.pageSize;
          this.$axios.get2("/hrs/doc/page", this.query).then(function (response) {
            this.loading = false;
            if (response.data.code == 0) {
              this.data = response.data.data.records;
              this.pageConf.totalPage = response.data.data.total;
            } else {
              this.openError(response.data.messageInfo);
            }
          }.bind(this)).catch(function (error) {
            this.loading = false;
            this.openError("查询失败");
            console.error(error);
          }.bind(this))
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
        message: '操作失败，' + info,
        type: 'error',
        position: 'bottom-right'
      });
    },
    concat(key, value) {
      this.query[key] = (this.query[key] || '').length > 0 ? this.query[key] + value : null;
    },
    getDateTime(theDate) {
      let _year = theDate.getFullYear();
      let _month = theDate.getMonth();
      _month = _month + 1;
      if (_month < 10) {
        _month = "0" + _month;
      }
      return _year + "-" + _month + "-01";
    },
    //pageSize改变时触发的函数
    handleSizeChange() {
      this.submitQuery();
    },
    //当前页改变时触发的函数
    handleCurrentChange() {
      this.submitQuery();
    },
    handleCommand(command) {
      if (command == "download") {
        this.downloadUrl(this.currRow.fileName, this.currRow.fileUrl);
      }
    },
    handleChange(row) {
      this.currRow = row;
    },
    downloadUrl(fileName, url) {
      this.$axios.post3(url).then(function (response) {
        let blob = new Blob([response.data]);
        let downloadElement = document.createElement('a');
        let href = window.URL.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = fileName + url.substring(url.lastIndexOf("."));
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      })
    },
    sortBykey(ary, key) {
      return ary.sort(function (a, b) {
        let x = a[key]
        let y = b[key]
        return ((x < y) ? -1 : (x > y) ? 1 : 0)
      })
    },
    setting() {
      this.frow['businessScope'] = this.query.businessScope;
      this.frow['labelName'] = this.labelName;
      this.frow['hiddenDic'] = this.hiddenDic;
      this.setVisible = true;
    },
    exportExcel() {
      if (this.data && this.data.length > 0) {

      } else {
        this.openError("请先搜索是否有数据，在进行导出");
        return false;
      }
      this.$confirm('是否根据结果字段导出数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let column = [];
        this.tableColumns.forEach((item) => {
          if (!item['hidden']) {
            column.push(item);
          }
        });
        this.query.columnStrs = JSON.stringify(this.sortBykey(this.setLabel(column), "index"))
        this.exportExcelSure();
      }).catch(() => {
        let column = [], hidDic = this.hiddenDic[this.query.businessScope];
        if (hidDic) {
          columns.info.forEach((item) => {
            if (!hidDic[item.prop]) {
              column.push(item);
            }
          })
        }
        this.query.columnStrs = JSON.stringify(this.sortBykey(this.setLabel(column.length > 0 ? column : columns.info), "index"))
        this.exportExcelSure();
      });

    },
    exportExcelSure() {
      this.$axios.post3('/hrs/doc/export', this.query)
        .then((response) => {
          let blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
          });
          let downloadElement = document.createElement('a');
          let href = window.URL.createObjectURL(blob); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = '单证管理' + '.xls'; // 下载后文件名
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
    setLabel(tableColumns) {
      tableColumns.forEach((column, index) => {
        if (column.prop == "dateTime") {
          column.label = this.dateName;
        } else if (column.prop == "customerNumber") {
          column.label = this.customerNumberName;
        }
      });
      return tableColumns;
    },
    cellClick(row) {
      window.open(row.fileUrl);
    }
  },
  provide() {
    return {
      findByPage: this.findQuery,
    }
  },
  created() {
    this.loadBusiness();

    //从数据库查询设置信息
    let pageName = '组织机构管理/单证管理';
    this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
      .then(function (response) {
        let template_list_column = response.data.data;
        if (template_list_column && template_list_column.length > 0) {
          this.tableColumns = this.sortBykey(template_list_column, 'index');
        } else {
          this.tableColumns = this.sortBykey(columns.info, 'index');
        }
      }.bind(this));
  },
  mounted() {
    this.query.uploadTimeStart = this.getDateTime(new Date());
  }
}
</script>

<style>
.doc-page .el-input-group__prepend {
  padding: 0 6px !important;
}

.doc-page .el-input__icon {
  line-height: 30px !important;
}

.doc-page .el-form-item__content {
  line-height: 30px !important;
}
</style>
