<template>
  <accounts-detail :is-edit="true"/>
</template>

<script>
import AccountsDetail from './AccountsDetail'

export default {
  name: 'EditForm',
  components: { AccountsDetail }
}
</script>

