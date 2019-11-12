<template>
  <member-detail :is-edit="false"/>
</template>

<script>
import MemberDetail from './memberDetail'

export default {
  name: 'CreateForm',
  components: { MemberDetail }
}
</script>

