<template>
  <member-detail :is-edit="true"/>
</template>

<script>
import MemberDetail from './memberDetail'

export default {
  name: 'EditForm',
  components: { MemberDetail }
}
</script>

