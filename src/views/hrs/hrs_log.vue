<template>
  <div class="warp-main">
    <el-row v-loading="loading" element-loading-text="拼命加载中">
      <el-col class="toolbar" style="padding-bottom: 0;">
        <el-form :model="query" class="hrsLog-ruleForm">
       <!--   <el-row>
            <el-form-item class="pull-right">
             &lt;!&ndash; <el-button type="text" size="medium" v-show=showFlag v-on:click="showFlag=false">收起</el-button>
              <el-button type="text" size="medium" v-show=!showFlag v-on:click="showFlag=true">展开</el-button>&ndash;&gt;
              <el-button type="primary" size="medium" v-on:click="findByPage">查询</el-button>
            </el-form-item>
          </el-row>-->
          <el-row v-show=showFlag>
              <el-col class="elementWidth">
                <el-form-item label-width="10px">
                  <el-input style="width:160px;">
                    <template slot="prepend">日志等级</template>
                    <el-select slot="suffix" v-model="query.opLevel" placeholder="请选择" style="width:91px;margin-right: -5px;" clearable>
                      <el-option label="全部" value=""></el-option>
                      <el-option label="高" value="高"></el-option>
                      <el-option label="中" value="中"></el-option>
                      <el-option label="低" value="低"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label-width="10px">
                  <el-input v-model="query.opName" auto-complete="off" style="width: 200px;" clearable>
                    <template slot="prepend">操作页面</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label-width="10px">
                  <el-input v-model="query.creatorName" auto-complete="off" style="width: 180px;" clearable>
                    <template slot="prepend">操作人</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label-width="15px">
                  <el-input style="width:215px;">
                    <template slot="prepend">
                      <span>操作时间</span>
                    </template>
                    <el-date-picker slot="suffix" style="width: 146px;margin-right: -5px;" v-model="query.createTimeBegin" clearable type="date" value-format="yyyy-MM-dd 00:00:00"
                                    placeholder="开始时间">
                    </el-date-picker>
                  </el-input>
                  &nbsp;&nbsp;&nbsp;-
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label-width="15px">
                  <el-input style="width:146px;">
                    <el-date-picker slot="suffix" style="width: 146px;margin-right: -5px;" v-model="query.createTimeEnd" clearable type="date" value-format="yyyy-MM-dd 00:00:00"
                                    placeholder="结束时间">
                    </el-date-picker>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item style="margin-left: 31px;">
                  <el-button type="primary" size="small" v-on:click="findByPage">查询</el-button>
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
                <span>{{ props.row.opInfo }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="opLevel" label="日志等级" width="100" sortable></el-table-column>
        <el-table-column prop="opType" label="页面功能" width="150"></el-table-column>
        <el-table-column prop="opName" label="操作页面" width="160"></el-table-column>
        <el-table-column prop="opInfo" label="详细内容" v-if="false"></el-table-column>
        <el-table-column prop="creatorName" label="操作人" width="300"></el-table-column>
        <el-table-column prop="createTime" label="操作时间" width="145"></el-table-column>
        <el-table-column></el-table-column>


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
              showFlag:true,
              data1: [],
              loading: false,
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
                opLevel: '',
                opName: '',
                creatorName: '',
                createTimeBegin: '',
                createTimeEnd: ''
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
              this.$axios.get2("/hrs/log/getLogList?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this.query)
                .then(function(response) {
                  this.data1 = response.data.data.records;
                  this.pageConf.totalPage = response.data.data.total;
                  if (this.data1.length==0) {
                    let current=Math.ceil(this.pageConf.totalPage/this.pageConf.pageSize);
                    this.findByPage2(current);
                  }
                }.bind(this));
            },
            findByPage2(current) {
              this.$axios.get2("/hrs/log/getLogList?size=" + this.pageConf.pageSize + "&current=" + current,
               this.query)
                .then(function(response) {
                  this.data1 = response.data.data.records;
                  this.pageConf.totalPage = response.data.data.total;
                }.bind(this));
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
<style type="text/css">

  .hrsLog-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .hrsLog-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .hrsLog-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }

</style>
