# vue-vuecmf-table

> 基于vue2和element-ui的列表组件，内置搜索、筛选、分页、导出EXCEL等功能
> 由于vuecmf-table使用组件调整为iview,  所以从vuecmf-table的1.0.6版本分出来，此版本使用的组件为element-ui

## 安装

``` bash
# yarn方式安装 vue-vuecmf-table
yarn add vue-vuecmf-table

# npm方式安装 vue-vuecmf-table
npm install vue-vuecmf-table
```

## 项目中引入
```
import vcTable from 'vue-vuecmf-table'
Vue.use(vcTable)
```
## 模板中使用组件
```
    <vc-table  :edit="true" :del="true" :selectable="selectable" :checkbox="true"  ref="vcTable"  :cell-event="cellEvent" :row-action="rowAction" server="http://www.vuecmf.com/api/model_field" page="page" :limit="20"  :operate-width="200">
      <template v-slot:headerAction>
        <el-button size="mini" type="primary" @click.native.prevent="add" >添加</el-button>
      </template>
    </vc-table>

```
详细使用见 源码中 src/App.vue

## 后端返回JSON 数据样例：
### 字段数据样例
后端接收前端POST数据中 action = getField
返回JSON
```
{
    code:0,
    msg:'拉取成功',
    "data":{
        "fields": [
            {
                "prop": "id",  //字段名称
                "label": "",  //表头显示名称
                "data_type": "int", //字段值类型
                "sortable": true, //是否可排序
                "show": false, //默认是否在表格中显示
                "fixed": false, //是否固定列
                "filter": false //是否可筛选
            },
            {
                "prop": "inquiry_sheet_id",
                "label": "inquiry_sheet的id",
                "data_type": "hidden",
                "sortable": true,
                "show": false,
                "fixed": false,
                "filter": false
            },
            {
                "prop": "sku",
                "label": "sku",
                "data_type": "string",
                "sortable": true,
                "show": true,
                "fixed": false,
                "filter": true
            }
        }

 }
```

### 列表数据样例
```
{
    code:0,
    msg:'拉取成功',
    "data":{
        "total": 53,
        "last_page": 3,
        "data": [
            {
                "id": "63",
                "sku": "DEALT001",
                "area": "欧洲区",
                "sku_name": "VC泡腾片 樱桃味 20片",
                "upc": "4305615274539",
                "unit": "瓶",
                "currency": "1",
                "quantity": "100",
                "unit_price": "85.0000",
                "status": "10",
                "expandData":{
                    "type":"table",
                    "tableFields":[
                        {"label":"需求单号","prop":"order_sn"},
                        {"label":"调拨类型","prop":"type"},
                        {"label":"计划数量","prop":"num"}
                    ],
                    "tableList":[
                        {"order_sn":"dbd903452","type":"POP","num":300},
                        {"order_sn":"dbd123123","type":"POP","num":400},
                        {"order_sn":"dbd144155","type":"POP","num":580}
                    ]
                }
            },
            {
                "id": "62",
                "sku": "DEAB019",
                "area": "欧洲区",
                "sku_name": "南瓜籽蔓越莓胶囊 30粒",
                "upc": "4250752201118/4026600561310",
                "unit": "盒",
                "currency": "4",
                "quantity": "200",
                "unit_price": "33.0000",
                "status": "10",
                "expandData":{
                    "type":"table",
                    "tableFields":[
                        {"label":"需求单号","prop":"order_sn"},
                        {"label":"调拨类型","prop":"type"},
                        {"label":"计划数量","prop":"num"}
                    ],
                    "tableList":[
                        {"order_sn":"dbd903452","type":"POP","num":300},
                        {"order_sn":"dbd123123","type":"POP","num":400},
                        {"order_sn":"dbd144155","type":"POP","num":580}
                    ]
                }
            },
            {
                "id": "60",
                "sku": "DEALT002",
                "area": "欧洲区",
                "sku_name": "VC泡腾片 香橙味 微量元素 20片",
                "upc": "4305615205298",
                "unit": "瓶",
                "currency": "3",
                "quantity": "300",
                "unit_price": "50.0000",
                "status": "10",
                "expandData":{
                    "type":"table",
                    "tableFields":[
                        {"label":"需求单号","prop":"order_sn"},
                        {"label":"调拨类型","prop":"type"},
                        {"label":"计划数量","prop":"num"}
                    ],
                    "tableList":[
                        {"order_sn":"dbd903452","type":"POP","num":300},
                        {"order_sn":"dbd123123","type":"POP","num":400},
                        {"order_sn":"dbd144155","type":"POP","num":580}
                    ]
                }
            }      
        ]
    }
}
```
