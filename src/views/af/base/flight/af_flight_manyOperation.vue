<template>
	<el-dialog title="航班 - 批量操作" width="1350px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<el-form>
			<el-table :data="tableData">
				<el-table-column align="center" label="航次(星期)" width="420">
					<template slot-scope="scope">
						<el-select v-model="scope.row.weekNum" multiple style="width: 400px;">
							<el-option label="一" value="1">
								<span>星期一</span>
							</el-option>
							<el-option label="二" value="2">
								<span>星期二</span>
							</el-option>
							<el-option label="三" value="3">
								<span>星期三</span>
							</el-option>
							<el-option label="四" value="4">
								<span>星期四</span>
							</el-option>
							<el-option label="五" value="5">
								<span>星期五</span>
							</el-option>
							<el-option label="六" value="6">
								<span>星期六</span>
							</el-option>
							<el-option label="日" value="7">
								<span>星期日</span>
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column align="center" label="中转港" width="70">
					<template slot-scope="scope">
						<el-input v-model="scope.row.transitStation" @input="scope.row.transitStation=scope.row.transitStation.toUpperCase()" maxlength="4"></el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" label="目的港" width="70">
					<template slot-scope="scope">
						<el-input v-model="scope.row.arrivalStation" @input="scope.row.arrivalStation=scope.row.arrivalStation.toUpperCase()" maxlength="4"></el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" label="机型">
					<template slot-scope="scope">
						<el-input v-model="scope.row.aircraftTypeRemark" maxlength="20" @change="changeAircraftTypeRemark(scope.row)"></el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" label="客机/货机" width="90">
					<template slot-scope="scope">
						<el-select v-model="scope.row.aircraftTypePc">
							<el-option label="客机" value="k"></el-option>
							<el-option label="货机" value="h"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column align="center" label="宽体/窄体" width="90">
					<template slot-scope="scope">
						<el-select v-model="scope.row.aircraftTypeBn">
							<el-option label="宽体" value="k"></el-option>
							<el-option label="窄体" value="z"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column align="center" label="截单时间" width="110">
					<template slot-scope="scope">
						<el-time-picker v-model="scope.row.cutoffTime" format="HH:mm" value-format="HH:mm" style="width: 98px;" @change="changeCutOffTime(scope.row)">
						</el-time-picker>
					</template>
				</el-table-column>
				<el-table-column align="center" label="截单D-1">
					<template slot-scope="scope">
						<el-checkbox v-model="scope.row.cutoffTime1"></el-checkbox>
					</template>
				</el-table-column>
				<el-table-column align="center" label="起飞时间" width="110">
					<template slot-scope="scope">
						<el-time-picker v-model="scope.row.takeoffTime" format="HH:mm" value-format="HH:mm" @change="changeTakeoffTime(scope.row)" style="width: 98px;">
						</el-time-picker>
					</template>
				</el-table-column>
				<el-table-column align="center" label="到达时间" width="110">
					<template slot-scope="scope">
						<el-time-picker v-model="scope.row.arrivalTime" format="HH:mm" value-format="HH:mm" @change="changeArriveTime(scope.row)" style="width: 98px;">
						</el-time-picker>
					</template>
				</el-table-column>
				<el-table-column align="center" label="到达D+1">
					<template slot-scope="scope">
						<el-checkbox v-model="scope.row.arrivalTime1"></el-checkbox>
					</template>
				</el-table-column>
			</el-table>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-button size="mini" type="primary" @click="cancel" style="margin-left: 10px;" plain="">取消</el-button>
						<el-button size="mini" type="primary" @click="submit" style="margin-left: 10px;">保存</el-button>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</el-dialog>
</template>
<script>
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				tableData: []
			}
		},
		inject: ['manyOperationCallback'],
		methods: {
			changeTakeoffTime(row) {
				this.changeCutOffTime(row)
				let takeoffTime = row['takeoffTime'];
				if (takeoffTime) {
					let olddate = new Date(2011, 6, 13, takeoffTime.substring(0, 2), takeoffTime.substring(3, 5), 0, 0); // create a date of Jun 15/2011, 08:32:00am，年月日是多少无所谓
					let subbed = new Date(olddate - 6 * 60 * 60 * 1000); // subtract 6 hours
					let hour = "";
					let minutes = "";
					if (subbed.getHours() < 10) {
						hour = "0" + subbed.getHours();
					} else {
						hour = subbed.getHours();
					}
					if (subbed.getMinutes() < 10) {
						minutes = "0" + subbed.getMinutes();
					} else {
						minutes = subbed.getMinutes();
					}
					let newtime = hour + ':' + minutes;
					row['cutoffTime'] = newtime;
					//判断截单时间D-1是否选中
					if (takeoffTime.substring(0, 1) == 0) {
						if (takeoffTime.substring(1, 2) < 6) {
							row['cutoffTime1'] = true;
						} else {
							row['cutoffTime1'] = false;
						}
					} else {
						row['cutoffTime1'] = false;
					}
					let arrivalTime = row['arrivalTime'];
					if (arrivalTime) {
						if (takeoffTime >= arrivalTime) {
							row['arrivalTime1'] = true;
						} else {
							row['arrivalTime1'] = false;
						}
					}
				}
			},
			changeArriveTime(row) {
				let takeoffTime = row['takeoffTime'];
				let arrivalTime = row['arrivalTime'];
				if (takeoffTime >= arrivalTime) {
					row['arrivalTime1'] = true;
				} else {
					row['arrivalTime1'] = false;
				}

			},
			changeCutOffTime(row) {
				let cutoffTime = row['cutoffTime'];
				let takeoffTime = row['takeoffTime'];
				if (takeoffTime) {
					if (cutoffTime > takeoffTime) {
						row['cutoffTime1'] = true;
					} else {
						row['cutoffTime1'] = false;
					}
				} else {
					row['cutoffTime1'] = false;
				}
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
			submit() {
				this.manyOperationCallback(this.tableData[0])
				this.handleClose()
			},
			cancel() {
				this.handleClose()
			},
			changeAircraftTypeRemark(row) {
				if (row.aircraftTypeRemark) {
					this.$axios.get('/afbase/aircraft/getOneByType/' + row.aircraftTypeRemark)
						.then((response) => {
							if (response.data.code == 0) {
								if (response.data.data != null && response.data.data.aircraftTypePc == '窄体') {
									row.aircraftTypeBn = 'z'
								} else if (response.data.data != null && response.data.data.aircraftTypePc == '宽体') {
									row.aircraftTypeBn = 'k'
								}
							} else {
								this.openError(response.data.messageInfo);
							}
						}).catch((error) => {
							let errorinfo = error.response.data.messageInfo;
							this.openError(errorinfo);
						});
				}
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},
		},
		created() {
			this.tableData.push({
				"weekNum": ["1", "2", "3", "4", "5", "6", "7"],
				"transitStation": "",
				"arrivalStation": "",
				"aircraftTypePc": "k",
				"aircraftTypeBn": "z",
				"aircraftTypeRemark": "",
				"cutoffTime": "",
				"cutoffTime1": false,
				"takeoffTime": "",
				"arrivalTime": "",
				"arrivalTime1": false
			});
		}
	}
</script>
