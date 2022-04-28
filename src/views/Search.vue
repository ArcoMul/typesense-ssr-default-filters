<template>
  <ais-instant-search-ssr>
    <ais-configure filters="free_shipping:true" />
    <ais-search-box />
    <ais-stats />
    <ais-toggle-refinement attribute="free_shipping" label="Free shipping" />
    Brand:
    <ais-refinement-list attribute="brand" />
    <ais-hits>
      <template v-slot:item="{ item }">
        <p>
          <ais-highlight
            attribute="name"
            :hit="item"
          />
        </p>
        <p>
          <ais-highlight
            attribute="brand"
            :hit="item"
          /><br />
          Free shipping: {{item.free_shipping}}
        </p>
      </template>
    </ais-hits>
    <ais-pagination />
  </ais-instant-search-ssr>
</template>

<script>
import {
  AisInstantSearchSsr,
  AisRefinementList,
  AisHits,
  AisHighlight,
  AisSearchBox,
  AisStats,
  AisPagination,
  AisConfigure,
  AisToggleRefinement
} from 'vue-instantsearch';

export default {
  components: {
    AisInstantSearchSsr,
    AisRefinementList,
    AisHits,
    AisHighlight,
    AisSearchBox,
    AisStats,
    AisPagination,
    AisConfigure,
    AisToggleRefinement
  },
};
</script>

<style>
.ais-Hits-list {
  text-align: left;
}
</style>
