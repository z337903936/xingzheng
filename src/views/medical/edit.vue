<template>
  <member-detail :is-edit="true"/>
</template>

<script>
import MemberDetail from './memberDetail'

export default {
  name: 'EditMedical',
  components: { MemberDetail }
}
</script>

