<template>
  <el-dialog title="部门管理 - 移动" width="85%"
             :visible.sync="visible"
             :close-on-press-escape="false"
             :close-on-click-modal="false"
             :before-close="handleClose">
  <div>
    <div>

      <el-table
      :data="data1"
      row-key="deptId"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      height="520px"
      >
        <el-table-column  label="操作" width="60" type="index" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" v-on:click="doSelect(scope.row)" v-show="scope.row.deptCode !=frow.deptCode.substring(0,frow.deptCode.length-3) && scope.row.deptCode.indexOf(frow.deptCode)<=-1">移动</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="deptName" label="部门名称" ></el-table-column>
        <!-- <el-table-column prop="deptCode" label="部门编号" ></el-table-column> -->
        <el-table-column prop="shortName" label="部门简称" width="200"></el-table-column>
        <el-table-column prop="fullName" label="部门全称" ></el-table-column>
        <el-table-column prop="managerName" label="负责人" width="80"></el-table-column>
        <!-- <el-table-column prop="budgetHc" label="预算人数" width="80"></el-table-column> -->
        <el-table-column prop="actualHc" label="实际人数" width="80"></el-table-column>
        <!-- <el-table-column prop="isProfitunit" label="是否利润中心" :formatter="formater1" width="110"></el-table-column> -->
        <!-- <el-table-column prop="isFinalProfitunit" label="末端利润中心" :formatter="formater2" width="110"></el-table-column> -->
        <!-- <el-table-column prop="deptStatus" label="是否生效" :formatter="formatDeptStatus" width="80"></el-table-column>       -->
      </el-table>
    </div>

</div>
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
              loading: false,
              /*表数据*/
              data1: [],
              pageConf: {
                  //设置一些初始值(会被覆盖)
                  pageCode: 1, //当前页
                  pageSize: 10, //每页显示的记录数
                  totalPage: 0, //总记录数
                  pageOption: [10, 50, 130], //分页选项
                  handleCurrentChange: function () {
                  console.log("页码改变了");
                }
              },
              query: {
                deptName: '',
                deptCode: '',
                isFinalProfitunit: '',
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
              showsave(){
                this.saveVisible = true;
              } ,
              showedit(row){
                this.frow=row;
                this.editVisible = true;
              } ,
              showSaveChild(row){
                this.frow=row;
                this.saveCVisible = true;
              } ,
             findByPage2() {
                if (this.query.deptStatus==null) {
                  this.query.deptStatus="";
                }
                let param = "size="+this.pageConf.pageSize+"&current="+this.pageConf.pageCode
                +"&deptName="+this.query.deptName+"&deptCode="+this.query.deptCode+"&isFinalProfitunit="+this.query.isFinalProfitunit+"&deptStatus="+this.query.deptStatus;
                this.$axios.get('/hrs/dept/treeinfo?'+param)
                .then(function(response) {
                    this.data1=response.data.data;
                 }.bind(this)
                );
            },
            doSelect(row) {
              let params='{"deptCode":'+row.deptCode+',"budgetHc":'+row.budgetHc+',"isFinalProfitunit":'+row.isFinalProfitunit+',"deptCodeSelect":'+this.frow.deptCode+'}';
                this.$axios.post2('/hrs/dept/moveById', params)
                .then(function(response) {
                  if(response.data.code==0){
                    this.openSuccess();
                    this.findByPage();
                    this.handleClose();
                  }else{
                    this.openError(response.data.messageInfo);
                  }
                 }.bind(this)
                ).catch(function (error) {
                 let errorinfo = error.response.data.messageInfo;
                      //唯一性错误
                        if(errorinfo.indexOf("Data too long for column 'dept_code'")>-1)
                          this.openError('部门层级不能超过5层');
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
            load2(tree, treeNode, resolve) {
//            alert(2);
            },
            expandSelect (row, expandedRows) {
//            alert("expandSelect");
            },
            load(tree, treeNode, resolve) {

              // console.log(tree);
              this.loading = true;
              if (this.query.deptStatus==null) {
                this.query.deptStatus="";
              }
              let param = "deptName="+this.query.deptName+"&deptCode="+tree.deptCode+"&isFinalProfitunit="+this.query.isFinalProfitunit+"&deptStatus="+this.query.deptStatus;
              this.$axios.get('/hrs/dept/listc?'+param)
                .then(function(response) {
                this.loading = true;
                    let datachild=response.data.data;
                    // this.pageConf.totalPage=response.data.data.totalNum;
                    if(datachild.length>0){
                      setTimeout(() => {
                        resolve(datachild)
                      }, 1000)
                    }else{
                      this.$message({
                        message: '该客商资料没有子公司',
                        type: 'warning',
                        duration: 1000
                      });
                    }
                 }.bind(this)
                );


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
            },
            // 关闭
            handleClose() {
              this.$emit('update:visible', false);
            }
        },
        created(){
          this.query.deptStatus=true;
            this.findByPage2();
        }
    }
</script>
