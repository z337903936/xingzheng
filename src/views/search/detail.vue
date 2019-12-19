<template>
    <div class="app-container">

        <el-row>
            <el-col :span="4">
                <el-steps direction="vertical" space="180px">
                    <el-step v-for="row in list.stepList" :status="row.status===1?'wait':row.status===2?'process':'success'">
                        <template slot="title">
                            {{ row.stepName }}
                        </template>
                        <template slot="icon">
                            <i class="header-icon el-icon-check"></i>
                        </template>
                        <template slot="description">
                            <b>检测者:</b>{{ row.stepHandler }} <br>
                            <b>任务接收时间:</b> {{ row.taskArriveTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')  }}<br>
                            <b>任务应完成时间:</b>{{ row.taskNeedFinishTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')  }} <br>
                            <b>实际完成时间:</b> {{ row.taskEndTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')  }}<br>
                            <b>当前任务状态:</b>  {{ row.status===1?'未领取':row.status===2?'进行中':'已完成' }}
                        </template>
                    </el-step>
                </el-steps>
            </el-col>
            <el-col :span="20" style="height: 100%;text-align: center">
                <el-collapse v-model="activeNames">
                    <el-collapse-item name="痕检">
                        <template slot="title" >
                            <div style="color: #409EFF;font-size: 18px">
                                痕检
                            </div>

                        </template>
                        <searchDetail :list="list"></searchDetail>
                    </el-collapse-item>
                    <el-collapse-item >
                        <template slot="title">
                            <div style="color: #409EFF;font-size: 18px">
                                DNA信息
                            </div>
                        </template>
                        <material-detail :detailList="dnaList"></material-detail>
                    </el-collapse-item>
                    <el-collapse-item>
                        <template slot="title">
                            <div style="color: #409EFF;font-size: 18px">
                                法医勘查
                            </div>
                        </template>
                        <forensicDetail :detailList="forensicList"></forensicDetail>
                    </el-collapse-item>
                    <el-collapse-item >
                        <template slot="title">
                            <div style="color: #409EFF;font-size: 18px">
                                指纹信息
                            </div>
                        </template>
                        <material-detail :detailList="fingerprintist"></material-detail>
                    </el-collapse-item>
                    <el-collapse-item >
                        <template slot="title">
                            <div style="color: #409EFF;font-size: 18px">
                                理化检测
                            </div>
                        </template>
                        <material-detail :detailList="physicocheList"></material-detail>
                    </el-collapse-item>
                    <el-collapse-item >
                        <template slot="title">
                            <div style="color: #409EFF;font-size: 18px">
                                电子物证
                            </div>
                        </template>
                        <material-detail :detailList="electronicList"></material-detail>
                    </el-collapse-item>
                </el-collapse>
            </el-col>
        </el-row>



    </div>
</template>

<script>
    import searchDetail from './components/searchDetail'
    import materialDetail from './components/materialDetail'
    import forensicDetail from './components/forensicDetail'
    import {fetchSearch} from '@/api/search'
    import { parseTime } from '@/utils'
    export default {
        name: "detail",
        components: { searchDetail,materialDetail,forensicDetail },

        data(){
            return{
                sceneProtectType:[
                    {
                        id:1,
                        title:'未移动',
                    }, {
                        id:2,
                        title:'已复原',
                    },{
                        id:3,
                        title:'不明显',
                    },{
                        id:4,
                        title:'一般' ,
                    },{
                        id:5,
                        title:'混乱',
                    },{
                        id:6,
                        title:'其他',
                    },
                ],
                crimePeoplesType:[
                    {
                        id:0,
                        title:'不确定',
                    }, {
                        id:1,
                        title:'1人',
                    }, {
                        id:2,
                        title:'两个',
                    },{
                        id:3,
                        title:'多人',
                    }
                ],
                idType:[
                    {
                        id:1,
                        title:'身份证',
                    }, {
                        id:2,
                        title:'护照',
                    }, {
                        id:3,
                        title:'军人证',
                    },{
                        id:4,
                        title:'学生证',
                    }
                ],
                sex:[
                    {
                        id:0,
                        title:'未知',
                    }, {
                        id:1,
                        title:'男',
                    }, {
                        id:2,
                        title:'女',
                    }
                ],
                documentType:[
                    {
                        id:1,
                        title:'DNA鉴定书',
                    }, {
                        id:2,
                        title:'指纹鉴定书',
                    }, {
                        id:3,
                        title:'理化鉴定书',
                    },{
                        id:4,
                        title:'其他鉴定书',
                    },
                ],
                materialType:[
                    {
                        id:1,
                        title:'指纹印',
                    }, {
                        id:2,
                        title:'DNA',
                    }, {
                        id:3,
                        title:'鞋印',
                    },{
                        id:4,
                        title:'工痕',
                    },{
                        id:5,
                        title:'微量物证',
                    },
                ],
                activeNames:['痕检'],
                list:{},
                dnaList:[],
                forensicList:[],
                fingerprintist:[],
                physicocheList:[],
                electronicList:[],
            }
        },
        created() {
            const id = this.$route.params && this.$route.params.id;
            this.getSearch(id)
        },
        methods:{
            getSearch(id) {
                fetchSearch(id).then(response => {
                    this.list = response;

                    if (response.stepList.length>0) {
                        response.stepList.map(item=>{
                            if (item.stepName === 'DNA送检') {
                                this.dnaList.push(item)
                            }
                            if (item.stepName === '指纹送检') {
                                this.fingerprintist.push(item)
                            }
                            if (item.stepName === '法医现勘') {
                                this.forensicList = response.concernedPersonList
                            }
                            if (item.stepName === '理化送检') {
                                this.physicocheList.push(item)
                            }
                            if (item.stepName === '电子物证送检') {
                                this.electronicList.push(item)
                            }
                        })
                    }






                })
            },
        }
    }
</script>

<style scoped>

</style>
