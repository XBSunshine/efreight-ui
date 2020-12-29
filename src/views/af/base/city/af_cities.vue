<template>
  <div class="warp-main">
    <div>
      <el-form :model="query"  class="afCity-ruleForm">
        <el-row>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.cityCode" auto-complete="off" @input="query.cityCode=query.cityCode.toUpperCase()" clearable style="width: 180px;">
                <template slot="prepend">城市代码</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.cityNameCn" auto-complete="off" @input="query.cityNameCn=query.cityNameCn.toUpperCase()" clearable style="width: 300px;">
                <template slot="prepend">城市名称</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.nationCode" auto-complete="off" @input="query.nationCode=query.nationCode.toUpperCase()" clearable style="width: 180px;">
                <template slot="prepend">国家代码</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.nationNameCn" auto-complete="off" @input="query.nationNameCn=query.nationNameCn.toUpperCase()" clearable style="width: 300px;">
                <template slot="prepend">国家名称</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="20px">
              <el-button type="primary" @click="queryList" size="small">查询</el-button>
              <el-button style="margin-left: 4px;" v-if="this.permission.sys_base_city_add.isShow" type="primary" @click="showSave" size="small">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div>
      <el-table :data="data1" border>
        <el-table-column label="操作" align="center" fixed width="50" v-if="this.permission.sys_base_city_add.isShow">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
              <i class="el-icon-s-operation"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="edit" v-if="permission.sys_base_city_edit.isShow">编辑</el-dropdown-item>
                <el-dropdown-item command="delete" v-if="permission.sys_base_city_delete.isShow">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column prop="cityCode" align="center" label="城市代码" width="70"></el-table-column>
        <el-table-column prop="cityNameCn" align="left" label="城市中文名称" min-width="200" header-align="center"></el-table-column>
        <el-table-column prop="cityNameEn" align="left" label="城市英文名称" min-width="200" header-align="center"></el-table-column>
        <el-table-column prop="nationCode" align="center" label="国家代码" width="70"></el-table-column>
        <el-table-column prop="nationNameCn" align="left" label="国家中文名称" min-width="200" header-align="center"></el-table-column>
        <el-table-column prop="nationNameEn" align="left" label="国家英文名称" min-width="200" header-align="center"></el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
      </el-pagination>
    </div>
    <saveVisibleTag ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="fRow"></saveVisibleTag>
    <editVisibleTag ref="addMission" v-if="editVisible" :visible.sync="editVisible" :fRow="fRow"></editVisibleTag>

  </div>
</template>
<script>
    import saveVisibleTag from './af_city_save';
    import editVisibleTag from './af_city_edit';

    export default {
        data() {
            return {
                loading: false,
                data1: [],
                pageConf: {
                    //设置一些初始值(会被覆盖)
                    pageCode: 1, //当前页
                    pageSize: 10, //每页显示的记录数
                    totalPage: 0, //总记录数
                    pageOption: [10, 50, 100], //分页选项
                    handleCurrentChange: function() {
                        console.log("页码改变了");
                    }
                },
                query: {
                    cityCode: '',
                    cityNameCn: '',
                    nationCode: '',
                    nationNameCn: ''
                },
                saveVisible: false,
                editVisible: false,
                fRow: {},
                permission: {
                    sys_base_city_add: {
                        isShow: false
                    },
                    sys_base_city_edit: {
                        isShow: false
                    },
                    sys_base_city_delete: {
                        isShow: false
                    },
                },
            }
        },
        created: function() {
            this.loadPermission(this.permission);
        },
        provide() {
            return {
                queryList: this.queryList
            }
        },
        components: {
            'saveVisibleTag': saveVisibleTag,
            'editVisibleTag': editVisibleTag
        },
        methods: {
            openError(info) {
                this.$notify({
                    title: '',
                    message: '操作失败，' + info,
                    type: 'error',
                    position: 'bottom-right'
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
            queryList() {
                if(this.query.cityCode.trim() || this.query.cityNameCn.trim() || this.query.nationCode.trim() || this.query.nationNameCn.trim()) {
                    let param = "size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode +
                        "&cityCode=" + this.query.cityCode + "&cityNameCn=" + this.query.cityNameCn +
                        "&nationCode=" + this.query.nationCode + "&nationNameCn=" + this.query.nationNameCn;
                    let that = this;
                    this.$axios.get('/afbase/city/page?' + param).then(function(response) {
                        that.data1 = response.data.data.records;
                        that.pageConf.totalPage = response.data.data.total;
                        if(that.data1.length == 0) {
                            let current = Math.ceil(that.pageConf.totalPage / that.pageConf.pageSize);
                            that.queryList2(current);
                        }
                    }).catch(function(error) {
                        console.log(error);
                    });
                } else {
                    this.data1 = [];
                    this.pageConf.totalPage = 0;
                    this.$message.error('查询失败，请输入查询条件！');
                }

            },
            queryList2(current) {
                let param = "size=" + this.pageConf.pageSize + "&current=" + current +
                    "&cityCode=" + this.query.cityCode + "&cityNameCn=" + this.query.cityNameCn +
                    "&nationCode=" + this.query.nationCode + "&nationNameCn=" + this.query.nationNameCn;
                let that = this;
                this.$axios.get('/afbase/city/page?' + param).then(function(response) {
                    that.data1 = response.data.data.records;
                    that.pageConf.totalPage = response.data.data.total;
                }).catch(function(error) {
                    console.log(error);
                });
            },
            //pageSize改变时触发的函数
            handleSizeChange() {
                this.queryList();
            },
            //当前页改变时触发的函数
            handleCurrentChange() {
                this.queryList();
            },
            showSave() {
                this.saveVisible = true;
            },
            handleCommand(command) {
                if("edit" == command) {
                    this.editVisible = true;
                }else if("delete" == command){
                    this.handleDelete(this.fRow)
                }
            },
            handleChange(row) {
                this.fRow = row;
            },
            handleDelete(row) {
                this.$confirm('此操作将永久删除,不可恢复, 是否继续?', '注意', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    this.$axios.deletes('/afbase/city/' + row.cityId)
                        .then(function(response) {
                            if (response.data.code == 0) {
                                this.openSuccess();
                                this.queryList2(1);
                            } else {
                                this.openError(response.data.messageInfo);
                            }
                        }.bind(this));
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
        }
    }
</script>
<style type="text/css">

  .afCity-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .afCity-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .afCity-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }

</style>
