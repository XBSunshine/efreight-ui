<template>
  <div class="warp-main">
    <div>
      <el-col class="toolbar" style="padding-bottom: 0;">
        <el-form>
          <el-row>
            <el-col class="elementWidth">
              <el-form-item label="是否有效" label-width="85px">
                <el-select v-model="query.isValid" placeholder="请选择" @change="searchBillServiceList" style="width: 115px;">
                  <el-option label="全部" value="2"></el-option>
                  <el-option label="有效" value="1"></el-option>
                  <el-option label="失效" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item style="margin-left: 50px;">
                <el-button type="primary" size="small" v-on:click="addService" v-if="addButtonFlag">新增</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </div>
    <div>
      <el-table row-key="serviceId" default-expand-all  :tree-props="{children: 'billServiceDetails', hasChildren: 'hasChildren1'}"  :data="data1" style="width: 100%;" border>
        <el-table-column align="center" label="操作" width="60" type="index">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
              <i class="el-icon-s-operation"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item></el-dropdown-item>
                <el-dropdown-item command="add" v-if="scope.row.serviceCode.length === 3 && addserviceButtonFlag">新增服务</el-dropdown-item>
                <el-dropdown-item command="edit" v-if="editButtonFlag">编辑</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="serviceName" label="收费项目名称" width="370">
        </el-table-column>
        <el-table-column align="center" label="有效" width="50">
          <template slot-scope="scope">
            <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.isValid=='1'"></i>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="remark" label="备注" width="400">
        </el-table-column>
        <el-table-column align="left">
        </el-table-column>
      </el-table>
    </div>
    <create ref="addMission" v-if="createVisible" :visible.sync="createVisible" :frow="frow"></create>
    <edit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></edit>
  </div>
</template>

<script>
    import Create from './prm_service_create'
    import Edit from './prm_service_edit'
    export default {
        data() {
            return {
                data1: [],
                query: {
                    isValid: '1',
                },
                currRow: '',
                loading: false,
                frow:{},
                createVisible: false,
                editVisible: false,
                makingBillButtonFlag: false,
                addButtonFlag: false,
                addserviceButtonFlag: false,
                editButtonFlag: false
            }
        },
        created() {
            let buttonInfo = window.localStorage.getItem('buttonInfo')
            if (buttonInfo.indexOf('sys_coop_service_add')>-1) {
                this.addButtonFlag=true;
            }
            if (buttonInfo.indexOf('sys_coop_service_addservice')>-1) {
                this.addserviceButtonFlag=true;
            }
            if (buttonInfo.indexOf('sys_coop_service_edit')>-1) {
                this.editButtonFlag=true;
            }
            this.searchBillServiceList();
        },
        components: {
            'create': Create,
            'edit': Edit,
        },
        provide() {
            return {
                searchBillServiceList: this.searchBillServiceList
            }
        },
        methods: {
            searchBillServiceList() {
                this.data1=[];
                this.$axios.get2('/prm/coopBill/searchBillService',{
                    isValid1: this.query.isValid,
                },).then(function(response) {
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
            addService() {
                this.frow.source='addbutton';
                this.createVisible = true;
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
            handleChange(command) {
                this.currRow = command
            },
            handleCommand(command) {
                if(command == 'add') {
                    this.handleAdd(this.currRow)
                } else if(command == 'edit') {
                    this.handleEdit(this.currRow)
                }
            },
            handleAdd(row) {
                this.frow = row;
                this.frow.source='';
                this.createVisible = true;
            },
            handleEdit(row) {
                this.frow = row;
                this.editVisible = true;
            },
            formatstopDate(row, column) {
                if (row.createTime) {
                    return row.createTime.substring(0,10);
                }else{
                    return "";
                }
            },
        }
    }
</script>


