<template>
    <member-detail :is-edit="false"/>
</template>

<script>
    import MemberDetail from './memberDetail'
    export default {
        name: "Create",
        components: { MemberDetail }
    }
</script>

