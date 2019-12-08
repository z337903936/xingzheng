<template>
    <div class="app-container">
        <materialManger></materialManger>

    </div>
</template>

<style>
    .mb10 {
        margin-bottom: 10px;
    }
</style>

<script>
    import {fetchList, fetchAlarm, createAlarm, updateAlarm} from '@/api/alarm'
    import waves from '@/directive/waves' // waves directive
    import {parseTime} from '@/utils'
    import { fetchAdminMemberList} from '@/api/permissions'

    import materialManger from './materialManger'
    import materialHome from './materialHome'



    export default {
        name: 'Dna',
        directives: {waves},
        components:{
            materialHome,materialManger
        },
        data() {
            return {
                tableKey: 0,
                list: null,
                activeName: 'first',
                pages: 0,
                listLoading: false,
                paginationShow: true,
                searchTime: '',
                limit: 20,
                listQuery: {
                    page: 1,
                    beginTime: undefined,
                    endTime: undefined,
                    leaderName: undefined,
                    receiptName: undefined,
                    reporterOrg: undefined,
                    reporterName: undefined,
                    caseCategoryId: undefined
                },
                rules:{},
                downloadLoading: false,
            }
        },
        created() {
            // this.getList()
        },
        methods: {
            // getList() {
            //     this.listLoading = true;
            //     fetchList(this.listQuery).then(response => {
            //         this.list = response.list;
            //         this.pages = response.pages
            //
            //         // Just to simulate the time of the request
            //         setTimeout(() => {
            //             this.listLoading = false
            //         },1000)
            //     })
            // },
            // handleFilter () {
            //     if (this.searchTime[0].toString().length>10)
            //         this.listQuery.beginTime = this.searchTime[0]/1000;
            //     if (this.searchTime[1].toString().length>10)
            //         this.listQuery.endTime = this.searchTime[1]/1000;
            //     this.listQuery.page = 1;
            //     this.getList()
            // },
            //
            // handleDownload() {
            //     this.downloadLoading = true
            //     import('@/vendor/Export2Excel').then(excel => {
            //         const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
            //         const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
            //         const data = this.formatJson(filterVal, this.list)
            //         excel.export_json_to_excel({
            //             header: tHeader,
            //             data,
            //             filename: 'table-list'
            //         })
            //         this.downloadLoading = false
            //     })
            // },
            // formatJson(filterVal, jsonData) {
            //     return jsonData.map(v => filterVal.map(j => {
            //         if (j === 'timestamp') {
            //             return parseTime(v[j])
            //         } else {
            //             return v[j]
            //         }
            //     }))
            // },
            
        }
    }
</script>
