<template>
  <div class="warp-main">
    <div class="shipper-consignee">
      <el-col  class="toolbar" style="padding-bottom: 0;">
      <el-form :inline="true" :model="query" class="demo-ruleForm">
        <el-row>
          <el-col class="elementWidth">
            <el-form-item>
              <el-input style="width: 189px">
                <template slot="prepend">类型</template>
                <el-select slot="suffix" v-model="query.scType" placeholder="请选择" style="width: 100px; margin-right: -5px">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="发货人" value="0"></el-option>
                  <el-option label="收货人" value="1"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="100px">
              <el-input v-model="query.scName" clearable auto-complete="off" style="width: 250px;" @change="query.scName=strTrim(query.scName).toUpperCase()">
                <template slot="prepend">名称</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label="" label-width="100px">
              <el-input v-model="query.scCode" clearable auto-complete="off" style="width: 230px;" @change="query.scCode=strTrim(query.scCode).toUpperCase()">
                <template slot="prepend">代码</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
                <el-button type="text" size="medium" v-if=showFlag v-on:click="showFlag=false">收起</el-button>
                <el-button type="text" size="medium" v-if=!showFlag v-on:click="showFlag=true">展开</el-button>
                <el-button type="primary" size="small"  @click="queryList" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
                <el-button type="primary" size="small" v-on:click="showsave" v-if="addButtonFlag" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="showFlag">
          <!--<el-col class="elementWidth">
            <el-form-item label="助记码" label-width="85px">
              <el-input v-model="query.scMnemonic" clearable auto-complete="off" style="width: 120px;">
              </el-input>
            </el-form-item>
          </el-col>-->
          <el-col class="elementWidth">
            <el-form-item>
              <el-input style="width: 190px">
                <template slot="prepend">是否生效</template>
                <el-select slot="suffix" v-model="query.isValid" placeholder="请选择" style="width: 100px; margin-right: -5px">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="是" :value=true></el-option>
                  <el-option label="否" :value=false></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="100px">
              <el-input v-model="query.nationCode" @input="query.nationCode=toUpperCaseValue(query.nationCode)" clearable auto-complete="off" style="width: 250px;">
                <template slot="prepend"> 国家代码 </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="100px">
              <el-input v-model="query.cityName" @input="query.cityName=toUpperCaseValue(query.cityName)" clearable auto-complete="off" style="width: 230px;">
                <template slot="prepend">城市</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="39px">
              <el-button style="margin-left: 35px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
              <el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel">导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      </el-col>
    </div>
    <div>
      <el-table :data="data" v-loading="loading" border :cell-class-name="addPullRightClass" :cell-style="addCellStayle" @header-dragend="cellWidth">
        <template v-for="(item,index) in tableColumns">
          <el-table-column v-if="item.label=='类型'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
            <template slot-scope="scope">
              <span v-if="scope.row.isValid!=1"><s><b>{{ scTypeFormat(scope.row) }}</b></s></span>
              <span v-else>{{ scTypeFormat(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="item.label=='代码'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
            <template slot-scope="scope">
              <span v-if="scope.row.isValid!=1"><s><b>{{scope.row.scCode}}</b></s></span>
              <span v-else>{{scope.row.scCode}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="item.label=='名称'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isValid!=1"><s><b>{{scope.row.scName}}</b></s></span>
              <span v-else>{{scope.row.scName}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="item.label=='国家'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isValid!=1"><s><b>{{scope.row.nationNameEn}}</b></s></span>
              <span v-else>{{scope.row.nationNameEn}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="item.label=='城市'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isValid!=1"><s><b>{{scope.row.cityNameEn}}</b></s></span>
              <span v-else>{{scope.row.cityNameEn}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="item.label=='是否生效'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
            <template slot-scope="scope">
              <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.isValid"></i>
            </template>
          </el-table-column>
        </template>
        <el-table-column fixed="left" align="center" label="操作" width="60" v-if="isShow">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
              <i class="el-icon-s-operation"></i>
              <el-dropdown-menu slot="dropdown">
              	<el-dropdown-item></el-dropdown-item>
                <el-dropdown-item command="edit" v-if="editButtonFlag">编辑</el-dropdown-item>
                <el-dropdown-item command="view" v-if="viewButtonFlag">查看</el-dropdown-item>
                <el-dropdown-item command="cancel" v-if="cancelButtonFlag && scope.row.isValid">作废</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
      </el-pagination>
    </div>
    <setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible"></setVisibleTag>
    <page-save ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="frow">
    </page-save>
    <page-edit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow">
    </page-edit>
    <page-view ref="addMission" v-if="viewVisible" :visible.sync="viewVisible" :frow="frow">
    </page-view>
  </div>
</template>
<script>
    import save from './shipperConsignee/af_shipperConsignee_save'
    import edit from './shipperConsignee/af_shipperConsignee_edit'
    import view from './shipperConsignee/af_shipperConsignee_view'
    import columns from './shipperConsignee/af_shipperConsignee_column.json'
    import setVisibleVue from './shipperConsignee/af_shipperConsignee_setting'
    export default {
        data() {
            return {
                loading: false,
                showFlag:false,
                data: [],
                tableColumns: [],
                pageConf: {
                    //设置一些初始值(会被覆盖)
                    pageCode: 1, //当前页
                    pageSize: 10, //每页显示的记录数
                    totalPage: 0, //总记录数
                    pageOption: [10, 30, 50]
                },
                saveVisible: false,
                editVisible: false,
                viewVisible: false,
                addButtonFlag: false,
                editButtonFlag: false,
                viewButtonFlag: false,
                cancelButtonFlag: false,
                setVisible: false,
                isShow: true,
                frow: {},
                query: {
                    scType: '',
                    isValid: true,
                    scName: '',
                   // scMnemonic: '',
                    scCode: '',
                    cityName: '',
                    nationCode: ''
                },
                currRow: ''
            }
        },
        created: function() {
            let buttonInfo = window.localStorage.getItem('buttonInfo')
            if (buttonInfo.indexOf('sys_shipperconsignee_add')>-1) {
                this.addButtonFlag=true;
            }
            if (buttonInfo.indexOf('sys_shipperconsignee_edit')>-1) {
                this.editButtonFlag=true;
            }
            if (buttonInfo.indexOf('sys_shipperconsignee_view')>-1) {
                this.viewButtonFlag=true;
            }
            if (buttonInfo.indexOf('sys_shipperconsignee_cancel')>-1) {
                this.cancelButtonFlag=true;
            }
            			this.queryList();
            if(this.editButtonFlag == false && this.viewButtonFlag == false && this.cancelButtonFlag == false){
                this.isShow = false
            }
            //从数据库查询设置信息
            let pageName = '客商资料管理/收发货人';
            this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
                .then(function(response) {
                    let af_shipperConsignee_list_column = response.data.data;
                    if(af_shipperConsignee_list_column && af_shipperConsignee_list_column.length>0){
                        this.tableColumns = this.sortBykey(af_shipperConsignee_list_column, 'index');
                    }else{
                        this.tableColumns = this.sortBykey(columns.info, 'index');
                    }
                }.bind(this));
        },
        provide() {
            return {
                queryList: this.queryList
            }
        },
        components: {
            'setVisibleTag': setVisibleVue,
            'page-save': save,
            'page-edit': edit,
            'page-view': view
        },
        methods: {
            setting() {
                this.setVisible = true;
            },
            cellWidth(newWidth, oldWidth, column, event) {
                let strColumn = JSON.stringify(this.tableColumns);
                let userId = window.localStorage.getItem('userId');
                let arrayC = JSON.parse(strColumn);
                if (arrayC && arrayC.length > 0) {
                    arrayC.forEach(function(item, index) {
                        if (column.label == item.label) {
                            item.width = newWidth;
                        }
                    });
                    arrayC = this.sortBykey(arrayC, 'index');
                    localStorage.setItem(userId + '_af_shipperConsignee_list_column_width', JSON.stringify(arrayC))
                }
            },
            //标题样式
            addPullRightClass({
                                  row,
                                  column,
                                  rowIndex,
                                  columnIndex
                              }) {

            },
            //标题 stly
            addCellStayle(data) {
                return "";
            },
            sortBykey(ary, key) {
                return ary.sort(function(a, b) {
                    let x = a[key]
                    let y = b[key]
                    return ((x < y) ? -1 : (x > y) ? 1 : 0)
                })
            },
            toUpperCaseValue(val) {
              return val.toUpperCase();
            },

            handleCommand(command) {
                if(command == 'edit') {
                    this.showedit(this.currRow)
                } else if(command == 'view') {
                    this.showDetail(this.currRow)
                } else if(command == 'cancel') {
                    this.cancel(this.currRow)
                }
            },
            handleChange(command) {
                this.currRow = command
            },
            showsave() {
                this.saveVisible = true;
            },
            showedit(row) {
                this.frow = row;
                this.editVisible = true;
            },
            showDetail(row) {
                this.frow = row;
                this.viewVisible = true;
            },
            openError(info) {
                this.$notify({
                    title: '',
                    message: info,
                    type: 'error',
                    position: 'bottom-right'
                });
            },
            openSuccess(info) {
                this.$notify({
                    title: '',
                    message: info,
                    type: 'success',
                    position: 'bottom-right'
                });
            },
            cancel(row) {
                let scTypeName = ''
                if(row.scType == '0') {
                    scTypeName = '该发货人'
                } else if(row.scType == '1') {
                    scTypeName = '该收货人'
                }
                this.$confirm('您将作废' + scTypeName + ', 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    this.$axios.put('/afbase/shipperConsignee/cancel/' + row.scId).then((response) => {
                        if(response.data.code == '0') {
                            this.openSuccess("作废成功！")
                            this.queryList();
                        } else {
                            this.openError("作废失败：" + response.data.data.messageInfo)
                        }
                    }).catch((error) => {
                        this.openError("作废失败：" + error.response.data.messageInfo)
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消作废'
                    });
                });

            },
            queryList() {
                //从数据库查询设置信息
                let pageName = '客商资料管理/收发货人';
                this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
                    .then(function(response) {
                        let af_shipperConsignee_list_column = response.data.data;
                        if(af_shipperConsignee_list_column && af_shipperConsignee_list_column.length>0){
                            this.tableColumns = this.sortBykey(af_shipperConsignee_list_column, 'index');
                        }else{
                            this.tableColumns = this.sortBykey(columns.info, 'index');
                        }
                        this.loading = true
                        this.$axios.get2('/afbase/shipperConsignee?size=' + this.pageConf.pageSize + '&current=' + this.pageConf.pageCode, this.query).then((response) => {
                            this.data = response.data.data.records;
                            this.pageConf.totalPage = response.data.data.total;
                            if(this.data.length == 0) {
                                let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
                                this.queryList2(current);
                            } else {
                                this.loading = false
                            }
                        }).catch((error) => {
                            this.loading = false
                            console.log(error);
                        });
                    }.bind(this));

                /*this.loading = true
                this.$axios.get2('/afbase/shipperConsignee?size=' + this.pageConf.pageSize + '&current=' + this.pageConf.pageCode, this.query).then((response) => {
                    this.data = response.data.data.records;
                    this.pageConf.totalPage = response.data.data.total;
                    if(this.data.length == 0) {
                        let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
                        this.queryList2(current);
                    } else {
                        this.loading = false
                    }
                }).catch((error) => {
                    this.loading = false
                    console.log(error);
                });*/
            },
            queryList2(current) {
                this.$axios.get2('/afbase/shipperConsignee?size=' + this.pageConf.pageSize + '&current=' + current, this.query).then((response) => {
                    this.data = response.data.data.records;
                    this.pageConf.totalPage = response.data.data.total;
                    this.loading = false
                }).catch(function(error) {
                    this.loading = false
                    console.log(error);
                });
            },
            exportExcel() {
                this.$confirm('是否根据结果字段导出数据？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    this.query.columnStrs = JSON.stringify(this.tableColumns)
                    this.exportExcelSure()
                }).catch(() => {
                    let excelList = this.sortBykey(columns.info, 'index')
                    this.query.columnStrs = JSON.stringify(excelList)
                    this.exportExcelSure();
                });

            },
            exportExcelSure() {
                this.$axios.post3('/afbase/shipperConsignee/exportExcel', this.query)
                    .then(function(response) {
                        var blob = new Blob([response.data], {
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
                        });
                        var downloadElement = document.createElement('a');
                        var href = window.URL.createObjectURL(blob); // 创建下载的链接
                        downloadElement.href = href;
                        downloadElement.download = '收发货人列表' + '.xls'; // 下载后文件名
                        document.body.appendChild(downloadElement);
                        downloadElement.click(); // 点击下载
                        document.body.removeChild(downloadElement); // 下载完成移除元素
                        window.URL.revokeObjectURL(href); // 释放掉blob对象
                    }.bind(this));
            },
            //pageSize改变时触发的函数
            handleSizeChange() {
                this.queryList();
            },
            //当前页改变时触发的函数
            handleCurrentChange() {
                this.queryList();
            },
            scTypeFormat(row, column) {
                if(row.scType == '1') {
                    return "收货人"
                } else if(row.scType == '0') {
                    return "发货人"
                } else {
                    return ""
                }
            }

        }
    }
</script>
<style>
  .shipper-consignee .el-input__icon {
    line-height: 30px !important;
  }

  .shipper-consignee .el-form-item__content {
    line-height: 30px !important;
  }

  .shipper-consignee .el-input-group__prepend{
    width: 97px;
    text-align: center;
  }


</style>
