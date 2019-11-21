<template>
    <div>
        <el-row :gutter="20" class="mb10">
            <el-col :span="6">
                勘查开始：{{ list.examBeginTime*1000 | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
            </el-col>
            <el-col :span="6">
                勘查结束：{{ list.examEndTime*1000 | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
            </el-col>
            <el-col :span="6">
                案件开始：{{ list.caseBeginTime*1000 | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
            </el-col>
            <el-col :span="6">
                案件结束：{{ list.caseEndTime*1000 | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
            </el-col>
        </el-row>
        <el-row :gutter="20" class="mb10">
            <el-col :span="6">
                发案日期：{{ list.caseHappenTime*1000 | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
            </el-col>
            <el-col :span="6">
                发案区划：{{ list.caseHappenRegion }}
            </el-col>
            <el-col :span="6">
                现场保护情况：{{ list.sceneProtect }}
            </el-col>
            <el-col :span="6">
                案件类型：{{ list.caseType }}
            </el-col>
        </el-row>
        <el-row :gutter="20" class="mb10">
            <el-col :span="6">
                主办：{{ list.mainChargerUid }}
            </el-col>
            <el-col :span="6">
                协办：{{ list.supporterUid }}
            </el-col>
            <el-col :span="6">
                照相员：{{ list.photographUid }}
            </el-col>
            <el-col :span="6">
                录像员：{{ list.cameraUid }}
            </el-col>
        </el-row>
        <el-row :gutter="20" class="mb10">
            <el-col :span="6">
                法医：{{ list.medicalUid }}
            </el-col>
            <el-col :span="6">
                现场保护民警：{{ list.sceneProtectUid }}
            </el-col>
            <el-col :span="6">
                是否有监控：{{ list.hasCamera?'是':'不是' }}
            </el-col>
            <el-col :span="6">
                处所：{{ list.sceneType }}
            </el-col>
        </el-row>

        <el-row :gutter="20" class="mb10">
            <el-col :span="6">
                作案时机：{{ list.crimeTime }}
            </el-col>
            <el-col :span="6">
                侵入方式：{{ list.invadeType }}
            </el-col>
            <el-col :span="6">
                作案出口：{{ list.escapeType }}
            </el-col>
            <el-col :span="6">
                作案人数：{{ list.crimePeoples }}
            </el-col>
        </el-row>
        <el-row :gutter="20" class="mb10">
            <el-col :span="6">
                作案工具：{{ list.crimeTools }}
            </el-col>
            <el-col :span="6">
                是否十类案件：{{ list.isTenCase?'是':'不是' }}
            </el-col>
            <el-col :span="6">
                是否死亡案件：{{ list.isDeathCase?'是':'不是' }}
            </el-col>
            <el-col :span="6">
            </el-col>
        </el-row>
        <div class="mb10">
            作案过程:{{ list.crimeDetail }}
        </div>
        <el-table
                :data="list.concernedPersonList"
                height="200"
                border
                max-height="200"
                style="width: 100%"
                class="mb10">
            <el-table-column
                    prop="name"
                    label="名字"
            >
                <template slot-scope="{row}">
                    <span>{{ row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="idType"
                    label="证件类型"
            >
                <template slot-scope="{row}">
                    <span>{{ row.idType }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="idNo"
                    label="证件号">
                <template slot-scope="{row}">
                    <span>{{ row.idNo }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="sex"
                    label="性别">
                <template slot-scope="{row}">
                    <span>{{ row.sex }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="contactNumber"
                    label="联系电话">
                <template slot-scope="{row}">
                    <span>{{ row.contactNumber }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="residence"
                    label="常住地址">
                <template slot-scope="{row}">
                    <span>{{ row.residence }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="huji"
                    label="户籍">
                <template slot-scope="{row}">
                    <span>{{ row.huji }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="registerName"
                    label="登记人">
                <template slot-scope="{row}">
                    <span>{{ row.registerName }}</span>
                </template>
            </el-table-column>
        </el-table>

        <el-table
                :data="list.lostDetailList"
                height="200"
                border
                max-height="200"
                style="width: 100%"
                class="mb10">
            <el-table-column
                    prop="name"
                    label="名字"
            >
                <template slot-scope="{row}">
                    <span>{{ row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="model"
                    label="型号"
            >
                <template slot-scope="{row}">
                    <span>{{ row.model }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="feather"
                    label="特征">
                <template slot-scope="{row}">
                    <span>{{ row.feather }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="value"
                    label="价值">
                <template slot-scope="{row}">
                    <span>{{ row.value }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="amount"
                    label="数量">
                <template slot-scope="{row}">
                    <span>{{ row.amount }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="regName"
                    label="登记人">
                <template slot-scope="{row}">
                    <span>{{ row.regName }}</span>
                </template>
            </el-table-column>

        </el-table>

        <el-table
                :data="list.materialList"
                height="200"
                border
                max-height="200"
                style="width: 100%"
                class="mb10">
            <el-table-column
                    prop="materialNo"
                    label="物证编码"
            >
                <template slot-scope="{row}">
                    <span>{{ row.materialNo }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="thirdMaterialNo"
                    label="物证库编号"
            >
                <template slot-scope="{row}">
                    <span>{{ row.thirdMaterialNo }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="materialCategory"
                    label="物证类别">
                <template slot-scope="{row}">
                    <span>{{ row.materialCategory }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="materialType"
                    label="物证类型">
                <template slot-scope="{row}">
                    <span>{{ row.materialType }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="extractTime"
                    label="提取日期">
                <template slot-scope="{row}">
                    <span>{{ row.extractTime }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="extractMethod"
                    label="提取方法">
                <template slot-scope="{row}">
                    <span>{{ row.extractMethod }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="extractUid"
                    label="提取人">
                <template slot-scope="{row}">
                    <span>{{ row.extractUid }}</span>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
    import {fetchSearch} from '@/api/search'
    export default {
        name: "searchDetail",
        data(){
            return{
                list:{
                    examBeginTime:'',
                    examEndTime:'',
                    caseBeginTime:'',
                    caseEndTime:'',
                    caseHappenTime:'',
                    caseHappenRegion:'',
                    sceneProtect:'',
                    caseType:'',
                    mainChargerUid:'',
                    supporterUid:'',
                    photographUid:'',
                    cameraUid:'',
                    medicalUid:'',
                    sceneProtectUid:'',
                    hasCamera:'',
                    isTenCase:'',
                    isDeathCase:'',
                    sceneType:'',
                    crimeTime:'',
                    invadeType:'',
                    escapeType:'',
                    crimeTools:'',
                    crimeDetail:'',
                    crimePeoples:'',
                    lostDetailList:[],
                    concernedPersonList:[],
                    materialList:[],

                },
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
            }
        },
        created() {
            const id = this.$route.params && this.$route.params.id;
            this.getSearch(id)
        },
        methods: {
            getSearch(id) {
                fetchSearch(id).then(response => {
                    this.list = response;
                    this.sceneProtectType.map(data=>{
                        if (data.id == this.list.sceneProtect){
                            this.list.sceneProtect = data.title
                        }
                    });
                    this.crimePeoplesType.map(data=>{
                        if (data.id == this.list.crimePeoples){
                            this.list.crimePeoples = data.title
                        }
                    })

                })
            },
        }
    }
</script>

<style scoped>
    .mb10{
        margin-bottom: 10px;
    }
</style>