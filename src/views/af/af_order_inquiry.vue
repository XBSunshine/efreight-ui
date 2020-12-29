<template>
	<div class="warp-main">
		<div>
			<el-form :model="query" class="afOrderInquiry-ruleForm" label-width="10px">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.departureStation" auto-complete="off" @input="query.departureStation=query.departureStation.toUpperCase()" clearable style="width: 150px;">
								<template slot="prepend">始发港</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.arrivalStation" @input="query.arrivalStation=query.arrivalStation.toUpperCase()" auto-complete="off" clearable style="width: 150px;">
								<template slot="prepend">目的港</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:210px;">
								<template slot="prepend">询价日期</template>
								<el-date-picker slot="suffix" v-model="query.editTimeBegin" clearable type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="开始" style="width: 141px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker v-model="query.editTimeEnd" clearable type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="结束" style="width: 141px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-button type="text" size="small" v-if=showFlag v-on:click="showFlag=false">收起</el-button>
							<el-button type="text" size="small" v-if=!showFlag v-on:click="showFlag=true">展开</el-button>
							<el-button type="primary" @click="queryList" size="small" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" v-if="true" type="primary" @click="showSave" size="small">新增</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:310px;">
								<template slot="prepend">状&nbsp;&nbsp;&nbsp;&nbsp;态</template>
								<el-select slot="suffix" clearable v-model="orderInquiryStatusList" multiple placeholder="请选择" style="width:255px;margin-right: -5px;">
									<el-option label="已创建" value="已创建"></el-option>
									<el-option label="已收方案" value="已收方案"></el-option>
									<el-option label="已转订单" value="已转订单"></el-option>
									<el-option label="已关闭" value="已关闭"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.editorName" auto-complete="off" clearable style="width: 210px;">
								<template slot="prepend">&nbsp;操&nbsp;作&nbsp;人&nbsp;</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="191px">
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel">导出</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div>
			<el-table v-loading="loading" :data="data" border stripe @header-dragend="cellWidth">
				<el-table-column label="操作" align="center" fixed width="50">
					<template slot-scope="scope">
						<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="edit" v-if="scope.row.orderInquiryStatus=='已创建'">编辑</el-dropdown-item>
								<el-dropdown-item command="showTwoCode" v-if="scope.row.orderInquiryStatus=='已创建'||scope.row.orderInquiryStatus=='已收方案'">显示二维码</el-dropdown-item>
								<el-dropdown-item command="send" v-if="(scope.row.orderInquiryStatus=='已创建'||scope.row.orderInquiryStatus=='已收方案')&&scope.row.inquiryAgentIds">发送询盘邮件</el-dropdown-item>
								<el-dropdown-item command="export">导出询报价单</el-dropdown-item>
								<el-dropdown-item command="copy">复制新增</el-dropdown-item>
								<el-dropdown-item command="stop" v-if="scope.row.orderInquiryStatus!='已关闭'&&scope.row.orderInquiryStatus!='已转订单'">关闭</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>

				<template v-for="(item,index) in tableColumns">
					<el-table-column v-if="item.label=='询价单号'" :key="index" :label="item.label" :prop="item.prop" :width="item.width" :align="item.align" :sortable="item.sortable">
						<template slot-scope="scope">
							<a href="javascript:void(0)" @click="orderInquiryCodeCellClick(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row[item.prop]}}</a>
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.label=='是否特货'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
						<template slot-scope="scope">
							<span style="color: red;">{{scope.row[item.prop].split('/')[0]}}</span>
							<span> / </span>
							<span style="color: red;">{{scope.row[item.prop].split('/')[1]}}</span>
						</template>
					</el-table-column>
					<el-table-column v-else :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					</el-table-column>
				</template>
			</el-table>
		</div>
		<div>
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<saveTag ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="frow"></saveTag>
		<editTag ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></editTag>
		<copyTag ref="addMission" v-if="copyVisible" :visible.sync="copyVisible" :frow="frow"></copyTag>
		<quotationTag ref="addMission" v-if="quotationVisible" :visible.sync="quotationVisible" :frow="frow"></quotationTag>
		<qrcodeTag ref="addMission" v-if="qrcodeVisible" :visible.sync="qrcodeVisible" :frow="frow"></qrcodeTag>
		<sendQrcodeTag ref="addMission" v-if="sendQrcodeVisible" :visible.sync="sendQrcodeVisible" :frow="frow"></sendQrcodeTag>
		<setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible"></setVisibleTag>
	</div>
</template>
<script>
	import SaveTag from './orderInquiry/main/save';
	import EditTag from './orderInquiry/main/edit';
	import CopyTag from './orderInquiry/main/copy';
	import QuotationTag from './orderInquiry/other/inquiry_quotation_plan';
	import QrcodeTag from './orderInquiry/other/qrcode';
	import SendQrcodeTag from './orderInquiry/other/sendQrcode';
	import setVisibleVue from './orderInquiry/other/inquiry_order_setting'
	import columns from './orderInquiry/other/inquiry_order_column.json'

	export default {
		data() {
			return {
				loading: false,
				data: [],
				tableColumns: [],
				orderInquiryStatusList: ['已创建', '已收方案'],
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
					departureStation: '',
					arrivalStation: '',
					editTimeBegin: '',
					editTimeEnd: '',
					orderInquiryStatus: '',
					editorName: '',
					columnStrs: ''
				},
				saveVisible: false,
				editVisible: false,
				copyVisible: false,
				quotationVisible: false,
				qrcodeVisible: false,
				sendQrcodeVisible: false,
				setVisible: false,
				showFlag: false,
				frow: {}
			}
		},
		created: function() {
			if (this.$route.query.flag) {
				if (this.$route.query.name == 'quotation') {
					this.frow = JSON.parse(this.base64Decode(this.$route.query.frow))
					this.quotationVisible = true
				}
				if(this.$route.query.name == 'saveCallBackForYC'){
					this.frow.exist = true
					this.frow.departureStation=this.$route.query.departure
					this.frow.arrivalStation=this.$route.query.destination
					this.frow.planWeight=this.$route.query.grossWeight
					this.frow.planVolume=this.$route.query.volume
					this.frow.expectDeparture=this.$route.query.flightDate
					this.frow.carrierCode=this.$route.query.airline
					this.frow.planPieces=this.$route.query.pieces
					this.saveVisible = true
				}
			}

      //从数据库查询设置信息
      let pageName = '订单操作管理/在线询价/询价管理';
      this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
          .then(function(response) {
              let inquiry_list_column = response.data.data;
              if(inquiry_list_column && inquiry_list_column.length>0){
                  this.tableColumns = this.sortBykey(inquiry_list_column, 'index');
              }else{
                  this.tableColumns = this.sortBykey(columns.inquiryOrder, 'index');
              }
          }.bind(this));

	/*		let userId = window.localStorage.getItem('userId')
			let inquiry_order_column = window.localStorage.getItem(userId + '_af_inquiry_order_column')
			if (inquiry_order_column) {
				let arrayC = JSON.parse(inquiry_order_column)
				if (arrayC && arrayC.length > 0) {
					this.tableColumns = this.sortBykey(arrayC, 'index')
				}
			} else {
				this.tableColumns = this.sortBykey(columns.inquiryOrder, 'index')
			}*/
		},
		provide() {
			return {
				findByPage: this.queryList,
				ifShareQrcode: this.ifShareQrcode
			}
		},
		components: {
			'saveTag': SaveTag,
			'editTag': EditTag,
			'copyTag': CopyTag,
			'quotationTag': QuotationTag,
			'qrcodeTag': QrcodeTag,
			'setVisibleTag': setVisibleVue,
			'sendQrcodeTag': SendQrcodeTag
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
					path: "/af_order_inquiry",
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
			queryList() {
        //从数据库查询设置信息
        let pageName = '订单操作管理/在线询价/询价管理';
        this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
            .then(function(response) {
                let inquiry_list_column = response.data.data;
                if(inquiry_list_column && inquiry_list_column.length>0){
                    this.tableColumns = this.sortBykey(inquiry_list_column, 'index');
                }else{
                    this.tableColumns = this.sortBykey(columns.inquiryOrder, 'index');
                }
                this.loading = true
                this.query.orderInquiryStatus = this.orderInquiryStatusList.join()
                this.query.columnStrs = ''
                this.$axios.get2('/afbase/orderInquiry?size=' + this.pageConf.pageSize + '&current=' + this.pageConf.pageCode, this.query).then((response) => {
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
                });
            }.bind(this));

/*				let userId = window.localStorage.getItem('userId');
				let inquiry_order_column = window.localStorage.getItem(userId + '_af_inquiry_order_column');
				if (inquiry_order_column) {
					let arrayC = JSON.parse(inquiry_order_column)
					if (arrayC && arrayC.length > 0) {
						this.tableColumns = this.sortBykey(arrayC, 'index');
					}
				} else {
					this.tableColumns = this.sortBykey(columns.inquiryOrder, 'index');
				}
				this.loading = true
				this.query.orderInquiryStatus = this.orderInquiryStatusList.join()
				this.query.columnStrs = ''
				this.$axios.get2('/afbase/orderInquiry?size=' + this.pageConf.pageSize + '&current=' + this.pageConf.pageCode, this.query).then((response) => {
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
				});*/
			},
			queryList2(current) {
				this.$axios.get2('/afbase/orderInquiry?size=' + this.pageConf.pageSize + '&current=' + current, this.query).then((response) => {
					this.data = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
					this.loading = false
				})
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
				this.saveVisible = true;
			},
			stop() {
				this.$confirm('你确定要关闭该询价单吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.put('/afbase/orderInquiry/stop/' + this.frow.orderInquiryId)
						.then((response) => {
							if (response.data.code == 0) {
								this.openSuccess('关闭成功');
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
			showTwoCode(orderInquiryId, flag) {
				this.$axios.get('/afbase/orderInquiry/' + orderInquiryId)
					.then((response) => {
						if (response.data.code == 0 && response.data.data && response.data.data.orderInquiryStatus == '已创建') {
							if (flag) {
								this.frow = response.data.data
								if (response.data.data.inquiryAgentIds) {
									this.sendQrcodeVisible = true
								} else {
									this.qrcodeVisible = true
								}
							} else {
								this.qrcodeVisible = true
							}
						} else {
							this.openError('该询价单已转单或已关闭，无法分享')
						}
					});
			},
			sendTwoCode() {
				this.$axios.get('/afbase/orderInquiry/' + this.frow.orderInquiryId)
					.then((response) => {
						if (response.data.code == 0 && response.data.data && response.data.data.orderInquiryStatus == '已创建' && response.data.data.inquiryAgentIds) {
							this.sendQrcodeVisible = true
						} else {
							this.openError('该询价单无法发送询盘')
						}
					});
			},
			orderInquiryCodeCellClick(row) {
				this.frow = row
				if(localStorage.getItem("orderEditNewPage")&&localStorage.getItem("orderEditNewPage")=='true'){
					this.frow.ifFullscreen = true
				    this.jumpToNewPage('quotation', this.frow)
				}else{
					this.frow.ifFullscreen = false
				this.quotationVisible = true
				}
			},
			ifShareQrcode(orderInquiryId) {
				// this.$confirm('是否弹出分享窗口?', '提示', {
				// 	confirmButtonText: '是',
				// 	cancelButtonText: '否',
				// 	type: 'warning',
				// 	center: true
				// }).then(() => {
				// }).catch(() => {

				// });
					this.showTwoCode(orderInquiryId, true)
			},
			export (orderInquiryId) {
				//this.openError('功能暂未开放，敬请期待')
        this.$axios.post3('/afbase/orderInquiry/exportInquiryQuotationExcel/' + orderInquiryId)
            .then(function(response) {
                var blob = new Blob([response.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
                });
                var downloadElement = document.createElement('a');
                var href = window.URL.createObjectURL(blob); // 创建下载的链接
                downloadElement.href = href;
                downloadElement.download = '询报价单.xlsx'; // 下载后文件名
                document.body.appendChild(downloadElement);
                downloadElement.click(); // 点击下载
                document.body.removeChild(downloadElement); // 下载完成移除元素
                window.URL.revokeObjectURL(href); // 释放掉blob对象
            }.bind(this));
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
					let excelList = this.sortBykey(columns.inquiryOrder, 'index')
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
					localStorage.setItem(userId + '_inquiry_list_column_width', JSON.stringify(arrayC))
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
			handleCommand(command) {
				if ("edit" == command) {
					this.editVisible = true;
				} else if ("showTwoCode" == command) {
					this.showTwoCode(this.frow.orderInquiryId, false)
				} else if ("send" == command) {
					this.sendTwoCode()
				} else if ("stop" == command) {
					this.stop()
				} else if ("copy" == command) {
					this.copyVisible = true
				} else if ("export" == command) {
					this.export(this.frow.orderInquiryId)
				}
			},
			handleChange(row) {
				this.frow = row;
			}
		}
	}
</script>
<style type="text/css">
	.afOrderInquiry-ruleForm .el-input__icon {
		line-height: 30px !important;
	}

	.afOrderInquiry-ruleForm .el-form-item__content {
		line-height: 30px !important;
	}

	.afOrderInquiry-ruleForm .el-input-group__prepend {
		padding: 0 6px;
	}
</style>
