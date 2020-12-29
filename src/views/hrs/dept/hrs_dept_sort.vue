<template>
  <el-dialog title="部门管理 - 排序" width="75%"
             :visible.sync="visible"
             :close-on-press-escape="false"
             :close-on-click-modal="false"
             :before-close="handleClose">
        <el-form :inline="false" :model="query" label-width="130px" class="demo-ruleForm">
          <el-row>
            <el-form-item class="pull-right">
              <el-button type="primary" size="small" v-on:click="doSort" :disabled="disabledFlag2">排序</el-button>
            </el-form-item>
          </el-row>
          </el-form>
      <el-form>
      <el-table :data="data1" border>
        <el-table-column prop="deptName" label="部门名称" ></el-table-column>

        <el-table-column prop="deptCode3" label="排序号" width="70">
          <template slot-scope="scope2">
            <input v-model="scope2.row.deptCode3" style="width:50px;"></input>
          </template>
        </el-table-column>

        <el-table-column prop="deptCode" label="部门编号" ></el-table-column>

        <el-table-column prop="shortName" label="部门简称"></el-table-column>
        <el-table-column prop="fullName" label="显示名称" ></el-table-column>
        <el-table-column prop="managerName" label="负责人" width="80"></el-table-column>
        <!-- <el-table-column prop="budgetHc" label="预算人数" width="80"></el-table-column> -->
        <el-table-column prop="actualHc" label="实际人数" width="80"></el-table-column>
        <!-- <el-table-column prop="isProfitunit" label="是否利润中心" :formatter="formater1" width="110"></el-table-column> -->
        <!-- <el-table-column prop="isFinalProfitunit" label="末端利润中心" :formatter="formater2" width="110"></el-table-column> -->
        <!-- <el-table-column prop="deptStatus" label="是否生效" :formatter="formatDeptStatus" width="80"></el-table-column>       -->

      </el-table>
   </el-form>
 </el-dialog>
</template>
<script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      frow: Object
    },
        data () {
            return {
              disabledFlag2: false,
              loading: false,
              /*表数据*/
              data1: [],
              query: {
                deptCode: '',
                deptStatus: ''
              }
          }
        },
        mounted(){

        },
        components: {

        },
        inject:['findByPage'],
        methods:{

             findByPage2() {
                if (this.query.deptStatus==null) {
                  this.query.deptStatus="";
                }
                let param = "deptCode="+this.frow.deptCode+"&deptStatus="+this.query.deptStatus;
                this.$axios.get('/hrs/dept/listc?'+param)
                .then(function(response) {
                    this.data1=response.data.data;
                 }.bind(this)
                );
            },
             doSort() {
              // var deptCode3=[];
              // var deptCode=[];
              var deptCode="";
              var deptCode3="";
              let regE =/^[0-9]\d*$/;
              for (var i = 0; i < this.data1.length; i++) {
                // deptCode.push(this.data1[i].deptCode);
                // deptCode3.push(this.data1[i].deptCode2);
                if(!this.data1[i].deptCode3) {
                  this.openError(this.data1[i].deptName+"排序号必填");
                  return;
                }
                if(!regE.test(this.data1[i].deptCode3)) {
                  this.openError(this.data1[i].deptName+"排序号必须是正整数");
                  return;
                }
                if(this.data1[i].deptCode3==0) {
                  this.openError(this.data1[i].deptName+"排序号必须是正整数");
                  return;
                }
                if(this.data1[i].deptCode3.length>3) {
                  this.openError(this.data1[i].deptName+"排序号长度最大为3位");
                  return;
                }
                if(this.data1[i].deptCode3.length<3) {
                  this.data1[i].deptCode3="0"+this.data1[i].deptCode3;
                }
                if(this.data1[i].deptCode3.length<3) {
                  this.data1[i].deptCode3="0"+this.data1[i].deptCode3;
                }
                if(deptCode3.indexOf(this.data1[i].deptCode3)>-1) {
                  this.openError("排序号不能重复");
                  return;
                }
                if (deptCode.length==0) {
                  deptCode=this.data1[i].deptCode;
                }else{
                  deptCode=deptCode+','+this.data1[i].deptCode;
                }
                if (deptCode3.length==0) {
                  deptCode3=this.data1[i].deptCode3;
                }else{
                  deptCode3=deptCode3+','+this.data1[i].deptCode3;
                }
              }
              let params='{"deptCode":"'+deptCode+'","deptCode3":"'+deptCode3+'"}';
              this.disabledFlag2 = true;
                this.$axios.post2('/hrs/dept/sortById', params)
                .then(function(response) {
                  if(response.data.code==0){
                    this.openSuccess();
                    this.findByPage();
                    this.handleClose();
                  }else{
                    this.openError(response.data.messageInfo);
                    this.disabledFlag2 = false;
                  }
                 }.bind(this)
                 ).catch(function (error) {
                    let errorinfo = error.response.data.messageInfo;
                    this.disabledFlag2 = false;
                    //唯一性错误
                    if(errorinfo.indexOf('IDU_hrs_dept_code')>-1)
                      this.openError('失效状态的部门已经包含您输入的排序号');
                    else
                      this.openError(errorinfo);
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
                message: '操作失败，'+info,
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
            // 关闭
            handleClose() {
              this.$emit('update:visible', false);
            },

            formatDeptStatus(row, column){
              return row.deptStatus == true ? "生效" : row.deptStatus == false ? "失效" : "";
            },
            formater1(row, column){
              return row.isProfitunit == true ? "是" : row.isProfitunit == false ? "否" : "";
            }
            ,
            formater2(row, column){
              return row.isFinalProfitunit == true ? "是" : row.isFinalProfitunit == false ? "否" : "";
            }
        },
        created(){
          this.query.deptStatus=true;
            this.findByPage2();
        }
    }
</script>
