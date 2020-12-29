<template>
	<el-dialog title="往来情况 - 明细" width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top: -80px;">
		<el-tabs v-model="activeName" type="card">
			<el-tab-pane label="应收" name="income">
				<el-button style="float: right;margin-right: 5px;margin-bottom: 5px;" type="primary" size="mini" v-on:click="exportExcel(0)">导出</el-button>
				<el-table border v-loading="incomeLoading" :data="incomeData" stripe>
					<el-table-column align="center" label="序号" width="60">
						<template slot-scope="scope">
							<span>{{scope.$index+1}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="businessScope" label="业务范畴" width="70"></el-table-column>
					<el-table-column label="主单号" prop="awbNumber" align="center" width="120">
					</el-table-column>
					<el-table-column label="订单" prop="orderCode" align="center" width="120">
						<template slot-scope="scope">
							<a v-if="!otherOrgFlag" href="javascript:void(0)" @click="cellClick(scope.row,'订单')" style="color: #137DFA;text-decoration: underline;">{{scope.row.orderCode}}</a>
							<span v-if="otherOrgFlag">{{scope.row.orderCode}}</span>
						</template>
					</el-table-column>
					<el-table-column label="客户单号" prop="customerNumber" align="center" width="120">
					</el-table-column>
					<el-table-column align="center" prop="flightDate" label="开航/到港日期" width="120"></el-table-column>
					<el-table-column align="center" prop="orderCoopCode" label="订单客户代码" width="100"></el-table-column>
					<el-table-column header-align="center" align="left" prop="orderCoopName" label="订单客户" width="250"></el-table-column>
					<el-table-column align="center" prop="coopCode" label="收款客户代码" width="100"></el-table-column>
					<el-table-column header-align="center" align="left" prop="coopName" label="收款客户" width="250"></el-table-column>
					<el-table-column align="center" label="责任客服" width="150">
						<template slot-scope="scope">{{scope.row.servicerName.split(' ')[0]}}</template>
					</el-table-column>
					<el-table-column align="center" label="责任销售" width="150">
						<template slot-scope="scope">{{scope.row.salesName.split(' ')[0]}}</template>
					</el-table-column>
					<el-table-column header-align="center" align="right" prop="functionalAmountStr" label="应收金额(本币)" width="150"></el-table-column>
					<el-table-column header-align="center" align="right" prop="functionalAmountWriteoffStr" label="已核销金额(本币)" width="150"></el-table-column>
					<el-table-column header-align="center" align="right" prop="functionalAmountNoWriteoffStr" label="未核销金额(本币)" width="150"></el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="应付" name="cost">
				<el-button style="float: right;margin-right: 5px;margin-bottom: 5px;" type="primary" size="mini" v-on:click="exportExcel(1)">导出</el-button>
				<el-table border v-loading="costLoading" :data="costData" stripe>
					<el-table-column align="center" label="序号" width="60">
						<template slot-scope="scope">
							<span>{{scope.$index+1}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="businessScope" label="业务范畴" width="70"></el-table-column>
					<el-table-column label="主单号" prop="awbNumber" align="center" width="120">
					</el-table-column>
					<el-table-column label="订单" prop="orderCode" align="center" width="120">
						<template slot-scope="scope">
							<a v-if="!otherOrgFlag" href="javascript:void(0)" @click="cellClick(scope.row,'订单')" style="color: #137DFA;text-decoration: underline;">{{scope.row.orderCode}}</a>
					    <span v-if="otherOrgFlag">{{scope.row.orderCode}}</span>
            </template>
					</el-table-column>
					<el-table-column label="客户单号" prop="customerNumber" align="center" width="120">
					</el-table-column>
					<el-table-column align="center" prop="flightDate" label="开航/到港日期" width="120"></el-table-column>
					<el-table-column align="center" prop="orderCoopCode" label="订单客户代码" width="100"></el-table-column>
					<el-table-column header-align="center" align="left" prop="orderCoopName" label="订单客户" width="250"></el-table-column>
					<el-table-column align="center" prop="coopCode" label="付款客户代码" width="100"></el-table-column>
					<el-table-column header-align="center" align="left" prop="coopName" label="付款客户" width="250"></el-table-column>
					<el-table-column align="center" label="责任客服" width="150">
						<template slot-scope="scope">{{scope.row.servicerName==null?'':scope.row.servicerName.split(' ')[0]}}</template>
					</el-table-column>
					<el-table-column align="center" label="责任销售" width="150">
						<template slot-scope="scope">{{scope.row.salesName==null?'':scope.row.salesName.split(' ')[0]}}</template>
					</el-table-column>
					<el-table-column align="center" label="币种" width="80">
						<template slot-scope="scope">
							<span v-if="scope.row.currency=='CNY'">{{scope.row.currency}}</span>
							<span v-else style="color: red;">{{scope.row.currency}}</span>
						</template>
					</el-table-column>
					<el-table-column header-align="center" align="right" prop="amountStr" label="付款金额(原币)" width="150"></el-table-column>
					<el-table-column header-align="center" align="right" prop="functionalAmountStr" label="付款金额(本币)" width="150"></el-table-column>
					<el-table-column header-align="center" align="right" prop="amountNoWriteoffStr" label="未核销金额(原币)" width="150"></el-table-column>
					<el-table-column header-align="center" align="right" prop="functionalAmountNoWriteoffStr" label="未核销金额(本币)" width="150"></el-table-column>
				</el-table>
			</el-tab-pane>
		</el-tabs>
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
				incomeData: [],
				costData: [],
        otherOrgFlag:false,
				ffrow: {},
				activeName: 'income',
				viewVisibleAE: false,
				viewVisibleAI: false,
				viewVisibleSE: false,
				viewVisibleSI: false,
				viewVisibleTE: false,
				viewVisibleLC: false,
        viewVisibleIO: false,
				incomeLoading: false,
				costLoading: false
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
      let p = '';
      if(this.frow.otherOrg){
         p = this.frow.otherOrg;
         this.otherOrgFlag = true;
      }
			this.incomeLoading = true
			this.$axios.get('/afbase/cssReportNoWriteoff/' + this.frow.coopId + '/0'+'/'+p).then((response) => {
				this.incomeData = response.data.data
				this.incomeLoading = false
			}).catch((error) => {
				this.incomeLoading = false
			})
			this.costLoading = true
			this.$axios.get('/afbase/cssReportNoWriteoff/' + this.frow.coopId + '/1'+'/'+p).then((response) => {
				this.costData = response.data.data
				this.costLoading = false
			}).catch((error) => {
				this.costLoading = false
			})
			if (this.frow.flag == '应付未核销本币金额') {
				this.activeName = 'cost'
			}
		},
		methods: {
			findByPage() {

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
                this.jumpToNewPage('view', this.frow, '/io_order')
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
			exportExcel(type) {
        let p = '';
        if(this.frow.otherOrgFlag){
           p = this.frow.otherOrg;
        }
				if (type == 0 && this.incomeData.length == 0) {
					this.openError("导出数据不能为空")
					return
				} else if (type == 1 && this.costData.length == 0) {
					this.openError("导出数据不能为空")
					return
				}
				this.$axios.post3('/afbase/cssReportNoWriteoff/exportExcel/' + this.frow.coopId + '/' + type + '/' +p).then((response) => {
					var blob = new Blob([response.data], {
						type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
					});
					var downloadElement = document.createElement('a');
					var href = window.URL.createObjectURL(blob); // 创建下载的链接
					downloadElement.href = href;
					downloadElement.download = (type == 0 ? '应收明细.xls' : '应付明细.xls') // 下载后文件名
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
