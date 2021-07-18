# vue-vuecmf-table

> 基于vue2和element-ui的列表组件，内置搜索、筛选、分页、行展开、导出和导入EXCEL等功能

项目说明：由于vuecmf-table使用组件调整为iview,  所以针对element-ui用户特从vuecmf-table的1.0.6版本分出来，使用组件为element-ui

- 示例演示： http://www.vuecmf.com

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
<vc-table
            table-name="会员列表"
            :selectable="selectable"
            :checkbox="true"
            ref="vcTable"
            server="http://www.xxxxxx.com/api/Table/index"
            page="page"
            :limit="20"
            :operate-width="100"
            import-server="http://www.xxxxxx.com/api/Table/importData"
            :expand="true"
    >
      <!-- 表格头部左边 自定义按钮操作 -->
      <template #headerAction="selectRows">
          <el-button size="mini" type="primary" @click.native.prevent="add(selectRows)" >添加</el-button>
      </template>

      <!-- 列表每行 自定义按钮操作 -->
      <template #rowAction="{ row, index}">
          <span v-if=" row.site != '' ">
              有站点
          </span>
          <el-button v-else size="mini" type="success" @click.native.prevent="test(row)">test {{ index }}</el-button>
      </template>

      <!-- 每行中的每个字段内容 自定义格式化内容显示： 可获取参数有 { row, field, type, options } -->
      <template #formatRow="{ row, field }">
          <span v-if=" field == 'child_account_name' ">
              <el-input v-model="row[field]" size="small" clearable></el-input>
          </span>
      </template>

    </vc-table>

```
详细使用见 源码中 examples/App.vue

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
                "label": "ID",  //表头显示名称
                "data_type": "int", //字段值类型
                "sortable": true, //是否可排序
                "show": false, //默认是否在表格中显示
                "fixed": false, //是否固定列
                "filter": false //是否可筛选
            },
            {
                "prop": "area",
                "label": "地区",
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
                "sku": "EUR001",
                "area": "欧洲区",
                "sku_name": "VC泡腾片 樱桃味 20片",
                "upc": "7905615274539",
                "unit": "瓶",
                "currency": "1",
                "quantity": "100",
                "unit_price": "89.0000",
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
                "sku": "EUR019",
                "area": "欧洲区",
                "sku_name": "南瓜籽蔓越莓胶囊 30粒",
                "upc": "7926600561310",
                "unit": "盒",
                "currency": "4",
                "quantity": "200",
                "unit_price": "39.0000",
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
                "sku": "EUR002",
                "area": "欧洲区",
                "sku_name": "VC泡腾片 香橙味 微量元素 20片",
                "upc": "5605615205298",
                "unit": "瓶",
                "currency": "3",
                "quantity": "300",
                "unit_price": "59.0000",
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
