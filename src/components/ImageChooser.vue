<script setup lang="ts">
import { Ref, ref, computed } from "vue"
import { marked } from "marked"
import {
  IconCheckCircle,
  IconDownload,
  IconGithubCircle
} from "@iconify-prerendered/vue-mdi"

import { useI18n } from "vue-i18n"
import type { MessageSchema } from "../locales/schema"
const { t } = useI18n<MessageSchema>({
  useScope: "global"
})

const imageName: Ref<{
  arch: string | undefined
  base: string | undefined
  gpu: string | undefined
  stream: string | undefined
  imagesrc: string | undefined
}> = ref({
  arch: undefined,
  base: "bluefin",
  gpu: undefined,
  stream: undefined,
  imagesrc: undefined
})

const selectedRelease = ref<string | undefined>(undefined)
const showArchitectureStep = ref(false)
const showGpuStep = ref(false)
const showDownload = ref(false)

// Release definitions with their characteristics
const releases = [
  {
    id: 'lts',
    title: 'Bluefin LTS',
    subtitle: 'Beta',
    description: 'The long term support experience',
    image: './characters/achillobator.webp',
    supportedArch: ['x86', 'arm'],
    recommended: false
  },
  {
    id: 'gts',
    title: 'Bluefin GTS',
    subtitle: 'For Most People',
    description: 'The default experience for users, following the previous stable release of Fedora',
    image: './characters/intrigued.webp',
    supportedArch: ['x86'],
    recommended: true
  },
  {
    id: 'stable',
    title: 'Bluefin',
    subtitle: 'For Enthusiasts',
    description: 'The most current, based on the latest Fedora',
    image: './characters/leaping.webp',
    supportedArch: ['x86'],
    recommended: false
  }
]

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

const selectRelease = (releaseId: string) => {
  selectedRelease.value = releaseId
  imageName.value.stream = releaseId
  imageName.value.imagesrc = releases.find(r => r.id === releaseId)?.image
  showArchitectureStep.value = true
  showGpuStep.value = false
  showDownload.value = false
}

const selectArchitecture = (arch: string) => {
  imageName.value.arch = arch
  
  // Apply ARM restrictions like in original component
  if (arch == "arm" && imageName.value.stream != "lts") {
    imageName.value.stream = 'lts'
    selectedRelease.value = 'lts'
    imageName.value.imagesrc = './characters/achillobator.webp'
  }
  
  showGpuStep.value = true
  showDownload.value = false
}

const selectGpu = (gpu: string) => {
  imageName.value.gpu = gpu
  showDownload.value = true
}

const getSelectedRelease = computed(() => {
  return releases.find(r => r.id === selectedRelease.value)
})

const getSupportedArchitectures = computed(() => {
  const release = getSelectedRelease.value
  if (!release) return []
  
  return release.supportedArch.map(arch => ({
    id: arch,
    label: arch === 'x86' ? t("TryBluefin.Architecture.x86") : t("TryBluefin.Architecture.arm"),
    available: true
  }))
})

const BLUEFIN_DOWNLOAD_URL = "https://download.projectbluefin.io/%TEMPLATE%"

const reset = () => {
  selectedRelease.value = undefined
  imageName.value.stream = undefined
  imageName.value.arch = undefined
  imageName.value.gpu = undefined
  imageName.value.imagesrc = undefined
  showArchitectureStep.value = false
  showGpuStep.value = false
  showDownload.value = false
}
</script>

<template>
  <div class="image-chooser">
    <!-- Release Selection -->
    <div v-if="!selectedRelease" class="release-selection">
      <div class="release-grid">
        <div 
          v-for="release in releases" 
          :key="release.id"
          class="release-box"
          :class="{ 'recommended': release.recommended }"
          @click="selectRelease(release.id)"
        >
          <div class="release-image" :style="{ backgroundImage: `url(${release.image})` }">
            <div class="release-overlay">
              <div class="release-content">
                <div class="release-header">
                  <h3 class="release-title">{{ release.title }}</h3>
                  <span class="release-subtitle">{{ release.subtitle }}</span>
                  <span v-if="release.recommended" class="recommended-badge">Recommended</span>
                </div>
                <p class="release-description">{{ release.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Architecture Selection -->
    <div v-else-if="showArchitectureStep && !imageName.arch" class="step-selection">
      <div class="step-header">
        <button class="back-button" @click="reset">← Back to releases</button>
        <h3>{{ t("TryBluefin.Architecture.Question") }}</h3>
      </div>
      <div class="options-grid">
        <button 
          v-for="arch in getSupportedArchitectures" 
          :key="arch.id"
          class="option-button"
          :disabled="!arch.available"
          @click="selectArchitecture(arch.id)"
        >
          {{ arch.label }}
        </button>
      </div>
    </div>

    <!-- GPU Selection -->
    <div v-else-if="showGpuStep && !imageName.gpu" class="step-selection">
      <div class="step-header">
        <button class="back-button" @click="showArchitectureStep = true; imageName.arch = undefined; showGpuStep = false">← Back</button>
        <h3>{{ t("TryBluefin.Gpu.Question") }}</h3>
      </div>
      <div class="options-grid">
        <button class="option-button" @click="selectGpu('amd')">
          AMD | Intel
        </button>
        <button class="option-button" @click="selectGpu('nvidia')">
          Nvidia (RTX Series | GTX 16xx+ Series)
        </button>
      </div>
    </div>

    <!-- Download Section -->
    <div v-else-if="showDownload" class="download-section">
      <div class="step-header">
        <button class="back-button" @click="showGpuStep = true; imageName.gpu = undefined; showDownload = false">← Back</button>
        <h3>Ready to download!</h3>
      </div>
      
      <div class="download-summary">
        <div class="selected-release-info">
          <div class="release-preview" :style="{ backgroundImage: `url(${imageName.imagesrc})` }">
            <div class="release-overlay-small">
              <h4>{{ getSelectedRelease?.title }}</h4>
              <p>{{ getSelectedRelease?.subtitle }}</p>
            </div>
          </div>
          <div class="selection-details">
            <p><strong>Architecture:</strong> {{ imageName.arch === 'x86' ? 'x86_64' : 'ARM64' }}</p>
            <p><strong>GPU:</strong> {{ imageName.gpu === 'amd' ? 'AMD/Intel' : 'Nvidia' }}</p>
          </div>
        </div>

        <div class="download-actions">
          <a 
            class="download-button primary"
            :href="BLUEFIN_DOWNLOAD_URL.replace('%TEMPLATE%', (getFormattedImageName() ?? '') + '.iso')"
          >
            {{ t("TryBluefin.Download.Iso") }}
            <IconDownload class="download-icon" />
          </a>
          
          <div class="secondary-actions">
            <a 
              class="action-link" 
              :title="t('TryBluefin.Download.Checksum')" 
              :href="BLUEFIN_DOWNLOAD_URL.replace('%TEMPLATE%', (getFormattedImageName() ?? '') + '.iso-CHECKSUM')"
            >
              <IconCheckCircle class="action-icon" />
              Verify (SHA256)
            </a>
            <a 
              class="action-link"
              :title="t('TryBluefin.Download.Registry')"
              href="https://github.com/orgs/ublue-os/packages?repo_name=bluefin" 
              target="_blank"
            >
              <IconGithubCircle class="action-icon" />
              View Registry
            </a>
          </div>
        </div>
      </div>

      <div class="documentation-note">
        <p v-html="marked.parse(t('TryBluefin.Download.DocumentationURL'))" />
      </div>

      <button class="start-over-button" @click="reset">
        Choose a different release
      </button>
    </div>
  </div>
</template>

<style scoped>
.image-chooser {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* Release Selection */
.release-selection {
  margin-bottom: 2rem;
}

.release-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.release-box {
  position: relative;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 3px solid transparent;
  background: #1f2937;
}

.release-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.release-box.recommended {
  border-color: #4f9cf9;
  box-shadow: 0 0 20px rgba(79, 156, 249, 0.3);
}

.release-image {
  width: 100%;
  height: 100%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  padding: 1.5rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.release-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.3) 40%,
    rgba(0, 0, 0, 0.8) 100%
  );
  display: flex;
  align-items: flex-end;
  padding: 1.5rem;
  color: white;
  border-radius: 12px;
}

.release-content {
  width: 100%;
}

.release-header {
  margin-bottom: 0.75rem;
}

.release-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.release-subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
  display: block;
  margin-bottom: 0.5rem;
}

.recommended-badge {
  display: inline-block;
  background: #4f9cf9;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.release-description {
  font-size: 0.9rem;
  line-height: 1.4;
  opacity: 0.9;
  margin: 0;
}

/* Step Selection */
.step-selection {
  max-width: 600px;
  margin: 0 auto;
}

.step-header {
  text-align: center;
  margin-bottom: 2rem;
}

.back-button {
  background: none;
  border: none;
  color: #4f9cf9;
  cursor: pointer;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.back-button:hover {
  background-color: rgba(79, 156, 249, 0.1);
}

.step-header h3 {
  font-size: 1.5rem;
  margin: 0;
  color: white;
}

.options-grid {
  display: grid;
  gap: 1rem;
}

.option-button {
  padding: 1.5rem;
  border: 2px solid #374151;
  border-radius: 8px;
  background: #1f2937;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-button:hover:not(:disabled) {
  border-color: #4f9cf9;
  background: rgba(79, 156, 249, 0.1);
}

.option-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Download Section */
.download-section {
  max-width: 800px;
  margin: 0 auto;
}

.download-summary {
  background: #1f2937;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.selected-release-info {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  align-items: center;
}

.release-preview {
  width: 120px;
  height: 80px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  position: relative;
  flex-shrink: 0;
}

.release-overlay-small {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 0.5rem;
}

.release-overlay-small h4 {
  font-size: 0.8rem;
  margin: 0;
  font-weight: 600;
}

.release-overlay-small p {
  font-size: 0.7rem;
  margin: 0;
  opacity: 0.9;
}

.selection-details p {
  margin: 0.25rem 0;
  color: white;
}

.download-actions {
  text-align: center;
}

.download-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #4f9cf9;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: background-color 0.3s ease;
  margin-bottom: 1rem;
}

.download-button:hover {
  background: #3b82f6;
}

.download-icon {
  width: 1.2rem;
  height: 1.2rem;
}

.secondary-actions {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.action-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #93c5fd;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.action-link:hover {
  color: #4f9cf9;
}

.action-icon {
  width: 1rem;
  height: 1rem;
}

.documentation-note {
  background: rgba(79, 156, 249, 0.1);
  border: 1px solid rgba(79, 156, 249, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  color: white;
}

.documentation-note :deep(a) {
  color: #93c5fd;
}

.start-over-button {
  background: none;
  border: 1px solid #374151;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: block;
  margin: 0 auto;
}

.start-over-button:hover {
  border-color: #4f9cf9;
  background: rgba(79, 156, 249, 0.1);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .release-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .release-box {
    height: 250px;
  }
  
  .selected-release-info {
    flex-direction: column;
    text-align: center;
  }
  
  .secondary-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>