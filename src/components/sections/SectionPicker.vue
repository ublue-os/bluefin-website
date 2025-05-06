<script setup lang="ts">
import SceneVisibilityChecker from "../common/SceneVisibilityChecker.vue"

</script>

<style>
#scene-picker a {
  @include font(700);
  color: var(--color-blue-light);

  &:hover {
    text-decoration: none;
  }
}
</style>

<template>
  <section id="scene-picker" class="section-wrap">
    <SceneVisibilityChecker name="#scene-picker" />
  </section>
</template>
