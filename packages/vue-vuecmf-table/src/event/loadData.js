//列表加载数据相关事件
export default {
    methods: {
        //拉取数据
        pullData: function (currentPage, callback, action) {
            let url = this.server;
            if (action != undefined && action == "getField") {
                //拉取表格字段信息
                this.post(url, {
                    action: action
                }).then(function (data) {
                    callback(data);
                });
            } else {
                //拉取列表数据
                this.post(url + "?" + this.page + "=" + currentPage, {
                    pageSize: this.pageSize,
                    orderField: this.orderField,
                    orderSort: this.orderSort,
                    keywords: this.keywords,
                    keywords_field: this.keywords_field,
                    filter: this.filterForm,
                    //兼容后端只接收offset 和 limit 参数分页处理
                    offset: this.pageSize * (currentPage - 1),
                    limit: this.pageSize
                }).then(function (data) {
                    callback(data);
                });
            }
        },
        //加载表格字段回调
        updateTableField: function (data) {
            let that = this;
            this.columns = data.data.data.fields;
            this.columns.forEach(function (val) {
                let filterName = val["prop"];
                if (val["filterName"] != "" && val["filterName"] != undefined) {
                    filterName = val["filterName"];
                }

                if (val["data_type"] == "string") {
                    that.keywords_field.push(filterName);
                }
                if (val["filter"] == true) {
                    //由于搜索表单中v-model 是动态绑定，这里必须使用 Vue.$set(obj, key, val) 方式设置 v-model要绑定的数据，动态绑定才生效
                    that.$set(that.filterForm, filterName, "");
                    //that.filterForm[val['prop']] = ''  //这种生成的v-model的数据 动态绑定v-model是不生效的
                }
                if (val["show"] == true) {
                    that.checkList.push(val["label"]);
                }
            });
        },
        //加载表格字段信息
        loadTableField: function () {
            this.pullData(1, this.updateTableField, "getField");
        },
        //拉取列表数据的回调
        getList(data) {
            if (data.data.data.data == undefined) {
                let msg = "接口异常，无法拉取数据！";
                if (data.data.message != undefined) msg = msg + data.data.message;
                if (data.data.msg != undefined) msg = msg + data.data.msg;
                this.$message.error(msg);
                return false;
            }
            this.tableData = data.data.data.data;
            this.total = parseInt(data.data.data.total);
            this.totalPages = Math.ceil(this.total / this.pageSize);
            this.loading = false;
        },
        //格式化字段内容显示
        formatter: function (row, field_name, data_type, options) {
            let cellValue = row[field_name];

            if (
                (data_type == "switch" || data_type == "select") &&
                options != "" &&
                options != undefined
            ) {
                cellValue = options[cellValue];
            } else if (data_type == "image") {
                cellValue = '<img src="' + cellValue + '" style="width:60px" />';
            } else if (data_type == "url") {
                cellValue =
                    '<a href="' + cellValue + '" target="_blank">' + cellValue + "</a>";
            }

            if (row[field_name + "-html"] != undefined) {
                cellValue = row[field_name + "-html"];
            }

            return cellValue;
        },
        //每页显示条数修改
        handleSizeChange(val) {
            this.pageSize = val;
            this.refresh();
        },
        //当前页修改
        handleCurrentChange(val) {
            this.currentPage = val;
            this.refresh();
        }

        
    }
}