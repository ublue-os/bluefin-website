<script setup lang="ts">
import SceneVisibilityChecker from "../common/SceneVisibilityChecker.vue"
import ImagePicker from "../ImagePicker.vue"
import { marked } from "marked"

import { useI18n } from "vue-i18n"
import type { MessageSchema } from "../../locales/schema"
const { t } = useI18n<MessageSchema>({
  useScope: "global"
})
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
