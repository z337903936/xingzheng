<template>
  <article-detail :is-edit="false"/>
</template>

<script>
import ArticleDetail from './menberDetail'

export default {
  name: 'CreateForum',
  components: { ArticleDetail }
}
</script>

