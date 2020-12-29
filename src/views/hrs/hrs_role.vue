<template>
  <div class="warp-main">
    <el-row v-loading="loading" element-loading-text="拼命加载中">
      <el-col class="toolbar" style="padding-bottom: 0;">
        <el-form :model="query" class="hrsRole">
          <el-row>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input v-model="query.roleName" auto-complete="off" style="width: 200px;" clearable>
                  <template slot="prepend">名称</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input style="width:160px;">
                  <template slot="prepend">是否生效</template>
                  <el-select slot="suffix" v-model="query.roleStatus" placeholder="请选择" style="width:91px;margin-right: -5px;" clearable>
                    <el-option label="是" :value="true"></el-option>
                    <el-option label="否" :value="false"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item style="margin-left: 41px;">
                <el-button type="primary" size="small" v-on:click="queryList">查询</el-button>
                <el-button type="primary" size="small" v-on:click="showsave" v-if="addButtonFlag">新增</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <el-table ref="multipleTable"
      :data="data1"
      style="width: 100%"
      row-key="roleId"
      border
      lazy
      >
        <el-table-column prop="roleName" label="名称" width="200"></el-table-column>
        <el-table-column prop="createTime" label="创建日期" width="145"></el-table-column>
        <el-table-column prop="editTime" label="更新日期" width="145"></el-table-column>
        <el-table-column prop="roleStatus" label="生效状态" width="75">
          <template slot-scope="scope">
            <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.roleStatus"></i>
          </template>
        </el-table-column>
        <el-table-column></el-table-column>
        <el-table-column
          fixed="left"
          label="操作"
          width="60" align="center">
          <template slot-scope="scope">
            <el-button @click="showedit(scope.row)" type="text" size="small" v-if="editButtonFlag" >修改</el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-col :span="24" class="pagination">
        <el-pagination background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageConf.pageCode"
          :page-sizes="pageConf.pageOption"
          :page-size.sync="pageConf.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageConf.totalPage">
        </el-pagination>
      </el-col>
    </el-row>
    <page-save ref="addMission" v-if="save1Visible" :visible.sync="save1Visible"></page-save>
    <page-edit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></page-edit>

  </div>
</template>
<script>
  import save from './role/hrs_role_save'
  import edit from './role/hrs_role_edit'
  export default {
    data() {
      return {
        showFlag: false,
        loading: false,
        data1: [],
        pageConf: {
            //设置一些初始值(会被覆盖)
            pageCode: 1, //当前页
            pageSize: 10, //每页显示的记录数
            totalPage: 0, //总记录数
            pageOption: [10, 30, 50], //分页选项
            handleCurrentChange: function () {
            console.log("页码改变了");
            }
        },
        query: {
          roleName: '',
          roleStatus: ''
        },
        checkAll: false,
        isIndeterminate: false,
        save1Visible: false,
        save2Visible: false,
        editVisible: false,
        frow:{},
        addButtonFlag: false,
        editButtonFlag: false,
      }
    },
    created: function(){
      let buttonInfo = window.localStorage.getItem('buttonInfo')
      if (buttonInfo.indexOf('sys_role_add')>-1) {
          this.addButtonFlag=true;
      }
      if (buttonInfo.indexOf('sys_role_edit')>-1) {
          this.editButtonFlag=true;
      }
      this.query.roleStatus=true;
      this.queryList();
    },
    provide(){
        return{
            queryList:this.queryList
            // ,queryList2:this.queryList2
        }
    },
    components: {
      'page-save': save,
      'page-edit': edit
    },
    methods: {
      // 添加弹窗
      showsave(){
        this.save1Visible = true;
      },
      showsave2(row){
        this.frow=row;
        this.save2Visible = true;
      },
      showedit(row){
        this.frow=row;
        this.editVisible = true;
      },
      // 关闭所有弹窗
      cancelVisible() {
        this.save1Visible = false;
        this.save2Visible = false;
        this.editVisible = false;
      },
      queryList(){
        if (this.query.roleStatus==null) {
          this.query.roleStatus="";
        }
        let param = "size="+this.pageConf.pageSize+"&current="+this.pageConf.pageCode
        +"&roleName="+this.query.roleName+"&roleStatus="+this.query.roleStatus;
        let that  = this;
        this.$axios.get('/hrs/role/page?'+param).then(function(response){
            that.data1 = response.data.data.records;
            that.pageConf.totalPage=response.data.data.total;
           if (that.data1.length==0) {
              let current=Math.ceil(that.pageConf.totalPage/that.pageConf.pageSize);
              that.queryList2(current);

            }
        }).catch(function (error) {
          console.log(error);
        });
      },
      queryList2(current){
        if (this.query.roleStatus==null) {
          this.query.roleStatus="";
        }
        let param = "size="+this.pageConf.pageSize+"&current="+current
        +"&roleName="+this.query.roleName+"&roleStatus="+this.query.roleStatus;
        let that  = this;
        this.$axios.get('/hrs/role/page?'+param).then(function(response){
            that.data1 = response.data.data.records;
            that.pageConf.totalPage=response.data.data.total;
        }).catch(function (error) {
          console.log(error);
        });
      },
      // queryList2(){
      //   if (this.query.roleStatus==null) {
      //     this.query.roleStatus="";
      //   }
      //   this.pageConf.pageCode=1;
      //   let param = "size="+this.pageConf.pageSize+"&current="+this.pageConf.pageCode
      //   +"&roleName="+this.query.roleName+"&roleStatus="+this.query.roleStatus;
      //   let that  = this;
      //   this.$axios.get('/hrs/role/page?'+param).then(function(response){
      //       that.data1 = response.data.data.records;
      //       that.pageConf.totalPage=response.data.data.total;

      //   }).catch(function (error) {
      //     console.log(error);
      //   });
      // },
      //pageSize改变时触发的函数
      handleSizeChange() {
        this.queryList();
      },
      //当前页改变时触发的函数
      handleCurrentChange() {
        this.queryList();
      },

      format_roleStatus(row, column){
        return row.roleStatus == true ? "生效" : row.roleStatus == false ? "失效" : "";
      },
      test(){
        this.$axios.deletes('/hrs/org/2').then(function(response){
            console.log(response);
        }).catch(function (error) {
          console.log(error);
        });
      }

    }
  }
</script>
<style type="text/css">

  .hrsRole .el-input__icon {
    line-height: 30px !important;
  }

  .hrsRole .el-form-item__content {
    line-height: 30px !important;
  }

  .hrsRole .el-input-group__prepend {
    padding: 0 6px;
  }

</style>

