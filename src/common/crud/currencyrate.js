/*
 
 * Author:zhanghw
 */

export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  column: [
	  // {
    //   label: '汇率id',
    //   prop: 'crId'
    // },
	  // {
    //   label: '签约公司id',
    //   prop: 'orgId'
    // },
	  {
      label: '币种代码',
      prop: 'currencyCode'
    },
	  {
      label: '汇率',
      prop: 'currencyRate'
    },
	  {
      label: '生效日期',
      prop: 'beginDate'
    },
	  {
      label: '失效日期',
      prop: 'endDate'
    },
	  {
      label: '创建人',
      prop: 'creatorId'
    },
	  {
      label: '创建时间',
      prop: 'createTime'
    },
  ]
}
