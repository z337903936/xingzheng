<template>
    <div class="app-container">
        <el-table
                v-loading="listLoading"
                :key="tableKey"
                :data="list"
                border
                fit
                highlight-current-row
                style="width: 100%;"
        >
            <el-table-column label="借用人" align="center" >
                <template slot-scope="{row}">
                    <span>{{ row.name | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="借用时间" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.borrowTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="归还时间"  align="center">
                <template slot-scope="{row}">
                    <span>{{ row.returnTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
    import {timeList} from '@/api/material'
    import waves from '@/directive/waves' // waves directive
    import {parseTime,formatDate} from '@/utils'
    export default {
        name: "time",
        data(){
            return{
                tableKey: 0,
                list: null,
                listLoading: false,
                listQuery: {
                    materialId: undefined,
                    materialNo: undefined,
                },
            }
        },
        created(){

            this.getList();
        },
        methods:{
            getList() {

                this.listQuery.materialId = this.$route.params && this.$route.query.materialId;
                this.listQuery.materialNo = this.$route.params && this.$route.query.materialNo;
                this.listLoading = true;
                timeList(this.listQuery).then(response => {
                    // this.list = response.list;
                    this.list = response.borrowList.map((data,index)=>{
                        var returnData ={
                            name:data.requireName,
                            borrowTime:data.requireTime,

                        }
                        if (response.returnList[index]) {
                            returnData.returnTime=response.returnList[index].requireTime
                        }else{
                            returnData.returnTime = 0;
                        }

                        return returnData;
                    })
                    // Just to simulate the time of the request

                    this.listLoading = false

                })
            },
        }
    }
</script>

<style scoped>

</style>
