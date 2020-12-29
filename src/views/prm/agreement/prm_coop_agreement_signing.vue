<template>
  <el-dialog title="客户协议 - 签约记录"  width="83%"
     :visible.sync="visible"
     :close-on-press-escape="false"
     :close-on-click-modal="false"
     :before-close="handleClose">
      <div height="500">
      <el-table :data="data1" border>

        <el-table-column prop="coop_name" label="客户名称" width="250"></el-table-column>
        <el-table-column prop="serial_number" label="合同编号" ></el-table-column>
        <el-table-column prop="pre_serial_number" label="原合同编号" width="90"></el-table-column>

        <el-table-column prop="begin_date" label="开始时间" width="90"></el-table-column>
        <el-table-column prop="end_date" label="结束时间" width="90"></el-table-column>
        <el-table-column prop="pre_begin_date" label="原开始时间" width="90"></el-table-column>
        <el-table-column prop="pre_end_date" label="原结束时间" width="90"></el-table-column>

        <el-table-column prop="incharge_name" label="经办人" ></el-table-column>
        <el-table-column prop="pre_incharge_name" label="原经办人" ></el-table-column>
        <el-table-column prop="payment_period" label="合同账期" ></el-table-column>
        <el-table-column prop="pre_payment_period" label="原合同账期" width="90"></el-table-column>
        <el-table-column prop="total_amount" label="合同额度" ></el-table-column>
        <el-table-column prop="pre_total_amount" label="原合同额度" width="90"></el-table-column>
        <el-table-column prop="signing_type" label="签署类型" width="80"></el-table-column>

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

              /*表数据*/
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
                op_level: '',
                op_name: '',
                creator_name: '',
                create_time_begin: '',
                create_time_end: '',
                org_id: '',
                dept_id: ''
              }
          }
        },
        mounted(){

        },
        methods:{
             findByPage() {
                let params={
                  'currentPage': this.pageConf.pageCode,
                  'pageSize': this.pageConf.pageSize,
                  'agreement_id':this.frow.agreement_id,
                  'org_id':this.query.org_id
                }
                this.$axios.post('/prm/coopagreement/querySigningList',params)
                .then(function(response) {
                    this.data1=response.data.data.dataList;
                    this.pageConf.totalPage=response.data.data.totalNum;
                 }.bind(this)
                );
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
          }
        },
        created(){
          this.findByPage();
        }
    }
</script>
