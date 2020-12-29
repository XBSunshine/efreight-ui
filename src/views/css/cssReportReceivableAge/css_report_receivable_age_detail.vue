<template>
	<el-dialog title="应收账龄 - 明细" width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form v-if=false :inline="false" :model="query" label-width="100px" class="demo-ruleForm">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="业务范畴">
						<el-select v-model="query.businessScope" filterable placeholder="请选择" style="width: 80px;">
							<el-option v-for="item in businessCodes" :key="item.paramRanking" :label="item.paramText" :value="item.paramText">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="客户类型">
						<el-select v-model="query.customerType" style="width: 110px;">
							<el-option label="订单客户" value="1">
							</el-option>
							<el-option label="收款客户" value="2">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="客户">
						<el-input style="width: 200px;" v-model="query.customerName" auto-complete="off" clearable>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="20px">
						<el-button type="text" size="mini" v-if=showFlag v-on:click="showFlag=false">收起</el-button>
						<el-button type="text" size="mini" v-if=!showFlag v-on:click="showFlag=true">展开</el-button>
						<el-button type="primary" size="small" v-on:click="findByPage">查询</el-button>
						<el-button type="primary" size="small" v-on:click="exportExcel">导出</el-button>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row v-if=showFlag>
				<el-col class="elementWidth">
					<el-form-item label="是否超期">
						<el-select v-model="query.overdueValid" style="width: 80px;">
							<el-option label="全部" value="3">
							</el-option>
							<el-option label="是" value="1">
							</el-option>
							<el-option label="否" value="0">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="是否超额">
						<el-select v-model="query.durationValid" style="width: 110px;">
							<el-option label="全部" value="全部">
							</el-option>
							<el-option label="是" value="1">
							</el-option>
							<el-option label="否" value="0">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="统计区间">
						<el-input style="width: 200px;" v-model="query.countRanges" auto-complete="off" clearable>
						</el-input>
					</el-form-item>
					<span style="float: left;margin-left: 100px;margin-top: -16px;font-size: smaller;color: red;">格式：正整数以','分隔,最多五个数值</span>
				</el-col>
			</el-row>
		</el-form>
		<el-button style="float: right;margin-right: 5px;margin-bottom: 5px;" type="primary" size="small" v-on:click="exportExcel">导出</el-button>
		<!-- @cell-click="handlerCellClick" -->
		<el-table border v-loading="loading" :data="data" stripe>
			<el-table-column align="center" label="序号" width="60">
				<template slot-scope="scope">
					<span>{{scope.$index+1}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="businessScope" label="业务范畴" width="70"></el-table-column>
			<el-table-column :label="awbNumberName" prop="awbNumber" align="center" width="120">
			</el-table-column>
			<el-table-column label="订单" prop="orderCode" align="center" width="120">
				<template slot-scope="scope" >
					<a v-if="!otherOrgFlag" href="javascript:void(0)" @click="cellClick(scope.row,'订单')" style="color: #137DFA;text-decoration: underline;">{{scope.row.orderCode}}</a>
					<span v-if="otherOrgFlag">{{scope.row.orderCode}}</span>
				</template>
			</el-table-column>
			<el-table-column header-align="center" align="left" prop="orderCoopCode" label="订单客户代码" width="100"></el-table-column>
			<el-table-column header-align="center" align="left" prop="orderCoopName" label="订单客户" width="250"></el-table-column>
			<el-table-column header-align="center" align="left" prop="coopCode" label="收款客户代码" width="100"></el-table-column>
			<el-table-column header-align="center" align="left" prop="coopName" label="收款客户" width="250"></el-table-column>
			<el-table-column align="center" prop="servicerName" label="责任客服" width="150"></el-table-column>
			<el-table-column align="center" prop="salesName" label="责任销售" width="150"></el-table-column>
			<el-table-column align="center" prop="etd" label="开航日期" width="120" v-if="dateFlag&&frow.businessScope!='LC'&&frow.businessScope!='TE'&&frow.businessScope!='IO'"></el-table-column>
			<el-table-column align="center" prop="etd" label="到港日期" width="120" v-if="!dateFlag&&frow.businessScope!='LC'&&frow.businessScope!='TE'&&frow.businessScope!='IO'"></el-table-column>
			<el-table-column align="center" prop="etd" label="用车日期" width="120" v-if="frow.businessScope=='LC'"></el-table-column>
			<el-table-column align="center" prop="etd" label="发车日期" width="120" v-if="frow.businessScope=='TE'"></el-table-column>
			<el-table-column align="center" prop="etd" label="业务日期" width="120" v-if="frow.businessScope=='IO'"></el-table-column>
			<el-table-column header-align="center" align="right" prop="functionalAmount" label="应收金额(本币)" width="150"></el-table-column>
			<el-table-column header-align="center" align="right" prop="functionalAmountWriteoff" label="已核销金额(本币)" width="150"></el-table-column>
			<el-table-column header-align="center" align="right" prop="noFunctionalAmountWriteoff" label="未核销金额(本币)" width="150"></el-table-column>
		</el-table>
		<viewVisibleTagAE ref="addMission" v-if="viewVisibleAE" :visible.sync="viewVisibleAE" :frow="ffrow"></viewVisibleTagAE>
		<viewVisibleTagAI ref="addMission" v-if="viewVisibleAI" :visible.sync="viewVisibleAI" :frow="ffrow"></viewVisibleTagAI>
		<viewVisibleTagSE ref="addMission" v-if="viewVisibleSE" :visible.sync="viewVisibleSE" :frow="ffrow"></viewVisibleTagSE>
		<viewVisibleTagSI ref="addMission" v-if="viewVisibleSI" :visible.sync="viewVisibleSI" :frow="ffrow"></viewVisibleTagSI>
		<viewVisibleTagTE ref="addMission" v-if="viewVisibleTE" :visible.sync="viewVisibleTE" :frow="ffrow"></viewVisibleTagTE>
		<viewVisibleTagLC ref="addMission" v-if="viewVisibleLC" :visible.sync="viewVisibleLC" :frow="ffrow"></viewVisibleTagLC>
		<viewVisibleTagIO ref="addMission" v-if="viewVisibleIO" :visible.sync="viewVisibleIO" :frow="ffrow"></viewVisibleTagIO>
	</el-dialog>

</template>
<script>
	import viewVisibleVueAE from '../../af/order/af_order_edit_tabs.vue'
	import viewVisibleVueAI from '../../af/ai_order/edit_tabs.vue'
	import viewVisibleVueSE from '../../sc/se/order/main/order_view.vue'
	import viewVisibleVueSI from '../../sc/si/order/main/order_view.vue'
	import viewVisibleVueTE from '../../tc/te/order/main/order_view.vue'
	import viewVisibleVueLC from '../../lc/order/main/order_view.vue'
	import viewVisibleVueIO from '../../io/order/main/order_view.vue'
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
				/*表数据*/
				data: [],
        otherOrgFlag:false,
				column: [],
				query: {
					businessScope: 'AE',
					customerType: '1',
					customerName: '',
					countRanges: '15,30,60,90',
					overdueValid: '全部',
					durationValid: '全部',
				},
				viewVisibleAE: false,
				viewVisibleAI: false,
				viewVisibleSE: false,
				viewVisibleSI: false,
				viewVisibleTE: false,
				viewVisibleLC: false,
				viewVisibleIO: false,
				ffrow: {},
				editTab: '',
				customerType: '1',
				businessCodes: [],
				loading: false,
				showFlag: false,
				dateFlag: false,
				awbNumberName: '主单号'
			}
		},
		components: {
			'viewVisibleTagAE': viewVisibleVueAE,
			'viewVisibleTagAI': viewVisibleVueAI,
			'viewVisibleTagSE': viewVisibleVueSE,
			'viewVisibleTagSI': viewVisibleVueSI,
			'viewVisibleTagTE': viewVisibleVueTE,
			'viewVisibleTagLC': viewVisibleVueLC,
			'viewVisibleTagIO': viewVisibleVueIO
		},
		provide() {
			return {
				findByPage: this.findByPage
			}
		},
		created() {
      if(this.frow.otherOrgFlag){
         this.otherOrgFlag = true;
      }
			if (this.frow.businessScope == 'AE' || this.frow.businessScope == 'SE') {
				this.dateFlag = true;
			} else if (this.frow.businessScope == 'AI' || this.frow.businessScope == 'SI') {
				this.dateFlag = false;
			}

			if (this.frow.businessScope.startsWith('A')) {
				this.awbNumberName = '主单号'
			} else if (this.frow.businessScope.startsWith('S')) {
				this.awbNumberName = '主单号'
			} else if (this.frow.businessScope.startsWith('T')) {
				this.awbNumberName = '提运单号'
			} else if (this.frow.businessScope.startsWith('L') || this.frow.businessScope.startsWith('I')) {
				this.awbNumberName = '客户单号'
			}

			//查询业务范畴
			this.loading = true
			this.$axios.get2('/afbase/reportReceivableAge/view', this.frow).then(function(response) {
				this.data = response.data.data;
				this.loading = false
			}.bind(this)).catch(function(error) {
				this.loading = false
			})
		},
		methods: {
			findByPage() {

			},
			handlerCellClick(row, column, cell, event) {
				if ("订单" == column['label']) {
					this.showView(row);
				}
			},
			cellClick(row, label) {
				if ("订单" == label) {
					this.showView(row);
				}
			},
			showView(row) {
				this.ffrow = row;
				this.ffrow.viewFlag = false;
				if (row.businessScope === 'AE') {
					this.ffrow.activeName = "editTab";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.ffrow.ifFullscreen = true
						this.jumpToNewPage('edit', this.ffrow, '/af_order')
					} else {
						this.ffrow.ifFullscreen = false
						this.viewVisibleAE = true;
					}
				}
				if (row.businessScope === 'AI') {
					this.ffrow.activeName = "editTab";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.ffrow.ifFullscreen = true
						this.jumpToNewPage('edit', this.ffrow, '/ai_order')
					} else {
						this.ffrow.ifFullscreen = false
						this.viewVisibleAI = true;
					}
				}
				if (row.businessScope === 'SE') {
					this.ffrow.activeName = "first";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.ffrow.ifFullscreen = true
						this.jumpToNewPage('view', this.ffrow, '/se_order')
					} else {
						this.ffrow.ifFullscreen = false
						this.viewVisibleSE = true;
					}
				}
				if (row.businessScope === 'SI') {
					this.ffrow.activeName = "first";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.ffrow.ifFullscreen = true
						this.jumpToNewPage('view', this.ffrow, '/si_order')
					} else {
						this.ffrow.ifFullscreen = false
						this.viewVisibleSI = true;
					}
				}
				if (row.businessScope === 'TE') {
					this.ffrow.activeName = "first";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.ffrow.ifFullscreen = true
						this.jumpToNewPage('view', this.ffrow, '/te_order')
					} else {
						this.ffrow.ifFullscreen = false
						this.viewVisibleTE = true;
					}
				}
				if (row.businessScope === 'LC') {
					this.ffrow.activeName = "first";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.ffrow.ifFullscreen = true
						this.jumpToNewPage('view', this.ffrow, '/lc_order')
					} else {
						this.ffrow.ifFullscreen = false
						this.viewVisibleLC = true;
					}
				}
				if (row.businessScope === 'IO') {
					this.ffrow.activeName = "first";
					if (localStorage.getItem("orderEditNewPage") && localStorage.getItem("orderEditNewPage") == 'true') {
						this.ffrow.ifFullscreen = true
						this.jumpToNewPage('view', this.ffrow, '/io_order')
					} else {
						this.ffrow.ifFullscreen = false
						this.viewVisibleIO = true;
					}
				}

			},
			jumpToNewPage(name, frow, path) {
				let param = {
					flag: true,
					name: name,
					frow: this.base64Encode(JSON.stringify(frow))
				}
				let routeUrl = this.$router.resolve({
					path: path,
					query: param
				});
				window.open(routeUrl.href, '_blank');
			},
			base64Encode(input) {
				let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
				let output = "";
				let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
				let i = 0;
				input = this.utf8Encode(input);
				while (i < input.length) {
					chr1 = input.charCodeAt(i++);
					chr2 = input.charCodeAt(i++);
					chr3 = input.charCodeAt(i++);
					enc1 = chr1 >> 2;
					enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
					enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
					enc4 = chr3 & 63;
					if (isNaN(chr2)) {
						enc3 = enc4 = 64;
					} else if (isNaN(chr3)) {
						enc4 = 64;
					}
					output = output +
						_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
						_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
				}
				return output;
			},
			utf8Encode(string) {
				string = string.replace(/\r\n/g, "\n");
				let utftext = "";
				for (let n = 0; n < string.length; n++) {
					let c = string.charCodeAt(n);
					if (c < 128) {
						utftext += String.fromCharCode(c);
					} else if ((c > 127) && (c < 2048)) {
						utftext += String.fromCharCode((c >> 6) | 192);
						utftext += String.fromCharCode((c & 63) | 128);
					} else {
						utftext += String.fromCharCode((c >> 12) | 224);
						utftext += String.fromCharCode(((c >> 6) & 63) | 128);
						utftext += String.fromCharCode((c & 63) | 128);
					}

				}
				return utftext;
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
					message: info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			exportExcel() {
				this.$axios.post3('/afbase/reportReceivableAge/exportExcel', this.frow).then((response) => {
					var blob = new Blob([response.data], {
						type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
					});
					var downloadElement = document.createElement('a');
					var href = window.URL.createObjectURL(blob); // 创建下载的链接
					downloadElement.href = href;
					downloadElement.download = '应收账龄明细.xls'; // 下载后文件名
					document.body.appendChild(downloadElement);
					downloadElement.click(); // 点击下载
					document.body.removeChild(downloadElement); // 下载完成移除元素
					window.URL.revokeObjectURL(href); // 释放掉blob对象
				}).catch((error) => {});
			},
			handleClose() {
				this.$emit('update:visible', false);
			}
		}
	}
</script>
<style>

</style>
