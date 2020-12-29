<template>
  <div class="warp-main">
    <div class="shipper-consignee">
      <el-col  class="toolbar" style="padding-bottom: 0;">
      <el-form :inline="true" :model="query" class="demo-ruleForm">
        <el-row>
          <el-col class="elementWidth">
            <el-form-item label-width="100px">
              <el-input v-model="query.coopName" clearable auto-complete="off" style="width: 250px;" @change="query.coopName=strTrim(query.coopName).toUpperCase()">
                <template slot="prepend">代码/名称</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item>
              <el-input style="width: 190px">
                <template slot="prepend">是否绑定</template>
                <el-select slot="suffix" v-model="query.isBind" placeholder="请选择" style="width: 100px; margin-right: -5px">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item>
              <el-input style="width: 190px">
                <template slot="prepend">协作公司</template>
                <el-select slot="suffix" v-model="query.isShare" placeholder="请选择" style="width: 100px; margin-right: -5px">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
                <el-button type="text" size="medium" v-if=showFlag v-on:click="showFlag=false">收起</el-button>
                <el-button type="text" size="medium" v-if=!showFlag v-on:click="showFlag=true">展开</el-button>
                <el-button type="primary" size="small"  @click="queryList" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="showFlag">
         <el-col class="elementWidth">
           <el-form-item label-width="10px">
             <el-input style="width:967px;">
               <template slot="prepend">客商资料分类</template>
               <el-checkbox slot="suffix" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" style="float:left;margin-top: 5px;">全选</el-checkbox>
               <el-checkbox-group slot="suffix" v-model="checkedcoopType" @change="handleCheckedCitiesChange" style="float:left;margin-top: 5px;">
                 <el-checkbox v-for="coop_type in coop_types" :label="coop_type" :key="coop_type">{{coop_type}}</el-checkbox>
               </el-checkbox-group>
             </el-input>
           </el-form-item>
         </el-col>
        </el-row>
      </el-form>
      </el-col>
    </div>
    <div>
      <el-table :data="data" v-loading="loading" border >
        <el-table-column fixed="left" align="center" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
              <i class="el-icon-s-operation"></i>
              <el-dropdown-menu slot="dropdown">
              	<el-dropdown-item></el-dropdown-item>
                <el-dropdown-item command="setShare" >设置为协作公司</el-dropdown-item>
                <el-dropdown-item command="stopShare" >停止协作</el-dropdown-item>
                <el-dropdown-item command="bind">绑定</el-dropdown-item>
                <el-dropdown-item command="shareBind">分享订阅设定</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
         <el-table-column prop="coopCode" label="客商资料代码" width="100"></el-table-column>
         <el-table-column prop="coopName" label="中文全称" width="200"></el-table-column>
          <el-table-column prop="isShare" label="协作公司" width="70" align="center">
            <template slot-scope="scope">
              <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.isShare==1"></i>
            </template>
          </el-table-column>
          <el-table-column  prop="coopOrgId" label="是否绑定" width="70" align="center">
            <template slot-scope="scope">
              <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.coopOrgId!=null"></i>
            </template>
          </el-table-column>
          <el-table-column prop="orgName" label="绑定公司" width="200"></el-table-column>
          <el-table-column></el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
      </el-pagination>
    </div>
    <bindVisibleTag ref="addMission" v-if="bindVisible" :visible.sync="bindVisible" :frow="frow"></bindVisibleTag>
    <shareVisibleTag ref="addMission" v-if="shareVisible" :visible.sync="shareVisible" :frow="frow"></shareVisibleTag>
  </div>
</template>
<script>
    import bind from './coopshare/bind.vue'
    import shareFields from './coopshare/share_fields.vue'
    const cooptypes = [
    	'外部客户',
    	'互为代理',
    /*	'海外代理',*/
    	'干线承运人',
    	'延伸服务供应商',
    	'业务类结算对象',
    	'非业务结算对象'
    ];
    export default {
        data() {
            return {
                loading: false,
                showFlag:false,
                data: [],
                checkedcoopType: [],
                checkAll:false,
                isIndeterminate:false,
                coop_types: cooptypes,
                pageConf: {
                    //设置一些初始值(会被覆盖)
                    pageCode: 1, //当前页
                    pageSize: 10, //每页显示的记录数
                    totalPage: 0, //总记录数
                    pageOption: [10, 30, 50]
                },
                shareVisible:false,
                bindVisible: false,
                frow: {},
                query: {
                    isBind: '',
                    isShare: '',
                    coopName: '',
                    coopType: ''
                },
                currRow: ''
            }
        },
        created: function() {
            			this.queryList();
            if(this.editButtonFlag == false && this.viewButtonFlag == false && this.cancelButtonFlag == false){
                this.isShow = false
            }
        },
        provide() {
            return {
                queryList: this.queryList
            }
        },
        components: {
            'bindVisibleTag': bind,
            'shareVisibleTag':shareFields
        },
        methods: {
            toUpperCaseValue(val) {
              return val.toUpperCase();
            },

            handleCommand(command) {
                if(command == 'setShare') {
                    this.setShare(this.currRow)
                } else if(command == 'stopShare') {
                    this.stopShare(this.currRow)
                } else if(command == 'bind') {
                    this.bind(this.currRow)
                }else if(command == 'shareBind'){
                   this.shareBind(this.currRow)
                }
            },
            handleChange(command) {
                this.currRow = command
            },
            setShare(row) {
                this.$confirm('是否设置为协作公司?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    this.$axios.put('/prm/coopShare/share/' + row.coopId+'/1').then((response) => {
                        if(response.data.code == '0') {
                            this.openSuccess("设置成功！")
                            this.queryList();
                        } else {
                            this.openError("设置失败：" + response.data.data.messageInfo)
                        }
                    }).catch((error) => {
                        this.openError("设置失败：" + error.response.data.messageInfo)
                    });
                }).catch(() => {

                });

            },
            stopShare(row) {
                this.$confirm('是否停止协作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    this.$axios.put('/prm/coopShare/share/' + row.coopId+'/0').then((response) => {
                        if(response.data.code == '0') {
                            this.openSuccess("停止成功！")
                            this.queryList();
                        } else {
                            this.openError("停止失败：" + response.data.data.messageInfo)
                        }
                    }).catch((error) => {
                        this.openError("停止失败：" + error.response.data.messageInfo)
                    });
                }).catch(() => {

                })
            },
          bind(row){
              // 绑定校验
              if(row.isShare!=1){
                 this.openError("操作失败：如要绑定,请先将当前客商资料设置为协作公司");
                 return false;
              }
              this.$axios.get('/prm/coopShare/coopShareInfo/'+row.orgId+'/'+ row.coopId).then((response) => {
                  if(response.data.data){
                      if(response.data.data.coopOrgId){
                        this.openError("操作失败：当前客商资料已被绑定");
                        this.queryList();
                      }else{
                        this.frow = row;
                        this.bindVisible = true;
                      }
                  }else{
                    this.openError("当前客商资料异常，请联系管理员");
                  }
              }).catch((error) => {
                  console.log(error);
              });
              // if(row.coopOrgId){
              //    this.openError("操作失败：当前客商资料已被绑定");
              //    return false;
              // }
          },
          shareBind(row){
            this.frow = row;
            this.frow.businessScope = 'AE';
            this.shareVisible = true;
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
               if(this.checkedcoopType.length>0){
                  this.query.coopType = this.checkedcoopType.toString();
               }
                this.loading = true
                this.$axios.get2('/prm/coopShare/page?size=' + this.pageConf.pageSize + '&current=' + this.pageConf.pageCode, this.query).then((response) => {
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
            },
            queryList2(current) {
                this.$axios.get2('/prm/coopShare/page?size=' + this.pageConf.pageSize + '&current=' + current, this.query).then((response) => {
                    this.data = response.data.data.records;
                    this.pageConf.totalPage = response.data.data.total;
                    this.loading = false
                }).catch(function(error) {
                    this.loading = false
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
            handleCheckAllChange(val) {
                this.checkedcoopType = val ? cooptypes : [];
                this.isIndeterminate = false;
            },

            handleCheckedCitiesChange(value) {
              let checkedCount = value.length;
              this.checkAll = checkedCount === this.coop_types.length;
              this.isIndeterminate = checkedCount > 0 && checkedCount < this.coop_types.length;
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
