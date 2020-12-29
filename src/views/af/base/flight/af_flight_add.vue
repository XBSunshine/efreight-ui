<template>
	<el-dialog title="航班 - 新增" width="1150px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="afFlightAdd-ruleForm">
			<el-row>
				<el-col class="elementWidth">
          <el-form-item label-width="10px" prop="flightNumber">
            <el-input v-model="ruleForm.flightNumber" auto-complete="off" @input="ruleForm.flightNumber=ruleForm.flightNumber.toUpperCase()" style="width: 160px;" clearable>
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>航班号</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item label-width="10px" prop="departureStation">
            <el-input v-model="ruleForm.departureStation" auto-complete="off" @input="ruleForm.departureStation=ruleForm.departureStation.toUpperCase()" style="width: 160px;" clearable>
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>始发港</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item prop="beginDate" label-width="15px">
            <el-input style="width:234px;">
              <template slot="prepend">
                <span style="color: red;">*</span>
                <span>生效日期</span>
              </template>
              <el-date-picker slot="suffix" style="width: 156px;margin-right: -5px;" v-model="ruleForm.beginDate" clearable type="date" value-format="yyyy-MM-dd"
                              placeholder="选择开始时间">
              </el-date-picker>
            </el-input>
            &nbsp;&nbsp;&nbsp;-
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item prop="endDate" label-width="15px">
            <el-input style="width:146px;">
              <el-date-picker slot="suffix" style="width: 146px;margin-right: -5px;" v-model="ruleForm.endDate" clearable type="date" value-format="yyyy-MM-dd"
                              placeholder="选择结束时间">
              </el-date-picker>
            </el-input>
          </el-form-item>
        </el-col>
				<el-col class="elementWidth">
					<el-form-item style="margin-left: 20px;">
						<el-button size="mini" type="primary" @click="AddListRow" plain>增加航次</el-button>
						<el-button size="mini" type="primary" @click="doManyOperation">批量维护</el-button>
					</el-form-item>
				</el-col>
			</el-row>

			<el-table :data="tableData" style="width:100%;margin-top: 5px;margin-bottom: 15px;">
				<el-table-column align="center" label="操作" width="60">
					<template slot-scope="scope">
						<el-button size="mini" type="danger" @click="handleDelete(scope.$index)">删除</el-button>
					</template>
				</el-table-column>
				<el-table-column align="center" label="航次">
					<template slot-scope="scope">
						<el-select v-model="scope.row.weekNum" style="width: 90px;">
							<el-option label="星期一" value="1"></el-option>
							<el-option label="星期二" value="2"></el-option>
							<el-option label="星期三" value="3"></el-option>
							<el-option label="星期四" value="4"></el-option>
							<el-option label="星期五" value="5"></el-option>
							<el-option label="星期六" value="6"></el-option>
							<el-option label="星期日" value="7"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column align="center" label="中转港" width="70">
					<template slot-scope="scope">
						<el-input v-model="scope.row.transitStation" @input="scope.row.transitStation=scope.row.transitStation.toUpperCase()"></el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" label="目的港" width="70">
					<template slot-scope="scope">
						<el-input v-model="scope.row.arrivalStation" @input="scope.row.arrivalStation=scope.row.arrivalStation.toUpperCase()"></el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" label="机型">
					<template slot-scope="scope">
						<el-input v-model="scope.row.aircraftTypeRemark" maxlength="20"></el-input>
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
				<el-table-column align="center" label="截单时间D-1">
					<template slot-scope="scope">
						<el-checkbox v-model="scope.row.cutoffTime1"></el-checkbox>
					</template>
				</el-table-column>
				<el-table-column align="center" label="起飞时间" width="110">
					<template slot-scope="scope">
						<el-time-picker v-model="scope.row.takeoffTime" format="HH:mm" value-format="HH:mm" style="width: 98px;" @change="changeTakeoffTime(scope.row)">
						</el-time-picker>
					</template>
				</el-table-column>
				<el-table-column align="center" label="到达时间" width="110">
					<template slot-scope="scope">
						<el-time-picker v-model="scope.row.arrivalTime" format="HH:mm" value-format="HH:mm" style="width: 98px;" @change="changeArriveTime(scope.row)">
						</el-time-picker>
					</template>
				</el-table-column>
				<el-table-column align="center" label="到达时间D+1">
					<template slot-scope="scope">
						<el-checkbox v-model="scope.row.arrivalTime1"></el-checkbox>
					</template>
				</el-table-column>
			</el-table>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-button size="small" :loading="loading" type="primary" @click="submitForm('ruleForm')" style="margin-left: 10px;">保存</el-button>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<manyOperation v-if="manyOperationVisible" :visible.sync="manyOperationVisible"></manyOperation>
	</el-dialog>
</template>
<script>
	import ManyOperation from "./af_flight_manyOperation.vue"
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
				ruleForm: {
					flightNumber: '',
					departureStation: '',
					beginDate: '',
					endDate: '',
					flightDetails: []
				},
				loading: false,
				manyOperationVisible: false,
				tableData: [],
				rules: {
					flightNumber: [{
							required: true,
							message: '请输入航班号',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 7,
							message: '航司二字码长度不超过 7',
							trigger: ['blur', 'change']
						}
					],
					departureStation: [{
							required: true,
							message: '请输入始发港',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 4,
							message: '航司二字码长度不超过 4',
							trigger: ['blur', 'change']
						}
					],
          beginDate: [{
            required: true,
            message: '请输入生效起始日期',
            trigger: ['blur', 'change']
          }],
          endDate: [{
            required: true,
            message: '请输入生效结束日期',
            trigger: ['blur', 'change']
          }]
				}
			};
		},
		components: {
			'manyOperation': ManyOperation
		},
		provide() {
			return {
				manyOperationCallback: this.manyOperationCallback
			}
		},
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
				if(takeoffTime){
					if (cutoffTime > takeoffTime) {
						row['cutoffTime1'] = true;
					} else {
						row['cutoffTime1'] = false;
					}
				}else{
					row['cutoffTime1'] = false;
				}
			},
			AddListRow() {
				this.tableData.push({
					"weekNum": "",
					"transitStation": "",
					"arrivalStation": "",
					"aircraftTypePc": "k",
					"aircraftTypeBn": 'z',
					"aircraftTypeRemark": '',
					"cutoffTime": '',
					"cutoffTime1": '',
					"takeoffTime": '',
					"arrivalTime": '',
					"arrivalTime1": ''
				});
			},
			handleDelete(index) {
				this.tableData.splice(index, 1);
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
			submitForm(formName) {
				if (this.tableData.length == 0) {
					this.openError("请添加航次")
					return
				}
				this.ruleForm.flightDetails = this.tableData;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let params = this.ruleForm;
						this.$axios.post2('/afbase/flight/doSave', params)
							.then(function(response) {
								if (response.data.code == 0) {
									this.openSuccess();
									this.handleClose();
								} else {
									this.openError(response.data.messageInfo);
								}
							}.bind(this)).catch(function(error) {
								let errorinfo = error.response.data.messageInfo;
								this.openError(errorinfo);
							}.bind(this));
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			manyOperationCallback(value) {
				this.tableData = []
				value.weekNum.forEach(row => {
					this.tableData.push({
						"weekNum": row,
						"transitStation": value.transitStation,
						"arrivalStation": value.arrivalStation,
						"aircraftTypePc": value.aircraftTypePc,
						"aircraftTypeBn": value.aircraftTypeBn,
						"aircraftTypeRemark": value.aircraftTypeRemark,
						"cutoffTime": value.cutoffTime,
						"cutoffTime1": value.cutoffTime1,
						"takeoffTime": value.takeoffTime,
						"arrivalTime": value.arrivalTime,
						"arrivalTime1": value.arrivalTime1
					})
				})
			},
			doManyOperation() {
				this.manyOperationVisible = true
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},
		},
		created() {
			this.tableData.push({
				"weekNum": "1",
				"transitStation": "",
				"arrivalStation": "",
				"aircraftTypePc": "k",
				"aircraftTypeBn": 'z',
				"aircraftTypeRemark": '',
				"cutoffTime": '',
				"cutoffTime1": '',
				"takeoffTime": '',
				"arrivalTime": '',
				"arrivalTime1": ''
			});
			this.tableData.push({
				"weekNum": "2",
				"transitStation": "",
				"arrivalStation": "",
				"aircraftTypePc": "k",
				"aircraftTypeBn": 'z',
				"aircraftTypeRemark": '',
				"cutoffTime": '',
				"cutoffTime1": '',
				"takeoffTime": '',
				"arrivalTime": '',
				"arrivalTime1": ''
			});
			this.tableData.push({
				"weekNum": "3",
				"transitStation": "",
				"arrivalStation": "",
				"aircraftTypePc": "k",
				"aircraftTypeBn": 'z',
				"aircraftTypeRemark": '',
				"cutoffTime": '',
				"cutoffTime1": '',
				"takeoffTime": '',
				"arrivalTime": '',
				"arrivalTime1": ''
			});
			this.tableData.push({
				"weekNum": "4",
				"transitStation": "",
				"arrivalStation": "",
				"aircraftTypePc": "k",
				"aircraftTypeBn": 'z',
				"aircraftTypeRemark": '',
				"cutoffTime": '',
				"cutoffTime1": '',
				"takeoffTime": '',
				"arrivalTime": '',
				"arrivalTime1": ''
			});
			this.tableData.push({
				"weekNum": "5",
				"transitStation": "",
				"arrivalStation": "",
				"aircraftTypePc": "k",
				"aircraftTypeBn": 'z',
				"aircraftTypeRemark": '',
				"cutoffTime": '',
				"cutoffTime1": '',
				"takeoffTime": '',
				"arrivalTime": '',
				"arrivalTime1": ''
			});
			this.tableData.push({
				"weekNum": "6",
				"transitStation": "",
				"arrivalStation": "",
				"aircraftTypePc": "k",
				"aircraftTypeBn": 'z',
				"aircraftTypeRemark": '',
				"cutoffTime": '',
				"cutoffTime1": '',
				"takeoffTime": '',
				"arrivalTime": '',
				"arrivalTime1": ''
			});
			this.tableData.push({
				"weekNum": "7",
				"transitStation": "",
				"arrivalStation": "",
				"aircraftTypePc": "k",
				"aircraftTypeBn": 'z',
				"aircraftTypeRemark": '',
				"cutoffTime": '',
				"cutoffTime1": '',
				"takeoffTime": '',
				"arrivalTime": '',
				"arrivalTime1": ''
			});

		}
	}
</script>
<style type="text/css">

  .afFlightAdd-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .afFlightAdd-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .afFlightAdd-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }

</style>
