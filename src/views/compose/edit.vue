<template>
  <member-detail :is-edit="true"/>
</template>

<script>
import MemberDetail from './memberDetail'

export default {
  name: 'EditAlarm',
  components: { MemberDetail }
}
</script>

