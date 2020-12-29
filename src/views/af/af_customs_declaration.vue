<template>
	<div class="warp-main">
		<div ref="ae_customs_declaration_header">
			<el-form :model="query" class="customs_declaration" label-width="5px">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.awbNumber" auto-complete="off" clearable style="width: 200px;">
								<template slot="prepend">主运单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.hawbNumber" auto-complete="off" clearable style="width: 200px;">
								<template slot="prepend">分运单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.customsNumberPreEntry" auto-complete="off" clearable style="width: 200px;">
								<template slot="prepend">预录入编号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:210px;">
								<template slot="prepend">操作日期</template>
								<el-date-picker slot="suffix" v-model="query.createTimeStart" clearable type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="开始" style="width: 141px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker v-model="query.createTimeEnd" clearable type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="结束" style="width: 141px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-button type="primary" @click="queryList" size="small" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="setting">设置</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" v-if="true" type="primary" @click="showSave" size="small">新增</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div>
			<el-table v-loading="loading" :data="data" border stripe @header-dragend="cellWidth" :max-height="tableHeight">
				<el-table-column label="操作" align="center" fixed width="50">
					<template slot-scope="scope">
						<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="edit">编辑</el-dropdown-item>
								<el-dropdown-item command="delete">删除</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
				<template v-for="(item,index) in tableColumns">
					<el-table-column v-if="item.prop == 'declareDate'" :key="index" :header-align="item.headerAlign" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortDeclareDateMethod" :formatter="formatter">
					</el-table-column>
					<el-table-column v-else :key="index" :header-align="item.headerAlign" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter">
					</el-table-column>
				</template>
			</el-table>
		</div>
		<div ref="ae_customs_declaration_footer">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<save ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="frow"></save>
		<edit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></edit>
		<setting ref="addMission" v-if="setVisible" :visible.sync="setVisible"></setting>
	</div>
</template>
<script>
	import Save from './customs_declaration/save';
	import Edit from './customs_declaration/edit';
	import Setting from './customs_declaration/setting'
	import columns from './customs_declaration/column.json'

	export default {
		data() {
			return {
				loading: false,
				data: [],
				tableColumns: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 50, 100], //分页选项
					handleCurrentChange: function() {
						console.log("页码改变了");
					}
				},
				query: {
					awbNumber: '',
					hawbNumber: '',
					customsNumberPreEntry: '',
					createTimeStart: '',
					createTimeEnd: ''
				},
				saveVisible: false,
				editVisible: false,
				setVisible: false,
				frow: {},
				totalSum: null,
				tableHeight: "750px"
			}
		},
		created: function() {
			if (this.$route.query.flag) {
				if (this.$route.query.name == 'edit') {
					this.frow = JSON.parse(this.base64Decode(this.$route.query.frow))
					this.editVisible = true;
				} else if (this.$route.query.name == 'save') {
					this.saveVisible = true;
				}else{
					//从数据库查询设置信息
					this.queryColumns()
				}
			}else{
			//从数据库查询设置信息
			this.queryColumns()
			}
		},
		mounted() {
			window.queryList = ()=>{
				this.queryList()
			}
		},
		provide() {
			return {
				columnSetCallback: this.columnSetCallback
			}
		},
		components: {
			'save': Save,
			'edit': Edit,
			'setting': Setting
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
			openSuccess(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'success',
					position: 'bottom-right'
				});
			},
			jumpToNewPage(name, frow) {
				let param = {
					flag: true,
					name: name,
					frow: this.base64Encode(JSON.stringify(frow))
				}
				let routeUrl = this.$router.resolve({
					path: "/af_customs_declaration",
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
			base64Decode(input) {
				let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
				let output = "";
				let chr1, chr2, chr3;
				let enc1, enc2, enc3, enc4;
				let i = 0;
				input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
				while (i < input.length) {
					enc1 = _keyStr.indexOf(input.charAt(i++));
					enc2 = _keyStr.indexOf(input.charAt(i++));
					enc3 = _keyStr.indexOf(input.charAt(i++));
					enc4 = _keyStr.indexOf(input.charAt(i++));
					chr1 = (enc1 << 2) | (enc2 >> 4);
					chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
					chr3 = ((enc3 & 3) << 6) | enc4;
					output = output + String.fromCharCode(chr1);
					if (enc3 != 64) {
						output = output + String.fromCharCode(chr2);
					}
					if (enc4 != 64) {
						output = output + String.fromCharCode(chr3);
					}
				}
				output = this.utf8Decode(output);
				return output;
			},
			utf8Decode(utftext) {
				let string = "";
				let i = 0
				let c = 0
				let c1 = 0
				let c2 = 0
				while (i < utftext.length) {
					c = utftext.charCodeAt(i);
					if (c < 128) {
						string += String.fromCharCode(c);
						i++;
					} else if ((c > 191) && (c < 224)) {
						c1 = utftext.charCodeAt(i + 1);
						string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
						i += 2;
					} else {
						c1 = utftext.charCodeAt(i + 1);
						c2 = utftext.charCodeAt(i + 2);
						string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
						i += 3;
					}
				}
				return string;
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
			sortDeclareDateMethod(a,b){
				return new Date(a.declareDate).getTime()-new Date(b.declareDate).getTime()
			},
			formatter(row, column) {
				if (column.property === "creatorName") {
					if (row.creatorName) {
						return row.creatorName.split(' ')[0];
					} else {
						return "";
					}
				}
				return row[column.property]
			},
			queryList() {
				this.setHeight()
				this.loading = true
				this.$axios.get2('/afbase/customsDeclaration?size=' + this.pageConf.pageSize + '&current=' + this.pageConf.pageCode, this.query).then((response) => {
					if (response.data.code == 0) {
						this.data = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
						if (this.data.length == 0) {
							let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
							this.queryList2(current);
						} else {
							this.loading = false
						}
					} else {
						this.loading = false
						this.openError(response.data.messageInfo)
					}
				}).catch((error) => {
					this.loading = false
					this.openError(error.response.data.messageInfo)
				})
				// this.$axios.get2("/afbase/customsDeclaration/total", this.query)
				// 	.then(function(response) {
				// 		this.totalSum = response.data.data;
				// 		this.getSummaries();
				// 	}.bind(this));
			},
			queryList2(current) {
				this.$axios.get2('/afbase/customsDeclaration?size=' + this.pageConf.pageSize + '&current=' + current, this.query).then((response) => {
					this.data = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
					this.loading = false
				})
			},
			getSummaries(param) {
				const sums = [];
				sums[0] = '总计';
				let loaclJsonArray = this.tableColumns;
				if (loaclJsonArray) {
					for (let i = 0; i < loaclJsonArray.length; i++) {
						if (this.totalSum) {
							if (loaclJsonArray[i].prop === "planPieces") {
								sums[i + 1] = this.getFormatNumber(this.totalSum.planPieces);
							}
						}
					}
				}


				return sums;
			},
			//pageSize改变时触发的函数
			handleSizeChange() {
				this.queryList();
			},
			//当前页改变时触发的函数
			handleCurrentChange() {
				this.queryList();
			},
			showSave() {
				this.jumpToNewPage("save",null)
			},
			delete() {
				this.$confirm('你确定要删除该报关单吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.deletes('/afbase/customsDeclaration/' + this.frow.customsDeclarationId)
						.then((response) => {
							if (response.data.code == 0) {
								this.openSuccess('删除成功');
								this.queryList();
							} else {
								this.openError(response.data.messageInfo);
							}
						}).catch((error) => {
							let errorinfo = error.response.data.messageInfo;
							this.openError(errorinfo);
						});
				}).catch(() => {

				});
			},
			getFormatNumber(val) {
				return val.toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
			},
			setHeight() {
				this.$nextTick(() => {
					let ae_customs_declaration_header = this.$refs.ae_customs_declaration_header.offsetHeight;
					let ae_customs_declaration_footer = this.$refs.ae_customs_declaration_footer.offsetHeight;
					let heightS = window.innerHeight - 90 - ae_customs_declaration_header - ae_customs_declaration_footer;
					this.tableHeight = heightS + "px";
				});
			},
			exportExcel() {
				this.$confirm('是否根据结果字段导出数据？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.query.columnStrs = JSON.stringify(this.tableColumns)
					this.exportExcelSure()
				}).catch(() => {
					let excelList = this.sortBykey(columns.columns, 'index')
					this.query.columnStrs = JSON.stringify(excelList)
					this.exportExcelSure();
				});
			},
			exportExcelSure() {
				this.$axios.post3('/afbase/orderInquiry/exportExcel', this.query)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '询价单' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					}.bind(this));
			},
			cellWidth(newWidth, oldWidth, column, event) {
				let strColumn = JSON.stringify(this.tableColumns);
				let userId = window.localStorage.getItem('userId');
				let arrayC = JSON.parse(strColumn);
				if (arrayC && arrayC.length > 0) {
					arrayC.forEach(function(item, index) {
						if (column.label == item.label) {
							item.width = newWidth;
						}
					});
					arrayC = this.sortBykey(arrayC, 'index');
					localStorage.setItem(userId + '_customs_declaration_list_column_width', JSON.stringify(arrayC))
				}
			},
			sortBykey(ary, key) {
				return ary.sort(function(a, b) {
					let x = a[key]
					let y = b[key]
					return ((x < y) ? -1 : (x > y) ? 1 : 0)
				})
			},
			setting() {
				this.setVisible = true;
			},
			columnSetCallback() {
				this.queryColumns()
			},
			handleCommand(command) {
				if ("edit" == command) {
					this.jumpToNewPage("edit",this.frow)
				} else if ("delete" == command) {
					this.delete()
				}
			},
			handleChange(row) {
				this.frow = row;
			},
			queryColumns() {
				this.$axios.get2("/hrs/user/getUserPageSet?pageName=订单操作管理/空运出口/出口报关单")
					.then((response) => {
						if (response.data.code == 0) {
							if (response.data.data && response.data.data.length > 0) {
								this.tableColumns = this.sortBykey(response.data.data, 'index');
							} else {
								this.tableColumns = this.sortBykey(columns.columns, 'index');
							}
						} else {
							this.tableColumns = this.sortBykey(columns.columns, 'index')
						}
					}).catch((error) => {
						this.tableColumns = this.sortBykey(columns.columns, 'index')
					})
			}
		}
	}
</script>
<style type="text/css">
	.customs_declaration .el-input__icon {
		line-height: 30px !important;
	}

	.customs_declaration .el-form-item__content {
		line-height: 30px !important;
	}

	.customs_declaration .el-input-group__prepend {
		padding: 0 6px;
	}
</style>
