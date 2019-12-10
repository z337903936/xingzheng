<template>
  <member-detail :is-edit="true"/>
</template>

<script>
import MemberDetail from './memberDetail'

export default {
  name: 'EditRobot',
  components: { MemberDetail }
}
</script>

