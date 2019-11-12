<template>
  <role-detail :is-edit="true" />
</template>

<script>
import RoleDetail from './roleDetail'

export default {
  name: 'EditForm',
  components: { RoleDetail }
}
</script>

