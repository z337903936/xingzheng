<template>
  <member-detail :is-edit="false"/>
</template>

<script>
import MemberDetail from './memberDetail'

export default {
  name: 'CreateRobot',
  components: { MemberDetail }
}
</script>

