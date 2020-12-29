<template>
  <div class="warp-main">
    <el-row :span="24" v-loading="loading" element-loading-text="拼命加载中">
      <el-col :span="24" class="toolbar" style="padding-bottom: 0;">
        <el-form :inline="false" :model="query" label-width="120px" class="demo-ruleForm">
          <el-row>
            <el-form-item class="pull-right">
              <el-button type="text" size="medium" v-show=showFlag v-on:click="showFlag=false">收起</el-button>
              <el-button type="text" size="medium" v-show=!showFlag v-on:click="showFlag=true">展开</el-button>
              <el-button type="primary" size="medium" v-on:click="findByPage">查询</el-button>
            </el-form-item>
          </el-row>
          <el-row v-show=showFlag>
              <el-col :span="4">
                <el-form-item label="日志等级">
                <!-- <el-input v-model="query.op_level" auto-complete="off" clearable>
                </el-input> -->
                 <el-select v-model="query.op_level" clearable placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="高" value="高"></el-option>
                    <el-option label="中" value="中"></el-option>
                    <el-option label="低" value="低"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="操作页面">
                <el-input v-model="query.op_name" auto-complete="off" clearable>
                </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="操作人">
                <el-input v-model="query.creator_name" auto-complete="off" clearable>
                </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="操作时间">
                <el-date-picker v-model="query.create_time_begin"  type="date" value-format="yyyy-MM-dd" placeholder="选择开始时间">
                </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="到">
                <el-date-picker v-model="query.create_time_end"  type="date" value-format="yyyy-MM-dd" placeholder="选择结束时间">
                </el-date-picker>
                </el-form-item>
              </el-col>
          </el-row>
          </el-form>
      </el-col>
      <el-table :data="data1" border>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="详细内容 :">
                <span>{{ props.row.op_info }}</span>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="log_id" label="编号" width="180" ></el-table-column>
        <el-table-column prop="op_level" label="日志等级" width="180" sortable></el-table-column>
        <el-table-column prop="op_type" label="页面功能" width="180"></el-table-column>
        <el-table-column prop="op_name" label="操作页面" ></el-table-column>
        <el-table-column prop="op_info" label="详细内容" v-if="false"></el-table-column>
        <el-table-column prop="creator_name" label="操作人" ></el-table-column>
        <el-table-column prop="create_time" label="操作时间" width="280"></el-table-column>

        <!-- <el-table-column  label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" size="small">查看</el-button>
          </template>
        </el-table-column> -->
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
    </el-row>

   </div>
</template>
<script>
  export default {
        data () {
            return {


              /*表数据*/
              showFlag:false,
              data1: [],
              loading: false,
              pageConf: {
                  //设置一些初始值(会被覆盖)
                  pageCode: 1, //当前页
                  pageSize: 10, //每页显示的记录数
                  totalPage: 0, //总记录数
                  pageOption: [10, 50, 100], //分页选项
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
        /*
          this.$http.post('http://localhost:8888/test4444/group/queryForPageList', this.$qs.stringify({

                  name: "小"
                 }))
                 .then(function(response) {
                    alert(response.data.data[0].login_name);
                    this.data1=response.data.data;
                    this.total=response.data.totalCount;
                    alert(response.data.totalCount);
                 }.bind(this))
                 .catch(function(error) {
                 alert(2);
                  console.log(error);
                 });
          */
        },
        methods:{
             findByPage() {
                let params={
                  'currentPage': this.pageConf.pageCode,
                  'pageSize': this.pageConf.pageSize,
                  'op_level':this.query.op_level,
                  'op_name':this.query.op_name,
                  'creator_name':this.query.creator_name,
                  'create_time_begin':this.query.create_time_begin,
                  'create_time_end':this.query.create_time_end,
                  'org_id':this.query.org_id
                }
                this.$axios.post('/prm/log/queryList', params
                //  ,
                //  {
                //     headers: {
                //       'Content-Type': 'application/x-www-form-urlencoded'
                //     }
                // }
                )
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
            }
        },
        created(){
            this.findByPage();
        }
    }
</script>
