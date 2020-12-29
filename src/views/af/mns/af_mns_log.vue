<template>
	<el-dialog title="看板 - 日志" width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" top="55px">
		<el-form label-width="10px" ref="ruleForm" style="margin-left: 3px;" class="fhlEditPage demo-ruleForm">
			<div style="padding:0px 0px 0px 10px;text-align:center;" >	
				<h1 v-if="frow.hawbCode">{{frow.mawbCode}}/{{frow.hawbCode}}</h1>
				<h1 v-else>{{frow.mawbCode}}</h1>
			</div>
			<div style="padding:10px 50px 0px 50px">
			<el-row>
				
			        <el-steps :active="active" finish-status="success">
					  <el-step title="预录入" :status="success1"></el-step>
					  <el-step title="入库" :status="success2"></el-step>
					  <el-step title="预配" :status="success3"></el-step>
					  <el-step title="运抵" :status="success4"></el-step>
					  <el-step title="审结" :status="success5"></el-step>
					  <el-step title="查验" :status="success6"></el-step>
					  <el-step title="放行" :status="success7"></el-step>
					  <el-step title="电子运单" :status="success8"></el-step>
					  <el-step title="交单" :status="success9"></el-step>
					</el-steps>
				
			</el-row>
			</div>
			<div style="padding:5px 0px 0px 10px">
				<span >操作日志</span>
			</div>
			<div style="padding:10px 50px 0px 50px">
			<el-row>
				<el-table :data="data1" stripe border  height="280">
					 <el-table-column prop="mawbCode" label="主单号" width="150" align="center"></el-table-column>
					 <el-table-column prop="hawbCode" label="分单号" width="150" align="center"></el-table-column>
					 <el-table-column prop="operateTime" label="发生时间" width="200" align="center"></el-table-column>
					 <el-table-column prop="operateType" label="操作类型"  align="center" :formatter="formatter_operateType"></el-table-column>
					 <el-table-column prop="operateStatus" label="状态"  align="center" :formatter="formatter_operateStatus"></el-table-column>
				</el-table>
			</el-row>
			</div>
			<!-- <el-divider></el-divider> -->
			<div style="padding:10px 0px 0px 10px">
				<span >货站状态</span>
			</div>
			<div style="padding:10px 50px 0px 50px">
			<el-row>
				<el-table :data="data2" stripe border height="200">
					<el-table-column prop="mawbcode" label="主单号" width="150" align="center"></el-table-column>
					 <el-table-column prop="occurtime" label="发生时间" width="200" align="center"></el-table-column>
					 <el-table-column prop="fsutype" label="FSU类型"  align="center"></el-table-column>
					 <el-table-column prop="flightdate" label="航班日期"  align="center"></el-table-column>
					 <el-table-column prop="flightno" label="航班号"  align="center"></el-table-column>
					 <el-table-column prop="pcs" label="件数"  align="center"></el-table-column>
					 <el-table-column prop="gwt" label="重量"  align="center"></el-table-column>
				</el-table>
			</el-row>
			</div>	
			<div style="padding:10px 0px 0px 10px">
				<span >预配回执</span>
			</div>
			<div style="padding:10px 50px 0px 50px">
			<el-row>
				<el-table :data="data3" stripe border height="200">
					<el-table-column prop="mawbCode" label="主单号" width="150" align="center" :formatter="formatter_mawb" ></el-table-column>
					<el-table-column prop="hawbCode" label="分单号" width="150" align="center"></el-table-column>
					<el-table-column prop="inputDate" label="发生时间" width="200" align="center"></el-table-column>
					<el-table-column prop="text" label="备注"  align="center"></el-table-column>
				</el-table>
			</el-row>
			</div>
			<div style="padding:10px 0px 0px 10px">
				<span >运抵回执</span>
			</div>
			<div style="padding:10px 50px 20px 50px">
			<el-row>
				<el-table :data="data4" stripe border height="200">
					<el-table-column prop="mawbCode" label="主单号" width="150" align="center" :formatter="formatter_mawb"></el-table-column>
					<el-table-column prop="hawbCode" label="分单号" width="150" align="center"></el-table-column>
					<el-table-column prop="inputDate" label="发生时间" width="200" align="center"></el-table-column>
					<el-table-column prop="text" label="备注"  align="center"></el-table-column>
				</el-table>
			</el-row>
			</div>
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
		data() {
			return {
				OperateType:{
					'mft2201_decleare':'预配舱单申报',
					'mft2201_update':'预配舱单修改',
					'mft2201_delete':'预配舱单删除',
					'mft2201_delete_forforce':'预配舱单强制删除',
					'order_save':'订单保存',
					'onedecleare_forsend':'一键申报',
					'eawb_pre':'货站预申报',
					'eawb_pre_delete':'货站预申报删除',
					'eawb_tb':'货站fwb',
					'eawb_ams':'航司fwb',
					'eawb_wh':'入库',
					've_entry':'卡口入区',
					've_entry_confirm':'卡口入区',
					've_appoint':'卡口入区',
					'eawb_recv':'运单回执',
					'mft_recv':'预配回执'
				},
				active: 0,
				success1:'wait ',
				success2:'wait ',
				success3:'wait ',
				success4:'wait ',
				success5:'wait ',
				success6:'wait ',
				success7:'wait ',
				success8:'wait ',
				success9:'wait ',
				data1:[],
				data2:[],
				data3:[],
				data4:[]
			}
		},
		methods: {
			next() {
		        if (this.active++ > 2) this.active = 0;
		    },
			handleClose() {
				this.$emit("update:visible", false);
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
			
			formatter_operateType(row, column) {
				if(row.operateType)
					return this.OperateType[row.operateType.toLowerCase()];
				else{
					return '';
				}
				
		      },
			formatter_operateStatus(row, column) {
		        if (row.operateStatus && 'succ'==row.operateStatus.toLowerCase()) {
		            return "成功";
		        }else if (row.operateStatus && 'error'==row.operateStatus.toLowerCase()) {
		            return "失败";
		        }else if (row.operateStatus && 'audit'==row.operateStatus.toLowerCase()) {
		            return "人审";
		        }else if (row.operateStatus && row.operateStatus.toLowerCase().indexOf('do-')==0) {
		            return "正在执行";
		        }else{
		          return "";
		        }
		      },
			formatter_mawb(row, column) {
				if (row.mawbCode) {
		            return row.mawbCode.substring(0,3)+'-'+row.mawbCode.substring(3);
		        }else{
		        	return row.mawbCode
		        }
			},
			setStatus(){
				if (this.frow.sliStatus) {
				this.success1="success"
				}
				if (this.frow.acFohTime) {
					this.success2="success"
				}
				if (this.frow.mft2201Status) {
					this.success3="success"
				}
				if (this.frow.mft3201Recv) {
					this.success4="success"
				}
				if (this.frow.mft9993Recv) {
					this.success5="success"
				}
				if (this.frow.mft99935Recv) {
					this.success6="success"
				}
				if (this.frow.mft9999Recv) {
					this.success7="success"
				}
				if (this.frow.fwbStatus) {
					this.success8="success"
				}
				if (this.frow.acRcsTime) {
					this.success9="success"
				}
		    },
		    queryStorage(){
				let params = {
					mawbcode:this.frow.mawbCode
				}
		    	this.$axios.post('/afbase/mnsLog/queryList',params)
                .then(function(response) {
                    if (response.data.code==0) {
                      this.data2=response.data.data;
                    }else{
                      this.openError(response.data.messageInfo)
                    }
                 }.bind(this)
                );
		    },
		    queryLog(){
		    	let params = {
					mawbCode:this.frow.mawbCode,
					hawbCode:this.frow.hawbCode
				}
		    	 this.$axios.post('/afbase/fhl/queryLogList',params)
                .then(function(response) {
                    if (response.data.data.code=='01') {
                      this.data1=response.data.data.dataList;
                    }else{
                      this.openError(response.data.data.message)
                    }
                 }.bind(this)
                );
		    },
		    queryMftRecv(){
		    	let params = {
					mawbCode:this.frow.mawbCode,
					hawbCode:this.frow.hawbCode
				}
		    	 this.$axios.post('/afbase/fhl/queryStatus',params)
                .then(function(response) {
                    if (response.data.data.code=='01') {
                      this.data3=response.data.data.MT2201List;
                      this.data4=response.data.data.MT3201List;
                    }else{
                      this.openError(response.data.data.message)
                    }
                 }.bind(this)
                );
		    },
		},
		created() {
			this.setStatus();
			this.queryStorage();
			this.queryLog();
			this.queryMftRecv();
		}
	}
</script>
<style type="text/css">

	.fhlEditPage .el-input__icon {
		line-height: 30px !important;
	}

	.fhlEditPage .el-form-item__error {
		margin-top: -5px;
		margin-left: 130px;
	}
</style>
