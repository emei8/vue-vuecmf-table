//列表导入数据相关事件
import { jsonImport, jsonExport } from "../jsonUtils";
import {dateFormat} from "../commonUtils.js"

export default {
    methods: {
        //下载模板文件
        downloadTemplate() {
            let tpl_data = [];
            let item = [];

            //将下载的字段名替换成表格的表头名称
            this.columns.forEach(function (v) {
                if (v["prop"] != "action" && v["prop"] != undefined) {
                    //过滤HTML标签
                    let label = v["label"].replace(/<[^>]*>/g, "");
                    item[label] = "";
                }
            });
            tpl_data.push(item);
            jsonExport(tpl_data, "xlsx", "数据模板");
        },
        //第一步： 触发上传事件
        triggerUpload(){
            this.import_file_name = ''
            this.import_file_error = ''
            this.importExcelPercentage = 0
            this.importCurrentPage = 0
            this.is_import_disabled = true
            this.importExcelData = []
            document.getElementById('import_data_form').reset()
            this.$refs.importExcelForm.click()
        },
        //第二步： 上传数据文件
        importExcel(fileForm){
            if(fileForm.target.files[0].type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && fileForm.target.files[0].type != 'application/vnd.ms-excel'){
                this.$message.error('上传文件类型错误！只能上传文件xlsx,xls类型文件');
                return false
            }

            this.import_file_name = fileForm.target.files[0].name

            jsonImport(fileForm.target,this.callbackUploadExcelData)
        },
        //第三步： 获取上传的EXCEL数据的回调函数， 处理解析数据
        callbackUploadExcelData(file_data){
            let that = this
            if(file_data.length == 0) return false

            let newData = []
            that.parse_data_tips = '<span style="color:#F56C6C">正在解析文件，请稍后...</span>';
        
            file_data.forEach(function (v,k) {
                let item_data = {}
            
                that.columns.forEach(function (val) {
                    if(val['label'] != undefined && val['prop'] != 'action'){
                        let new_val = v[val['label']]
                        if((val['data_type'] == 'datetime' || val['data_type'] == 'date') && new_val > 40000 && new_val < 90000){
                            new_val = dateFormat(new Date(1900, 0, new_val),'Y/m/d H:i:s')  //如果日期变成类似42747 则用这种方式转换
                        }

                        if(typeof val['options_name'] != "undefined" && val['options_name'] != ''){
                            let flag = false
                            for(let n in val['options_name']){
                                if(val['options_name'][n] == new_val){
                                    flag = true
                                    new_val = parseInt(n.replace(/'/g,''))
                                }
                            }
                            if(flag == false){
                                that.import_file_error += '第 '+ (k+2) +' 行中的“ '+new_val+' ”在系统中没有找到对应的“ '+val['label']+" ”<br>";
                            }

                        }else if(typeof val['options'] != "undefined" && val['options'] != ''){
                            let flag = false
                            for(let n in val['options']){
                                if(val['options'][n] == new_val){
                                    flag = true
                                    new_val = parseInt(n.replace(/'/g,''))
                                }

                            }
                            if(flag == false){
                                that.import_file_error += '第 '+ (k+2) +' 行中的“ '+new_val+' ”在系统中没有找到对应的“ '+val['label']+" ”<br>";
                            }
                        }

                        if(typeof new_val == "undefined")  new_val = ''

                        item_data[val['prop']] = new_val
                    }
                })
                newData[k] = item_data
            })

            if(that.import_file_error != ''){
                that.is_import_disabled = true
                document.getElementById('import_data_form').reset()
            } 

            that.parse_data_tips = '<span style="color:#409EFF">文件解析完成，共解析出 <strong>' + newData.length + '</strong> 条记录。</span>';
            that.is_import_disabled = false
            that.importExcelData = newData
        },
        //第四步： 开始导入数据
        startImportData(){
            let that = this

            that.is_import_disabled = true

            //每次处理200条
            let pageNum = 200
            let pages = Math.ceil(that.importExcelData.length / pageNum)

            if(that.importCurrentPage >= pages){
                if(that.importExcelPercentage == 100){
                    that.$message.success('导入成功！')
                    that.refresh()
                }
                return false
            } 

            let post_data = that.importExcelData.slice(that.importCurrentPage * pageNum,(that.importCurrentPage + 1) * pageNum)

            if(post_data != '' && post_data != null && post_data.length != 0){
                that.post(that.importServer,{data:JSON.stringify(post_data)}).then(function(data){
                    if(data.status == 200 && data.data.code == 0){
                        if(data.status == 200){
                            that.importExcelPercentage = Math.ceil((that.importCurrentPage + 1) / pages * 100)
                        }
                        that.importCurrentPage ++
                        that.startImportData()
                    }else if(data.data.code != 0){
                        that.import_file_error = data.data.msg + '<br>'
                    }
                    
                })
            }

        }



    }
}