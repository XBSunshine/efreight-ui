<template>
	<div class="warp-main">
		<el-row v-loading="loading" element-loading-text="拼命加载中">
			<el-col class="toolbar" style="padding-bottom: 0;">
				<el-form :inline="false" :model="query" class="demo-ruleForm">
					<div>
						<el-row>
							<el-col class="elementWidth">
								<el-form-item label="创建日期" label-width="85px">
									<el-date-picker style="width: 135px" v-model="query.createTimeStart" type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="起始日期">
									</el-date-picker>
									<span>-</span>
									<el-date-picker style="width: 135px" v-model="query.createTimeEnd" type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="截至日期">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item label="是否失效" label-width="80px">
									<el-select v-model="query.isStatus" placeholder="" style="width: 80px;">
										<el-option v-for="item in isStatuss" :key="item.value" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
              <el-col class="elementWidth">
              	<el-form-item label="版本类型" label-width="80px">
              		<el-select v-model="query.orgEditionId"  clearable placeholder="" style="width: 105px;">
              			<el-option v-for="item in orgEditions" :key="item.orgId" :label="item.orgName" :value="item.orgId">
              			</el-option>
              		</el-select>
              	</el-form-item>
              </el-col>
							<el-col class="elementWidth">
								<el-form-item label="需求人" label-width="80px">
									<el-select v-model="query.demandPersonId" clearable placeholder="" style="width: 105px;">
											<el-option v-for="item in useroptions" :key="item.id" :label="item.name" :value="item.id">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item style="margin-left: 38px;">
								<!-- 	<el-button type="text" size="medium" v-if=showFlag v-on:click="showFlag=false">收起</el-button>
									<el-button type="text" size="medium" v-if=!showFlag v-on:click="showFlag=true">展开</el-button> -->
									<el-button type="primary" size="small" v-on:click="querySettleList">查询</el-button>
									<el-button type="primary" size="small" @click="exportExcel">导出</el-button>
								</el-form-item>
							</el-col>
						</el-row>
            <el-row>
              <el-col class="elementWidth">
                <el-form-item label="公司名称" label-width="85px">
                  <el-input v-model="query.orgName" auto-complete="off" style="width: 280px;">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label="账户类型" label-width="80px">
                  <el-select v-model="query.orgType" placeholder="" clearable style="width: 80px;">
                  	<el-option v-for="item in orgTypes" :key="item.value" :label="item.label" :value="item.value">
                  	</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label="意向用户" label-width="80px">
                  <el-select v-model="query.intendedUser" placeholder="" clearable style="width: 80px;">
                  	<el-option v-for="item in intendedUsers" :key="item.value" :label="item.label" :value="item.value">
                  	</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
					</div>
				</el-form>
			</el-col>
			<el-table :indent="8" :data="data1"  class="table_settle" highlight-current-row  stripe border max-height="700px">

         <el-table-column align="left" prop="orgType" label="账户类型" width="80">
					<template slot-scope="scope">
						<span>{{orgTypeStr(scope.row.orgType)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="left" prop="orgCode" label="企业编码" width="150">
					<template slot-scope="scope">
						<span>{{scope.row.orgCode}}</span>
					</template>
				</el-table-column>
        <el-table-column align="left" prop="orgName" label="签约公司名称" width="350">
        	<template slot-scope="scope">
        		<span>{{scope.row.orgName}}</span>
        	</template>
        </el-table-column>
				<!-- <el-table-column header-align="left" prop="oneStopCode" label="一站式平台代码" width="120" >
					<template slot-scope="scope">
						<span>{{scope.row.oneStopCode}}</span>
					</template>
				</el-table-column> -->
        <el-table-column align="center" prop="isIntendedUser" label="意向用户" width="70">
        	<template slot-scope="scope">
        		<span v-if="checkFlagUser(scope.row)"><i class="iconfont el-icon-myduihao" style="color: red;"></i></span>
        		<span v-else></span>
        	</template>
        </el-table-column>
				<el-table-column align="left" prop="demandPersonName" label="需求人" width="80">
					<template slot-scope="scope">
						<span>{{scope.row.demandPersonName}}</span>
					</template>
				</el-table-column>
        <el-table-column align="center" prop="orgEditionName" label="版本类型" width="120" >
        	<template slot-scope="scope">
        		<span >{{scope.row.orgEditionName}}</span>
        	</template>
        </el-table-column>
        <el-table-column align="center" prop="userCount" label="用户限制" width="70" >
        	<template slot-scope="scope">
        		<span >{{scope.row.userCount}}</span>
        	</template>
        </el-table-column>
				<el-table-column align="left" prop="createTime" label="创建日期" width="150" >
					<template slot-scope="scope">
						<span >{{scope.row.createTime}}</span>
					</template>
				</el-table-column>
				<el-table-column align="left" prop="stopDate" label="失效日期" width="150" >
					<template slot-scope="scope">
						<span >{{scope.row.stopDate}}</span>
					</template>
				</el-table-column>
        <el-table-column align="center"  label="是否失效" width="70" >
        	<template slot-scope="scope">
        		<span v-if="checkFlagStatus(scope.row)"><i class="iconfont el-icon-myduihao" style="color: red;"></i></span>
        	  <span v-else></span>
          </template>
        </el-table-column>
				<el-table-column align="center" prop="orgUserCount" label="用户数量" width="80" >
					<template slot-scope="scope">
						<span >{{scope.row.orgUserCount}}</span>
					</template>
				</el-table-column>

				<el-table-column align="center" prop="orgCoopCount" label="客商数量" min-width="90">
					<template slot-scope="scope">
						<span>{{scope.row.orgCoopCount}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="orgOrderCount" label="订单数量" width="70" >
					<template slot-scope="scope">
						<span >{{scope.row.orgOrderCount}}</span>
					</template>
				</el-table-column>
        <el-table-column align="center" prop="" label="订单日期" width="100" >
        	<template slot-scope="scope">
        		<span >{{orderDate(scope.row)}}</span>
        	</template>
        </el-table-column>
        <el-table-column align="center" prop="subscriptionNum" label="订阅数量" width="70" >
          <template slot-scope="scope">
            <span >{{scope.row.subscriptionNum}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="" label="订阅日期" width="100" >
          <template slot-scope="scope">
            <span >{{paseDate(scope.row)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="orgFromRemark" label="注册来源" width="220" >
          <template slot-scope="scope">
            <span >{{scope.row.orgFromRemark}}</span>
          </template>
        </el-table-column>
				<el-table-column align="left" prop="adminName" label="管理员账户" width="150">
					<template slot-scope="scope">
						<span >{{scope.row.adminName}}</span>
					</template>
				</el-table-column>
				<el-table-column align="left" prop="adminEmail" label="管理员邮箱" width="180">
					<template slot-scope="scope">
						<span >{{scope.row.adminEmail}}</span>
					</template>
				</el-table-column>
				<el-table-column align="left" prop="adminTel" label="管理员电话" width="220" >
					<template slot-scope="scope">
						<span >{{scope.row.adminInternationalCountryCode}} {{scope.row.adminTel}}</span>
					</template>
				</el-table-column>
				<!-- <el-table-column align="center" prop="rcEmail" label="风控邮箱" width="150" >
					<template slot-scope="scope">
						<span >{{scope.row.rcEmail}}</span>
					</template>
				</el-table-column> -->
				<el-table-column align="center" prop="orgRemark" label="备注信息" width="300">
					<template slot-scope="scope">
						<span >{{scope.row.orgRemark}}</span>
					</template>
				</el-table-column>
			</el-table>
			<el-row>
				<el-col :span="10">

				</el-col>
			</el-row>

			<el-col :span="24" class="pagination">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
				</el-pagination>
			</el-col>
		</el-row>

	</div>
</template>
<script>
	export default {
		data() {
			return {
				loading: false,
				showFlag: false,
        useroptions:[],
        orgEditions:[],
				isStatuss: [{
						code: '1',
						label: '全部',
						value: ""
					},
					{
						code: '2',
						label: '有效',
						value: "1"
					},
					{
						code: '3',
						label: '失效',
						value: "0"
					}
				],
        orgTypes:[{
          code: 1,
          label: '公司',
          value: "1"
        },
        {
          code: 2,
          label: '个人',
          value: "2"
        }
        ],
        intendedUsers:[{
          code: 0,
          label: '全部',
          value: "0"
        },{
          code: 1,
          label: '是',
          value: "1"
        }],
				data1: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 30, 50], //分页选项
					handleCurrentChange: function() {
						console.log("页码改变了");
					}
				},
				query: {
          isStatus:"1",
          demandPersonId:"",
          orgEditionId:"",
          createTimeEnd:"",
          createTimeStart:"",
          orgType:"",
          orgName:"",
          intendedUser:""
				},
			}
		},
		created: function() {
			this.query.createTimeStart = this.getDateTime2(new Date());
      //ef 公司 有效员工
      this.$axios.get('/hrs/user/searchUserByOrg')
          .then(function(response) {
              this.useroptions = response.data.data;
              // console.log(response.data.data);
          }.bind(this));
			this.loadPermission(this.permission);

      this.$axios.get('/hrs/org/queryModelOrg')
      	.then(function(response) {
      		this.orgEditions = response.data.data;
      	}.bind(this));
		},

		methods: {
      orgTypeStr(str){
        if(str==1){
          return "公司";
        }
        if(str==2){
          return "个人";
        }
        return "";
      },
      //订单时间
      orderDate(row){
        let timeAfFlag = false;
        let timeScFlag = false;
        let timeAf = null;
        let timeSc= null;
        if(row.createTimeAf){
          timeAfFlag = true;
          timeAf = Date.parse(row.createTimeAf);
        }
        if(row.createTimeSc){
          timeScFlag = true;
          timeSc = Date.parse(row.createTimeSc);
        }
        if(timeAfFlag&&timeScFlag){
           if(timeAf>timeSc){
              return row.createTimeAf;
           }else{
              return row.createTimeSc;
           }
        }
        if(timeAfFlag&&!timeScFlag){
           return row.createTimeAf;
        }
        if(!timeAfFlag&&timeScFlag){
          return row.createTimeSc;
        }
        if(!timeAfFlag&&!timeScFlag){
          return "";
        }
      },
      paseDate(row){
          if(row.subscriptionTime){
              return row.subscriptionTime.substring(0,10);
          }
      },
      //是否失效
      checkFlagStatus(row){
        if(row.orgStatus>0&& new Date()<Date.parse(row.stopDate)){
           return false;
        }else{
           return true;
        }
      },
      //是否是意向客户
      checkFlagUser(row){
        let flagUser = true;
        if((row.intendedUser == null || row.intendedUser == '') && row.intendedUser !== 0){
            row.intendedUser = -1;
        }
        if(row.orgEditionName.indexOf('内部')>0||row.orgEditionName=='标准版' || row.orgEditionName=='专业版'){
           flagUser = false;
        }
        if((row.orgOrderCount>0||row.orgCoopCount>2 || row.intendedUser == 1 || row.subscriptionNum > 0) && row.intendedUser !== 0 && flagUser){
          return true;
        }else{
          return false;
        }
      },
			querySettleList() {
        let param = "size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode;
        let that = this;
        this.$axios.get2('/hrs/org/could/user?'+param,that.query).then(function(response) {
        	// console.log(response);
        	that.data1 = response.data.data.records;
        	that.pageConf.totalPage = response.data.data.total;
        	if (that.data1.length==0) {
        			let current=Math.ceil(that.pageConf.totalPage/that.pageConf.pageSize);
        			that.queryList2(current);
        		}
        }).catch(function(error) {
        	console.log(error);
        });
			},
      queryList2(current) {
      	let param = "size=" + this.pageConf.pageSize + "&current=" + current;
      	let that = this;
      	this.$axios.get2('/hrs/org/could/user?' + param,that.query).then(function(response) {
      		// console.log(response);
      		that.data1 = response.data.data.records;
      		that.pageConf.totalPage = response.data.data.total;
      	}).catch(function(error) {
      		console.log(error);
      	});

      },
      exportExcel(){
        if (this.data1 && this.data1.length > 0) {
          this.$axios.post3('/hrs/org/could/exportExcel', this.query)
            .then((response) => {
              // console.log(response);
              var blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
              });
              var downloadElement = document.createElement('a');
              var href = window.URL.createObjectURL(blob); // 创建下载的链接
              downloadElement.href = href;
              downloadElement.download = '云用户统计' + '.xls'; // 下载后文件名
              document.body.appendChild(downloadElement);
              downloadElement.click(); // 点击下载
              document.body.removeChild(downloadElement); // 下载完成移除元素
              window.URL.revokeObjectURL(href); // 释放掉blob对象
            }).catch(err => {
              let errorinfo = error.response.data.messageInfo;
              this.openError(errorinfo);
            })
        } else {
          this.openError("请先搜索是否有数据，在进行导出");
        }
      },
			//pageSize改变时触发的函数
			handleSizeChange() {
				this.querySettleList();
			},
			//当前页改变时触发的函数
			handleCurrentChange(val) {
				this.querySettleList();
			},
			getDateTime(theDate) {
        console.log(theDate);
				let _year = theDate.getFullYear();
				let _month = theDate.getMonth();
				_month = _month;
				if (_month < 10) {
					_month = "0" + _month;
				}
				return _year + "-" + _month + "-01 23:59:59";
			},
      getDateTime2(theDate) {
        console.log(theDate);
      	let _year = theDate.getFullYear();
      	let _month = theDate.getMonth();
      	_month = _month;
      	if (_month < 10) {
      		_month = "0" + _month;
      	}
      	return _year + "-" + _month + "-01 00:00:00";
      }

		}
	}
</script>
