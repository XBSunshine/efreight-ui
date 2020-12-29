<template>
	<div class="warp-main">
		<div>
			<el-form :inline='true' label-width="80px">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="业务范畴">
							<el-select v-model="query.businessScope" placeholder="请选择" @change="getPage" style="width: 80px;">
								<el-option v-for="(item,index) in params" :key="index" :label="item.paramText" :value="item.paramText"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div>
			<el-table v-loading="loading" :indent="30" row-key="id" :tree-props="{children: 'children'}" stripe :data="data1" style="width: 100%;" border>
				<el-table-column header-align="center" prop="financialAccountName" label="科目名称" width="320">
				</el-table-column>
				<el-table-column align="center" prop="financialAccountCode" label="科目代码">
				</el-table-column>
				<el-table-column align="center" prop="manageMode" label="管理模式" :formatter="manageModeFormat">
				</el-table-column>
				<el-table-column align="left" prop="subsidiaryAccount" label="辅助账设置" :formatter="subsidiaryAccountFormat">
				</el-table-column>
				<el-table-column align="center" label="是否启用" width="70">
          <template slot-scope="scope">
            <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.isValid"></i>
          </template>
				</el-table-column>
				<el-table-column align="left" prop="accountRemark" label="备注" >
				</el-table-column>
        <el-table-column align="left" prop="editorName" label="操作人" >
        </el-table-column>
        <el-table-column align="left" prop="editTime" label="操作时间" >
        </el-table-column>

				<el-table-column fixed="left" label="操作" align="center" width="50" type="index">
					<template slot-scope="scope">
						<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="save" v-if="scope.row.financialAccountClass01 ===1">新增子科目</el-dropdown-item>
								<el-dropdown-item command="edit">编辑</el-dropdown-item>
                <el-dropdown-item command="delete" v-if="scope.row.parentId !==0">删除</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<save ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="frow"></save>
		<edit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></edit>
	</div>
</template>

<script>
	import Save from './af_financial_account_save'
	import Edit from './af_financial_account_edit'
	export default {
		data() {
			return {
				data1: [],
				params: [],
				query: {
					businessScope: ''
				},
				currRow: '',
				saveVisible: false,
				editVisible: false,
				loading: false,
				frow: '',
			}
		},
		created() {
			this.init();
		},
    inject:['reload'],
    components: {
			'save': Save,
			'edit': Edit
		},
		provide() {
			return {
				getPage: this.getPage
			}
		},
		methods: {
      manageModeFormat(row, column) {
          if(row.children.length !== 0){
             return '';
          }else{
              return row.manageMode;
          }
      },
      subsidiaryAccountFormat(row, column){
          if(row.children.length !== 0){
              return '';
          }else{
              return row.subsidiaryAccount;
          }
      },
			handleCommand(command) {
				if(command == 'edit') {
					this.showedit(this.currRow)
				} else if(command == 'save') {
					if(this.query.businessScope == '') {
						this.openError("请选择业务范畴才能操作", "操作")
						return
					}
					this.showsave(this.currRow)
				}else if(command == "delete"){
				  this.deleteFinancialAccount(this.currRow);
        }
			},
      deleteFinancialAccount(row){
          if(row.children.length !== 0){
              this.openError("该科目包含子科目，请先删除子科目。","删除");
          }else{
              this.$confirm('是否确认删除该科目代码？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                  center: true
              }).then(() => {
                  this.$axios.deletes('/afbase/financialAccount/delete/' + row['id'])
                      .then(function(response) {
                          if(response.data.code == 0) {
                              localStorage.setItem('businessScope', this.query.businessScope);
                              this.openSuccess();
                              this.reload();
                              // this.$router.go(0)
                              //this.$router.push('/af_financial_account');
                              //this.$router.go(0);
                              /*let routeUrl = this.$router.resolve({
                                  path: "/af_financial_account",
                              });
                              window.open(routeUrl.href, '_self');*/
                             // window.location.reload()
                              //this.getPage();
                          } else {
                              this.openError(response.data.messageInfo);
                          }
                      }.bind(this));
              }).catch((e) => {

              });
          }
      },
			handleChange(command) {
				this.currRow = command
			},
			showsave(row) {
				this.frow = row;
				this.frow.businessScope = this.query.businessScope
				this.saveVisible = true;
			},
			showedit(row) {
				this.frow = row;
				this.editVisible = true;
			},
			getPage() {
				this.loading = true;
				this.$axios.get2('/afbase/financialAccount', this.query).then(function(response) {
					if(response.data.code == '0') {
						this.data1 = response.data.data;
					} else {
						this.openError(response.data.messageInfo, "查询");
					}
					this.loading = false
				}.bind(this)).catch(function(error) {
					this.loading = false
					console.log(error);
				});
			},
			openSuccess() {
				this.$notify({
					title: '',
					message: '操作成功',
					type: 'success',
					position: 'bottom-right'
				});
			},
			openError(info, flag) {
				this.$notify({
					title: '',
					message: flag + '失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			init() {
				this.$axios.get2('/afbase/service/businessScope' ).then((response) => {
					if(response.data.code == '0'){
						this.params = response.data.data;
						if(this.params && this.params[0]){
                this.query.businessScope = this.params[0].paramText || "";
            }
					} else {
						this.openError(response.data.messageInfo, "查询业务范畴")
					}
          let businessScope = localStorage.getItem("businessScope")
          if(businessScope){
              this.query.businessScope = businessScope
          }else{
              this.query.businessScope = 'AE'
          }
				}).catch(function(error) {
					console.log(error);
				}).then(()=>{
				    this.getPage();
        });
			},
		}
	}
</script>
<style scoped="scoped">

</style>
