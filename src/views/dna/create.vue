<template>
  <member-detail :is-edit="false"/>
</template>

<script>
import MemberDetail from './memberDetail'

export default {
  name: 'CreateAlarm',
  components: { MemberDetail }
}
</script>

