<template>
  <div class="warp-main">
    <el-form class="user_workgroup">
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label-width="10px">
            <el-input style="width:188px;">
              <template slot="prepend">业务范畴</template>
              <el-select slot="suffix" v-model="query.businessScope" placeholder="请选择" style="width:91px;margin-right: -5px;" clearable>
                <el-option v-for="(item,index) in businessScope" :key="index" :label="item.paramText" :value="item.paramText"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col class="elementWidth">
          <el-form-item label-width="10px">
            <el-input v-model="query.groupName" auto-complete="off" style="width: 180px;" clearable>
              <template slot="prepend">组名称</template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col class="elementWidth">
          <el-form-item label-width="10px">
            <el-input v-model="query.userName" auto-complete="off" style="width: 180px;" clearable>
              <template slot="prepend">姓名</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item style="margin-left: 31px; margin-top: -7px">
            <el-button type="primary" size="small" @click="queryWorkgroup" >查询</el-button>
            <el-button type="primary" size="small" @click="showSave" >新增</el-button>
            <el-button type="primary" size="small" @click="exportData" >导出</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table v-loading="loading" :data="data" border >
      <el-table-column label="操作" align="center" width="50">
        <template slot-scope="scope">
          <el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
            <i class="el-icon-s-operation"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="edit">编辑</el-dropdown-item>
              <el-dropdown-item command="delete">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>

      <el-table-column width="100" prop="businessScope" align="center" label="业务范畴"> </el-table-column>
      <el-table-column label="组名">
        <template slot-scope="scope">
          <a href="javascript:void(0)" @click="cellClick(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row.workgroupName}}</a>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" label="组人数">
        <template slot-scope="scope">
          <a href="javascript:void(0)" @click="cellClick(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row.userCount}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="workgroupRemark" label="组备注"> </el-table-column>
      <el-table-column width="200" label="操作人">
        <template slot-scope="scope">
          <span>{{scope.row.editorName || scope.row.creatorName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150" prop="editTime" label="操作时间">
        <template slot-scope="scope">
          <span>{{scope.row.editTime || scope.row.createTime}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
      </el-pagination>
    </div>

    <saveVisibleTag ref="addMission" v-if="saveVisible" :visible.sync="saveVisible"></saveVisibleTag>
    <editVisibleTag ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></editVisibleTag>
  </div>
</template>

<script>
  import UserWorkgroupSave from './hrs_user_workgroup_save'
  import UserWorkgroupEdit from './hrs_user_workgroup_edit'
  import {deletes} from "../../../http";

  export default {
    name: "hrs_user_workgroup",
    components: {
      "saveVisibleTag": UserWorkgroupSave,
      "editVisibleTag": UserWorkgroupEdit
    },
    data(){
      return {
        loading: false,
        pageConf: {
          //设置一些初始值(会被覆盖)
          pageCode: 1, //当前页
          pageSize: 10, //每页显示的记录数
          totalPage: 0, //总记录数
          pageOption: [10, 30, 50], //分页选项
        },
        query: {
          businessScope: '',
          groupName: '',
          userName: ''
        },
        data: [],
        businessScope: [],
        saveVisible: false,
        editVisible: false,
        frow: Object,
        currRow: Object,
      }
    },
    provide(){
      return {
        queryWorkgroup: this.queryWorkgroup,
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
      loadBusinessScope(){
        this.$axios.get2('/afbase/service/businessScope' ).then((response) => {
          if(response.data.code == '0'){
            this.businessScope = response.data.data;
            if(this.params && this.params[0]){
              this.query.businessScope = this.params[0].paramText || "";
            }
          } else {
            this.openError(response.data.messageInfo, "查询业务范畴")
          }
        }).catch(function(error) {
          console.error(error);
        });
      },
      handleCommand(command){
        switch (command) {
          case "edit":
            this.frow = this.currRow;
            this.editVisible = true;
            break;
          case "delete":
            this.delete();
            break;
          default:
            break;
        }
      },
      handleChange(row){
        this.currRow = row;
      },
      queryWorkgroup(){
        this.loading = true;
        this.$axios.get2("/hrs/userWorkgroup/query", this.getRequestParams()).then(function(response){
          this.loading = false;
          if(response.data && response.data.code == 0){
            let responseData = response.data.data;
            this.data = responseData.records;
            this.pageConf.totalPage = responseData.total;
          }else{
            this.openError(response.data.message || "数据加载失败");
          }
        }.bind(this)).catch(function(error){
          this.loading = false;
          this.openError( "数据加载失败");
        }.bind(this));
      },
      getRequestParams(){
        this.query['size'] = this.pageConf.pageSize;
        this.query['current'] = this.pageConf.pageCode;
        return this.query;
      },
      handleSizeChange(){
        this.queryWorkgroup();
      },
      handleCurrentChange(){
        this.queryWorkgroup();
      },
      cellClick(row){
        this.frow = row;
        this.editVisible = true;
      },
      showSave(){
        this.saveVisible = true;
      },
      exportData(){
        this.$axios.post3('/hrs/userWorkgroup/export', this.query)
          .then(function(response) {
            var blob = new Blob([response.data], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
            });
            var downloadElement = document.createElement('a');
            var href = window.URL.createObjectURL(blob); // 创建下载的链接
            downloadElement.href = href;
            downloadElement.download = '工作组' + '.xls'; // 下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); // 点击下载
            document.body.removeChild(downloadElement); // 下载完成移除元素
            window.URL.revokeObjectURL(href); // 释放掉blob对象
          }.bind(this));
      },
      delete(){
        let row = this.currRow;
        let name = row.workgroupName, userCount = row.userCount, workgroupId = row.workgroupId;
        let msg = '工作组：'+name+'，组员人数：'+userCount+'，请确认是否删除?'

        this.$confirm(msg, '注意', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() =>{
          this.$axios.deletes("/hrs/userWorkgroup/"+workgroupId)
          .then(function (response) {
            if(response.data && response.data.code == 0){
              this.openSuccess();
              this.queryWorkgroup();
            }else{
              this.openError(response.data.messageInfo || '删除失败');
            }
          }.bind(this)).catch(function(error){
            console.error(error);
            this.openError("删除失败");
          })
        });
      }
    },
    created() {
      this.loadBusinessScope();
    },
    mounted() {
      this.queryWorkgroup();
    }
  }
</script>

<style >
  .user_workgroup .el-input__icon {
    line-height: 30px !important;
  }
</style>
