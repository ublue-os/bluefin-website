<script setup lang="ts">
import { Ref, ref } from "vue"
import { marked } from "marked"
import {
  IconCheckCircle,
  IconDownload,
  IconGithubCircle
} from "@iconify-prerendered/vue-mdi"

const imageName: Ref<{
  arch: string | undefined
  base: string | undefined
  gpu: string | undefined
  stream: string | undefined
  imagesrc: string | undefined
}> = ref({
  arch: "x86",
  base: "bluefin",
  gpu: undefined,
  stream: "gts",
  imagesrc: "./characters/intrigued.png"
})

const getFormattedImageName = () => {
  let final_name = imageName.value.base

  if (imageName.value.gpu == "nvidia") {
    if (imageName.value.stream == "lts" ) {
      final_name += "-gdx"
    } else {
      final_name += "-nvidia-open"
    }
  }

  final_name += "-" + imageName.value.stream;

  switch (imageName.value.arch) {
    case "x86":
      final_name += "-x86_64";
      break;
    case "arm":
      final_name += "-aarch64";
      break;
  }

  return final_name
}

const selectCuteDino = () => {
  let target_image = ""
  switch (imageName.value.stream) {
    case 'lts':
      target_image = './characters/achillobator.webp';
      break;
    case 'gts':
      target_image = './characters/intrigued.png';
      break;
    case 'stable':
      target_image = './characters/leaping.png';
      break;
    default:
  }
  imageName.value.imagesrc = target_image;
}

const fixupStreamHandling = () => {
  if (imageName.value.arch == "arm" && imageName.value.stream != "lts") {
    imageName.value.stream = 'lts'
  }
}

const BLUEFIN_DOWNLOAD_URL = "https://download.projectbluefin.io/%TEMPLATE%"

import { useI18n } from "vue-i18n"
import type { MessageSchema } from "../locales/schema"
const { t } = useI18n<MessageSchema>({
  useScope: "global"
})
</script>

<style>
@import "tailwindcss";

/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.question-select {
  @apply rounded-xl bg-black p-7 text-white w-full xl:w-full xl:max-w-xl border-blue-500 border-s-8 text-2xl;
}

.question-container {
  @apply mt-10 w-full;
}

.question-title {
  @apply mb-2 text-white text-2xl;
}

#downloadtexts a {
  color: #FFFFFF !important;
}
</style>

<template>
  <div class="flex pt-20 flex-wrap xl:flex-nowrap font-inter w-full xl:w-auto text-[11pt] h-screen">
    <div class="container w-full">
      <Transition name="fade">
        <div class="question-container">
          <label for="archVendor" class="question-title">{{ t("TryBluefin.Architecture.Question") }}</label>
          <div>
            <select @change="() => { fixupStreamHandling(); selectCuteDino(); }" v-model="imageName.arch"
              id="archVendor" name="archVendor" class="question-select">
              <option :value="'x86'" selected>{{ t("TryBluefin.Architecture.x86") }}</option>
              <option :value="'arm'">{{ t("TryBluefin.Architecture.arm") }}</option>
            </select>
          </div>
        </div>
      </Transition>

      <Transition name="fade">
        <div class="gpu question-container" v-if="imageName.arch != undefined">
          <label for="gpuVendor" class="question-title">{{
            t("TryBluefin.Gpu.Question")
            }}</label>
          <div>
            <select v-model="imageName.gpu" id="gpuVendor" name="gpuVendor" class="question-select">
              <option :value="undefined" disabled selected>
                {{ t("TryBluefin.Gpu.DefaultSelection") }}
              </option>
              <option :value="'amd'">AMD | Intel</option>
              <option :value="'nvidia'">Nvidia (RTX Series | GTX 16xx+ Series)</option>
            </select>
          </div>
        </div>
      </Transition>

      <Transition name="fade">
        <div class="question-container" v-if="imageName.gpu != undefined">
          <label for="isGts" class="question-title">{{
            t("TryBluefin.Stream.Question")
            }}</label>
          <div class="select">
            <select v-model="imageName.stream" id="isGts" name="isGts" class="question-select" @change="selectCuteDino">
              <option disabled selected :value="undefined">
                {{ t("TryBluefin.Stream.DefaultSelection") }}
              </option>
              <option :value="'lts'">
                {{ t("TryBluefin.Stream.LTS", { version: "10" }) }}
              </option>
              <option :value="'gts'" :disabled="imageName.arch == 'arm'">
                {{ t("TryBluefin.Stream.Gts") }}
              </option>
              <option :value="'stable'" :disabled="imageName.arch == 'arm'">
                {{ t("TryBluefin.Stream.Stable") }}
              </option>
              <!-- Do not add Latest or Beta, it is way too unstable for new users -->
            </select>
          </div>
        </div>
      </Transition>
    </div>

    <Transition name="fade">
      <div v-if="
        imageName.arch != undefined &&
        imageName.gpu != undefined &&
        imageName.stream != undefined
      " @load="selectCuteDino"
        class="w-full mt-20 flex flex-col xl:m-auto container-xl text-white items-center xl:items-start xl:justify-left">
        <div class="flex flex-row items-center" id="downloadtexts">
          <a class="bg-blue-500 rounded-3xl max-w-xl max-h-xl flex flex-row flex-nowrap justify-center items-center"
            style="padding: 1.5rem; margin-top: 2.5rem; margin-bottom: 2.5rem; margin-right: 1.5rem; font-size: 1.5rem; line-height: 2rem;  "
            :href="BLUEFIN_DOWNLOAD_URL.replace(
              '%TEMPLATE%',
              (getFormattedImageName() ?? '') + '.iso'
            )
              ">
            {{
              t("TryBluefin.Download.Iso")
            }}
            <IconDownload class="w-[2rem] h-[2rem] shrink grow-0" />
          </a>
          <a class="px-3" :title="t('TryBluefin.Download.Checksum')" :href="BLUEFIN_DOWNLOAD_URL.replace(
            '%TEMPLATE%',
            (getFormattedImageName() ?? '') + '.iso-CHECKSUM'
          )
            ">
            <IconCheckCircle class="w-[3rem] h-[3rem]" />
          </a>
          <a :title="t('TryBluefin.Download.Registry')"
            href="https://github.com/orgs/ublue-os/packages?repo_name=bluefin" target="_blank">
            <IconGithubCircle class="w-[3rem] h-[3rem]" />
          </a>
        </div>

        <p v-html="marked.parse(t('TryBluefin.Download.DocumentationURL'))" />

        <div class="container">
          <Transition name="slide-fade">
            <img class="dolly xl:absolute top-0 left-0 right-0 m-auto text-center w-3/4" :key="imageName.stream"
              :src="imageName.imagesrc" :title="t('TryBluefin.Download.DollyChill')" />
          </Transition>
        </div>
      </div>
    </Transition>
  </div>
</template>
