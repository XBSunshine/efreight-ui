<template>
	<el-dialog title="账单 - 选择" width="510px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<div>
			<el-table :data="data1">
				<el-table-column label="操作" width="60">
					<template slot-scope="scope">
						<el-button type="text" size="small" v-on:click="doSelect(scope.row)">选择</el-button>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="debitNoteNum" label="账单编号" width="160"></el-table-column>
				<el-table-column align="center" prop="debitNoteDate" label="账单日期" width="120"></el-table-column>
				<!--<el-table-column align="center" prop="customerName" label="收款客户名称" ></el-table-column>-->
				<el-table-column align="center" label="账单金额" width="150">
					<template slot-scope="scope">
						<span v-if="scope.row.currencyAmount!=null&&scope.row.currencyAmount!=''">
					    	<p v-for="(item,index) in scope.row.currencyAmount.split(' ')" :key="index">
							  <font v-if="item.indexOf('CNY')>-1">{{item}}</font>
							  <font v-else style="color: red;">{{item}}</font>
						   </p>
						</span>
						<span v-else></span>
					</template>
				</el-table-column>

			</el-table>
		</div>
		<billEditIncome ref="addMission" v-if="billEditIncome" :visible.sync="billEditIncome" :frow="ffrow"></billEditIncome>
	</el-dialog>
</template>
<script>
	import billEditIncome from './af_order_bill_edit'
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
				data1: [],
				ffrow: {},
				billEditIncome: false,
			}
		},

		created: function() {
			this.ffrow = this.frow;
			this.data1 = this.frow.dataList;

		},
		inject: ['queryIncomeCostList','showSelectSendOrPrint'],
		components: {
			'billEditIncome': billEditIncome,
		},
		provide() {
			return {
				// queryIncomeCostList: this.queryIncomeCostList,
				callHandleClose: this.callHandleClose
			}
		},
		methods: {
			doSelect(rrow) {
				this.ffrow.dataBean = rrow;
				this.billEditIncome = true;
				// this.handleClose();

			},
			callHandleClose(debitNoteId) {
				this.queryIncomeCostList();
				this.showSelectSendOrPrint(debitNoteId);
				this.handleClose();
				
			},
			handleClose() {
				this.$emit('update:visible', false);
			}

		}
	}
</script>