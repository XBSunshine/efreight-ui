<template>
	<el-dialog title="询盘代理 - 选择" width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<div class="inquiryAgentSelectPage">
			<el-form :inline="false" :model="query" class="demo-ruleForm" label-width="10px">

				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.inquiryAgentName" auto-complete="off" clearable style="width: 250px;">
								<template slot="prepend">询价代理</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.departureStation" auto-complete="off" @input="query.departureStation=query.departureStation.toUpperCase()" clearable style="width: 200px;">
								<template slot="prepend">始发港</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.arrivalStation" @input="query.arrivalStation=query.arrivalStation.toUpperCase()" auto-complete="off" clearable style="width: 200px;">
								<template slot="prepend">目的港</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:295px;">
								<template slot="prepend">
									<span>航司要求</span>
								</template>
								<el-select slot="suffix" v-model="carrierCodes" multiple filterable placeholder="请选择" style="width:226px;margin-right: -5px;" clearable>
									<el-option v-for="item in carriers" :key="item.value" :label="item.carrierCode" :value="item.carrierCode">
										<span>{{item.carrierName.split(',')[0]}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.carrierName.split(',')[1]}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.carrierName.split(',')[2]}}</span>
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="20px">
							<el-button type="primary" size="mini" @click="queryList">搜索</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div>
			<el-table border :data="data" stripe @selection-change="handleSelectionChange">
				<el-table-column align="center" type="selection" width="40"></el-table-column>
				<el-table-column header-align="center" prop="inquiryAgentNameShort" label="简称"></el-table-column>
				<el-table-column header-align="center" prop="carrierCode" label="优势航司" width="180"></el-table-column>
				<el-table-column header-align="center" prop="departureStation" label="始发港" width="150"></el-table-column>
				<el-table-column header-align="center" prop="arrivalStation" label="目的港" width="150"></el-table-column>
				<el-table-column header-align="center" prop="nationCodeArrival" label="目的国" width="150"></el-table-column>
				<el-table-column header-align="center" prop="routingName" label="航线" width="100"></el-table-column>
				<el-table-column header-align="center" prop="bookingContactsName" label="订舱联系人" width="120"></el-table-column>
				<el-table-column header-align="center" prop="contractType" label="签约类型" width="120"></el-table-column>
				<el-table-column align="center" prop="inquiryOrderAmount" label="90天内发盘票数" width="120"></el-table-column>
			</el-table>
		</div>
		<div style="margin-bottom: 10px;">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<div>
			<el-button type="primary" size="mini" @click="doSelect">完成</el-button>
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
		data() {
			return {
				loading: false,
				data: [],
				multipleSelection: [],
				carriers: [],
				carrierCodes: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 50, 100]
				},
				query: {
					inquiryAgentName:'',
					departureStation: '',
					arrivalStation: ''
				},
				saveVisible: false
			}
		},

		inject: ['selectInquiryAgentCallback'],
		created: function() {
			this.carrierCodes = this.frow.carrierCode
			this.query.departureStation = this.frow.departureStation
			this.query.arrivalStation = this.frow.arrivalStation
			this.$axios.get('/afbase/carrier/getCarrierList').then((response) => {
				this.carriers = response.data.data
			})
			this.queryList();
		},

		methods: {
			toUpperCaseValue(val) {
				return val.toUpperCase();
			},
			openError(info) {
				this.$notify({
					title: '',
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			doSelect() {
				let inquiryAgentIds = this.multipleSelection.map(item=>item.inquiryId).join()
				let inquiryAgentNames = this.multipleSelection.map(item=>item.inquiryAgentNameShort).join()
				this.selectInquiryAgentCallback({inquiryAgentIds:inquiryAgentIds,inquiryAgentNames:inquiryAgentNames})
				this.handleClose();
			},
			queryList() {
				let params={
				  'currentPage': this.pageConf.pageCode,
				  'pageSize': this.pageConf.pageSize,
				  'inquiryAgentName':this.query.inquiryAgentName,
				  'departureStation':this.query.departureStation,
				  'arrivalStation':this.query.arrivalStation,
				  'carrierCode':this.carrierCodes.join()
				}
				this.$axios.post('/prm/inquiryAgent/getInquiryAgentList',params)
				.then(function(response) {
				    this.data=response.data.data.dataList;
				    this.pageConf.totalPage=response.data.data.totalNum;
				 }.bind(this)
				);

			},
			handleSelectionChange(val) {
			    this.multipleSelection = val;
			},
			//pageSize改变时触发的函数
			handleSizeChange() {
				this.queryList();
			},
			//当前页改变时触发的函数
			handleCurrentChange() {
				this.queryList();
			},
			handleClose() {
				this.$emit('update:visible', false);
			}
		}
	}
</script>
<style type="text/css">
	.inquiryAgentSelectPage .el-form-item__content {
		line-height: 30px !important;
	}

	.inquiryAgentSelectPage .el-input__icon {
		line-height: 30px !important;
	}

	.inquiryAgentSelectPage .el-input-group__prepend {
		padding: 0 6px;
	}
</style>
