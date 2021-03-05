<template>
  <el-dialog title="分发 - 权限" width="75%" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
    <div class="warp-main hrs-permission-allocation">
      <el-row v-loading="loading" :element-loading-text="loadingText">
        <el-col class="toolbar" style="padding-bottom: 0;">
          <el-form :inline="false" :model="query" class="demo-ruleForm">
            <el-row>
              <el-col class="elementWidth" style="margin-left: 10px">
                <el-form-item>
                  <el-input style="width: 200px">
                    <template slot="prepend">版本类型</template>
                    <el-select slot="suffix" v-model="query.versionType" placeholder="" clearable style="width: 103px; margin-right: -5px">
                      <el-option v-for="item in versionType" :key="item.orgId" :label="item.orgName" :value="item.orgId"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth" style="margin-left: 10px">
                <el-form-item>
                  <el-input v-model="query.name" auto-complete="off" clearable clearable style="width: 250px;">
                    <template slot="prepend">公司名称</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth" style="margin-left: 10px">
                <el-form-item>
                  <el-input style="width: 196px">
                    <template slot="prepend">账户类型</template>
                    <el-select slot="suffix" v-model="query.accountType" placeholder="" clearable style="width: 100px; margin-right: -5px">
                      <el-option v-for="item in accountType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label-width="10px">
                  <el-input style="width:238px;">
                    <template slot="prepend">创建日期</template>
                    <el-date-picker slot="suffix" v-model="query.cTimeStart" clearable type="date" value-format="yyyy-MM-dd" placeholder="开始" style="width: 141px;margin-right: -5px;">
                    </el-date-picker>
                  </el-input>
                  <span style="position:relative; top:-5px">-</span>
                  <el-date-picker v-model="query.cTimeEnd" clearable type="date" value-format="yyyy-MM-dd" placeholder="结束" style="width: 135px;top:-5px">
                  </el-date-picker>
                </el-form-item>
              </el-col>

              <el-col class="elementWidth">
                <el-form-item style="margin-left: 41px; margin-top: -6px">
                  <el-button type="primary" size="small" @click="clickQuery">查询</el-button>
                  <el-button type="primary" size="small" @click="confirmAllocation">分发确认</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-table v-loading="loading" :data="data" border @selection-change="handleSelectionChange" >
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column align="center" prop="accountType" width="100" label="账户类型"></el-table-column>
          <el-table-column align="center" prop="orgCode" width="120" label="企业编码"></el-table-column>
          <el-table-column prop="orgName" label="签约公司名称"></el-table-column>
          <el-table-column  align="center" prop="versionType" width="200" label="版本类型"></el-table-column>
          <el-table-column  align="center" prop="createTime" width="180" label="创建日期"></el-table-column>
          <el-table-column  align="center" prop="stopTime" width="180" label="失效日期"></el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
          </el-pagination>
        </div>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
    export default {
      name: "hrs_permission_allocation",
      props: {
        visible: {
          type: Boolean,
          default: false
        },
        frow: Object
      },
      data(){
        return {
          data: [],
          versionType: [],
          versionTypeDIC: {},
          accountType:[{code: 1, label: '公司', value: 1 }, { code: 2, label: '个人', value: 2 }],
          accountTypeDIC: {},
          pageConf: {
            //设置一些初始值(会被覆盖)
            pageCode: 1, //当前页
            pageSize: 10, //每页显示的记录数
            totalPage: 0, //总记录数
            pageOption: [10, 30, 50, 500] //分页选项
          },
          query: {
            permissionId: '',
            versionType: '',
            name: '',
            accountType: '',
            cTimeStart: '',
            cTimeEnd: '',
          },
          loading: false,
          loadingText: '拼命加载中',
          multipleSelection: [],
          selectionIds: [],
        }
      },
      methods: {
        getRequestParam(){
          this.query['seize'] = this.pageConf.pageSize;
          this.query['current'] = this.pageConf.pageCode;

          let params = {};
          for (let queryKey in this.query) {
            let value = this.query[queryKey];
            if(value){
              params[queryKey] = value;
            }
          }
          return params;
        },
        clickQuery(){
          this.pageConf.pageCode = 1;
          this.findByPage();
        },
        findByPage(){
          this.startQueryLoading();
          let param = this.getRequestParam();

          this.$axios.get2('/hrs/org-permission/neOrg', param)
          .then(function(response){
            this.stopLoading();
            if(response.data.code == 0){
              let data = response.data.data.records, that = this;
              //类型转换
              data.forEach(function(item){
                item['accountType'] = that.accountTypeDIC[item['accountType']] || "";
                item['versionType'] = that.versionTypeDIC[item['versionType']] || '';
              })
              this.data = data;
              this.pageConf.totalPage = response.data.data.total;
            }else{
              this.openError("数据加载失败");
            }
          }.bind(this))
          .catch(function(){
            this.stopLoading();
          }.bind(this))
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
        //pageSize改变时触发的函数
        handleSizeChange() {
          this.findByPage();
        },
        //当前页改变时触发的函数
        handleCurrentChange() {
          this.findByPage();
        },
        //加载版本类型
        loadVersionType(){
          this.$axios.get('/hrs/org/queryModelOrg')
            .then(function(response) {
              this.versionType = response.data.data;
              this.versionType.forEach((item)=>{
                this.versionTypeDIC[item['orgId']] = item['orgName'];
              })
            }.bind(this));
        },
        handleClose() {
          this.$emit('update:visible', false);
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
          this.selectionIds = [];
          val.forEach((row) => {
            this.selectionIds.push(row.orgId)
          })
        },
        confirmAllocation(){
          if(this.multipleSelection.length == 0){
            this.$message.error('请选择要操作的记录');
            return;
          }

          let message = '是否确认分发 “'+this.frow['name']+'”权限？';
          this.$confirm(message, '注意', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            //分发权限
            this.startOptLoading();
            this.$axios.post2("/hrs/org-permission/save/"+this.query.permissionId, this.selectionIds)
              .then(function (response) {
                if(response.data.code == 0){
                  this.stopLoading();
                  this.openSuccess();
                  this.clickQuery();
                }else{
                  this.openError("分发权限失败");
                }
              }.bind(this))
              .catch(function(error){
                this.stopLoading();
              }.bind(this));

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '分发权限已取消'
            });
          });
        },
        startQueryLoading(){
          this.loading = true;
          this.loadingText =  '拼命加载中';
        },
        startOptLoading(){
          this.loading = true;
          this.loadingText =  '拼命分发中';
        },
        stopLoading(){
          this.loading = false;
        }
      },
      created() {
        this.query.permissionId = this.frow['id'];
        this.loadVersionType();
        this.accountType.forEach((item)=>{
          this.accountTypeDIC[item['value']] = item.label;
        })
      },
      mounted() {
        this.findByPage();
      }

    }
</script>

<style type="text/css">
  .hrs-permission-allocation .el-input__icon{
    line-height: 30px !important;
  }
</style>
