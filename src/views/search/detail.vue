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
                        <template slot="title">
                            痕检
                        </template>
                        <searchDetail></searchDetail>
                    </el-collapse-item>
                    <el-collapse-item >
                        <template slot="title">
                            DNA信息
                        </template>
                        <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
                        <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
                    </el-collapse-item>
                    <el-collapse-item>
                        <template slot="title">
                            法医勘查
                        </template>
                        <div>简化流程：设计简洁直观的操作流程；</div>
                        <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
                        <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
                    </el-collapse-item>
                    <el-collapse-item >
                        <template slot="title">
                            指纹信息
                        </template>
                        <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
                        <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
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
        components: { searchDetail }
    }
</script>

<style scoped>

</style>