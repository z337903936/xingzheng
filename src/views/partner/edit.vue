<template>
  <partner-detail :is-edit="true"/>
</template>

<script>
import PartnerDetail from './components/PartnerDetail'

export default {
  name: 'EditForm',
  components: { PartnerDetail }
}
</script>

