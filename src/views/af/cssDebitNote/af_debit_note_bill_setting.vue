<template>
	<el-dialog title="设置字段" width="580px" :visible.sync="visible" append-to-body :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-80px;">
		<span slot="footer" class="dialog-footer">
			<el-button size="small" @click="resetTable">重 置</el-button>
			<el-button type="primary" size="small" @click="sureSave">确 定</el-button>
		</span>
		<div class="ai_order_column_setting">
			<el-table :data="tableColumns" height="480" tooltip-effect="dark" ref="multipleTable" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="100">
				</el-table-column>
				<el-table-column align="center" prop="label" width="180" label="字段名称"></el-table-column>
				<!-- <el-table-column type="selection" prop="flag" width="160" label="是否查询"></el-table-column> -->
				<el-table-column align="center" prop="index" width="80" label="显示顺序">
					<template slot-scope="scope">
						<el-input maxlength="3" size="small" v-model="scope.row.index" @input="checkNumber(scope.row,'index')">
						</el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="width" width="80" label="显示宽度">
					<template slot-scope="scope">
						<el-input maxlength="3" size="small" v-model="scope.row.width" @input="checkNumber(scope.row,'width')">
						</el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="sortable" width="120" label="允许排序">
					<template slot-scope="scope">
						<el-checkbox name="sort" v-model="scope.row.sortable" disabled></el-checkbox>
					</template>
				</el-table-column>
			</el-table>

		</div>
	</el-dialog>
</template>
<script>
	import columns from './af_debit_note_bill_column.json'

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
				tableColumns: [],
				multipleSelection: [],
				oldTableColumns: '',
        af_debit_note_bill_column: []
			}
		},
		inject: ['queryList'],
		provide() {
			return {
				handleClose: this.handleClose,
			}
		},

		methods: {
			openError(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			checkNumber(row, p) {
				row[p] = row[p].replace(/[^0123456789]/g, "");
				if (row[p].length > 3) {
					row[p] = row[p].substr(0, 3);
				}
			},
			handleClose() {
        let userId = window.localStorage.getItem('userId');
        localStorage.removeItem(userId+'_af_debit_note_bill_column_width');//清除掉页面拖动字段宽度的缓存
				this.queryList();
				this.$emit('update:visible', false)
			},
			toggleSelection(rows) {
				if (rows) {
					rows.forEach(row => {
						this.$nextTick(() => {
							this.$refs.multipleTable.toggleRowSelection(row);
						});

					});
				} else {
					this.$nextTick(() => {
						this.$refs.multipleTable.clearSelection();
					});
				}
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			resetTable() {
				this.tableColumns = JSON.parse(this.oldTableColumns);
				this.tableColumns = this.sortBykey(this.tableColumns, 'index');
				this.multipleSelection = this.tableColumns;
				if (this.multipleSelection && this.multipleSelection.length > 0) {
					this.toggleSelection(this.multipleSelection);
				}
			},
			sureSave() {
				let userId = window.localStorage.getItem('userId');
				if (this.multipleSelection && this.multipleSelection.length > 0) {
					let sortColumn = [];
					for (let i = 0; i < this.multipleSelection.length; i++) {
						if (!this.multipleSelection[i].index) {
							this.openError("字段'" + this.multipleSelection[i].label + "' 排列序号不能为空");
							return false;
						}
						if (!this.multipleSelection[i].width) {
							this.openError("字段'" + this.multipleSelection[i].label + "' 字段宽度不能为空");
							return false;
						}
					}
          this.multipleSelection = this.sortBykey(this.multipleSelection, 'index');
          this.$axios.post2('/hrs/user/saveUserPageSet', {
              multipleSelection: this.multipleSelection,
              pageName: '财务结算管理/收入对账/账单'
              })
              .then(function(response) {
                  if(response.data.code == 0) {
                      this.handleClose();
                  } else {
                      this.openError(response.data.messageInfo);
                  }

              }.bind(this)).catch(function(error) {
              this.openError(error.response.data.messageInfo);
          }.bind(this));

          localStorage.removeItem(userId+'_af_debit_note_bill_column_width');//清除掉页面拖动字段宽度的缓存
          /*this.multipleSelection = this.sortBykey(this.multipleSelection, 'index');
					localStorage.setItem(userId + '_af_debit_note_bill_column', JSON.stringify(this.multipleSelection));
					this.handleClose();*/
				} else {
					this.openError("至少需要勾选一个");
				}

			},
			sortBykey(ary, key) {
				return ary.sort(function(a, b) {
					let x = a[key]
					let y = b[key]
					return ((x < y) ? -1 : (x > y) ? 1 : 0)
				});
			},
			setLabel(tableColumns) {
          let indexDelete = [];
					tableColumns.forEach(column => {
						if (column.prop == 'flightDate' && this.frow.businessScope.endsWith('I')) {
							column.label = '到港日期'
						} else if (column.prop == 'flightDate' && this.frow.businessScope.endsWith('E')) {
              if(this.frow.businessScope.startsWith('T')){
                column.label = '发车日期'
              }else{
							   column.label = '开航日期'
              }
						}else if (column.prop == 'flightDate' && this.frow.businessScope.startsWith('L')){
              column.label = '用车日期'
            }else if(column.prop == 'flightDate' && this.frow.businessScope.startsWith('I')){
              column.label = '业务日期'
            }
						if (column.prop == 'flightNo' && this.frow.businessScope.startsWith('A')) {
							column.label = '航班号'
						} else if (column.prop == 'flightNo' && this.frow.businessScope.startsWith('S')) {
							column.label = '航次号'
						}else if(column.prop == 'flightNo' && (this.frow.businessScope.startsWith('T') ||this.frow.businessScope.startsWith('L')||this.frow.businessScope.startsWith('I'))){
              this.$delete(this.tableColumns,index);
            }
						if(column.prop == 'awbNumber'){
						   if(this.frow.businessScope=='LC'||this.frow.businessScope=='IO'){
						     indexDelete.push(index);
						   }
						}
					})
          if(indexDelete.length>0){
             indexDelete.sort(function(a,b){
               return a-b;
             });
             for(let i = 0; i < indexDelete.length; i++){
               this.$delete(this.tableColumns,indexDelete[i]-i);
             }
          }
			}

		},
		created() {
			//let userId = window.localStorage.getItem('userId');
			let info = JSON.stringify(columns.info);
			this.oldTableColumns = info;
			//let af_debit_note_bill_column = window.localStorage.getItem(userId + '_af_debit_note_bill_column');
      //从数据库查询设置信息
      let pageName = '财务结算管理/收入对账/账单';
      this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
          .then(function(response) {
              this.af_debit_note_bill_column = response.data.data;
          }.bind(this));

			if (this.af_debit_note_bill_column) {
				this.tableColumns = JSON.parse(info);
			} else {
				this.tableColumns = JSON.parse(info);
				this.tableColumns = this.sortBykey(this.tableColumns, 'index');
			}
		},
		mounted() {
			let userId = window.localStorage.getItem('userId');
      let af_debit_note_bill_column_width = window.localStorage.getItem(userId+'_af_debit_note_bill_column_width');
        //从数据库查询设置信息
        let pageName = '财务结算管理/收入对账/账单';
        this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
            .then(function(response) {
                this.af_debit_note_bill_column = response.data.data;

                //如果af_debit_note_bill_column_width不为空，则说明在页面拖动过字段的宽度
                if(af_debit_note_bill_column_width){
                    let loaclWidthJsonArray = JSON.parse(af_debit_note_bill_column_width);
                    if(loaclWidthJsonArray && loaclWidthJsonArray.length>0){
                        for(var i=0;i<this.tableColumns.length;i++){
                            for(var j=0;j<loaclWidthJsonArray.length;j++){
                                if(this.tableColumns[i].prop==loaclWidthJsonArray[j].prop){
                                    this.tableColumns[i].width = loaclWidthJsonArray[j].width;
                                }
                            }
                        }
                    }
                }

                if(this.af_debit_note_bill_column && this.af_debit_note_bill_column.length>0){
                    let loaclJsonArray = this.af_debit_note_bill_column;
                    if(loaclJsonArray&&loaclJsonArray.length>0){
                        let liftNo = [];
                        let lift = [];
                        for(var i=0;i<this.tableColumns.length;i++){
                            let liftNew = false;
                            for(var j=0;j<loaclJsonArray.length;j++){
                                if(this.tableColumns[i].prop==loaclJsonArray[j].prop){
                                    this.tableColumns[i].index=loaclJsonArray[j].index;
                                    if(af_debit_note_bill_column_width){
                                    }else{
                                        this.tableColumns[i].width = loaclJsonArray[j].width;
                                    }
                                    this.tableColumns[i].sortable = loaclJsonArray[j].sortable;
                                    this.multipleSelection.push(this.tableColumns[i]);
                                    liftNew = true;
                                }
                            }
                            if(liftNew){
                                lift.push(this.tableColumns[i]);
                            }else{
                                liftNo.push(this.tableColumns[i]);
                            }
                        }
                        if(lift&&lift.length>0){
                            lift = this.sortBykey(lift, 'index');
                            if(liftNo&&liftNo.length>0){
                                liftNo = this.sortBykey(liftNo, 'index');
                            }
                            this.tableColumns=lift.concat(liftNo);
                        }

                    }
                }else{
                    this.multipleSelection = this.tableColumns;
                }
                for(let i=0;i<this.tableColumns.length;i++){
                    this.tableColumns[i].index=i+1;
                }
                this.setLabel(this.tableColumns)
                if(this.multipleSelection){
                    this.toggleSelection(this.multipleSelection);
                }
            }.bind(this));

/*			if (af_debit_note_bill_column) {
				let loaclJsonArray = JSON.parse(af_debit_note_bill_column);
				if (loaclJsonArray && loaclJsonArray.length > 0) {
					let liftNo = [];
					let lift = [];
					for (var i = 0; i < this.tableColumns.length; i++) {
						let liftNew = false;
						for (var j = 0; j < loaclJsonArray.length; j++) {
							if (this.tableColumns[i].prop == loaclJsonArray[j].prop) {
								this.tableColumns[i].index = loaclJsonArray[j].index;
								this.tableColumns[i].width = loaclJsonArray[j].width;
								this.tableColumns[i].sortable = loaclJsonArray[j].sortable;
								this.multipleSelection.push(this.tableColumns[i]);
								liftNew = true;
							}
						}
						if (liftNew) {
							lift.push(this.tableColumns[i]);
						} else {
							liftNo.push(this.tableColumns[i]);
						}
					}
					if (lift && lift.length > 0) {
						lift = this.sortBykey(lift, 'index');
						if (liftNo && liftNo.length > 0) {
							liftNo = this.sortBykey(liftNo, 'index');
						}
						this.tableColumns = lift.concat(liftNo);
					}

				}
			} else {
				this.multipleSelection = this.tableColumns;
			}
			for (let i = 0; i < this.tableColumns.length; i++) {
				this.tableColumns[i].index = i + 1;
			}
			this.setLabel(this.tableColumns)
			if (this.multipleSelection) {
				this.toggleSelection(this.multipleSelection);
			}*/

		}
	}
</script>
<style scope>
	.ai_order_column_setting .el-table .warning-row2 {
		background: oldlace;
		color: #409EFF;
		font-weight: bold !important;
	}

	.ai_order_column_setting .el-table .warning-row1 {
		background: oldlace;
		font-weight: bold !important;
	}

	.ai_order_column_setting .el-table .warning-row0 {
		color: #409EFF;
	}

	.ai_order_column_setting .el-table .cell {
		white-space: pre-line !important;
		/*保留换行符*/
	}

	.ai_order_column_setting .el-table .hidden_row {
		display: none;
		/*保留换行符*/
	}

	.awbNumber {
		text-decoration: underline;
	}

	.duihao_af {
		font-family: "iconfont" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		display: "table-cell" !important;
	}

	.duihao_icn :before {
		content: "\E608";
	}
</style>
