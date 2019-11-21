<template>
    <div class="app-container">

        <el-row>
            <el-col :span="3">
                <el-steps direction="vertical" space="100px">
                    <el-step status="success">
                        <template slot="title">
                            痕检
                        </template>
                        <template slot="icon">
                            <i class="header-icon el-icon-check"></i>
                        </template>
                    </el-step>
                    <el-step  status="wait">
                        <template slot="title">
                            DNA
                        </template>
                        <template slot="icon">
                            <i class="header-icon el-icon-check"></i>
                        </template>
                    </el-step>
                    <el-step  status="success">
                        <template slot="title">
                            法医
                        </template>
                        <template slot="icon">
                            <i class="header-icon el-icon-check"></i>
                        </template>
                    </el-step>
                    <el-step status="process  " >
                        <template slot="title">
                            指纹
                        </template>
                        <template slot="icon">
                            <i class="header-icon el-icon-info"></i>
                        </template>
                    </el-step>
                </el-steps>
            </el-col>
            <el-col :span="21" style="height: 100%">
                <el-collapse>
                    <el-collapse-item>
                        <template slot="title" >
                            <div style="color: #409EFF;font-size: 18px">
                                痕检
                            </div>

                        </template>
                        <searchDetail></searchDetail>
                    </el-collapse-item>
                    <el-collapse-item >
                        <template slot="title">
                            <div style="color: #409EFF;font-size: 18px">
                                DNA信息
                            </div>

                        </template>
                    </el-collapse-item>
                    <el-collapse-item>
                        <template slot="title">
                            <div style="color: #409EFF;font-size: 18px">
                                法医勘查
                            </div>

                        </template>
                    </el-collapse-item>
                    <el-collapse-item >
                        <template slot="title">
                            <div style="color: #409EFF;font-size: 18px">
                                指纹信息
                            </div>
                        </template>
                    </el-collapse-item>
                </el-collapse>
            </el-col>
        </el-row>



    </div>
</template>

<script>
    import searchDetail from './components/searchDetail'
    export default {
        name: "detail",
        components: { searchDetail },

        data(){
            return{

            }
        }
    }
</script>

<style scoped>

</style>