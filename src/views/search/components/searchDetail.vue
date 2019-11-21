<template>
    <div>
        <el-row :gutter="20" class="mb10">
            <el-col :span="6">
                勘查开始：
            </el-col>
            <el-col :span="6">
                勘查结束：
            </el-col>
            <el-col :span="6">
                案件开始：
            </el-col>
            <el-col :span="6">
                案件开始：
            </el-col>
        </el-row>
        <el-row :gutter="20" class="mb10">
            <el-col :span="6">
                发案日期：
            </el-col>
            <el-col :span="6">
                发案区划：
            </el-col>
            <el-col :span="6">
                现场保护情况：
            </el-col>
            <el-col :span="6">
                案件类型：
            </el-col>
        </el-row>
        <el-row :gutter="20" class="mb10">
            <el-col :span="6">
                主办：
            </el-col>
            <el-col :span="6">
                协办：
            </el-col>
            <el-col :span="6">
                照相员：
            </el-col>
            <el-col :span="6">
                录像员：
            </el-col>
        </el-row>
        <el-row :gutter="20" class="mb10">
            <el-col :span="6">
                法医：
            </el-col>
            <el-col :span="6">
                现场保护民警：
            </el-col>
            <el-col :span="6">
                是否有监控：
            </el-col>
            <el-col :span="6">
                处所：
            </el-col>
        </el-row>

        <el-row :gutter="20" class="mb10">
            <el-col :span="6">
                作案时机：
            </el-col>
            <el-col :span="6">
                侵入方式：
            </el-col>
            <el-col :span="6">
                作案出口：
            </el-col>
            <el-col :span="6">
                作案人数：
            </el-col>
        </el-row>
        <el-row :gutter="20" class="mb10">
            <el-col :span="6">
                作案工具：
            </el-col>
            <el-col :span="6">
                是否十类案件：
            </el-col>
            <el-col :span="6">
                是否死亡案件：
            </el-col>
            <el-col :span="6">
            </el-col>
        </el-row>
        <div class="mb10">
            作案过程:
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
                    <span>{{ row.idTypeShow }}</span>
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
                    <span>{{ row.sexShow }}</span>
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
                    <span>{{ row.materialTypeShow }}</span>
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
                    <span>{{ row.extractUidShow }}</span>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
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
            }
        }
    }
</script>

<style scoped>
    .mb10{
        margin-bottom: 10px;
    }
</style>