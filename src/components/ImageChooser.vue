<script setup lang="ts">
import { Ref, ref, computed, onMounted } from "vue"
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

// Version information interface
interface VersionInfo {
  base: string
  gnome: string
  kernel: string
  mesa: string
  nvidia: string
}

interface StreamVersions {
  lts: VersionInfo
  gts: VersionInfo
  stable: VersionInfo
}

// State for version information
const streamVersions = ref<StreamVersions | null>(null)

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
    id: "lts",
    title: "Bluefin LTS",
    subtitle: "Beta - for testers only",
    description: "The long term support experience, for the risk averse",
    image: "./characters/achillobator.webp",
    supportedArch: ["x86", "arm"],
    recommended: false,
    beta: true
  },
  {
    id: "gts",
    title: "Bluefin GTS",
    subtitle: "For Most People",
    description: "The default experience, pick this if you\'re not sure",
    image: "./characters/intrigued.webp",
    supportedArch: ["x86"],
    recommended: true
  },
  {
    id: "stable",
    title: "Bluefin",
    subtitle: "For Enthusiasts",
    description: "Faster updates, the leading edge",
    image: "./characters/leaping.webp",
    supportedArch: ["x86"],
    recommended: false
  }
]

const getFormattedImageName = () => {
  let final_name = imageName.value.base

  if (imageName.value.gpu == "nvidia") {
    if (imageName.value.stream == "lts") {
      final_name += "-gdx"
    } else {
      final_name += "-nvidia-open"
    }
  }

  final_name += "-" + imageName.value.stream

  switch (imageName.value.arch) {
    case "x86":
      final_name += "-x86_64"
      break
    case "arm":
      final_name += "-aarch64"
      break
  }

  return final_name
}

const selectRelease = (releaseId: string) => {
  selectedRelease.value = releaseId
  imageName.value.stream = releaseId
  imageName.value.imagesrc = releases.find((r) => r.id === releaseId)?.image
  showArchitectureStep.value = true
  showGpuStep.value = false
  showDownload.value = false
}

const selectArchitecture = (arch: string) => {
  imageName.value.arch = arch

  // Apply ARM restrictions like in original component
  if (arch == "arm" && imageName.value.stream != "lts") {
    imageName.value.stream = "lts"
    selectedRelease.value = "lts"
    imageName.value.imagesrc = "./characters/achillobator.webp"
  }

  showGpuStep.value = true
  showDownload.value = false
}

const selectGpu = (gpu: string) => {
  imageName.value.gpu = gpu
  showDownload.value = true
}

const getSelectedRelease = computed(() => {
  return releases.find((r) => r.id === selectedRelease.value)
})

const getSupportedArchitectures = computed(() => {
  const release = getSelectedRelease.value
  if (!release) return []

  return release.supportedArch.map((arch) => ({
    id: arch,
    label:
      arch === "x86"
        ? t("TryBluefin.Architecture.x86")
        : t("TryBluefin.Architecture.arm"),
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

// Load version information from YAML file
const loadVersions = async () => {
  try {
    const response = await fetch("/stream-versions.yml")
    const yamlText = await response.text()

    // Simple YAML parser for our specific format
    const parseYAML = (yaml: string): StreamVersions => {
      const lines = yaml
        .split("\n")
        .filter((line) => line.trim() && !line.trim().startsWith("#"))
      const result: any = {}
      let currentStream = ""

      for (const line of lines) {
        if (!line.startsWith(" ") && line.includes(":")) {
          currentStream = line.split(":")[0].trim()
          result[currentStream] = {}
        } else if (line.startsWith("  ") && line.includes(":")) {
          const [key, value] = line.trim().split(": ")
          result[currentStream][key] = value.replace(/"/g, "")
        }
      }

      return result as StreamVersions
    }

    streamVersions.value = parseYAML(yamlText)
  } catch (error) {
    console.warn("Failed to load stream versions:", error)
  }
}

// Load versions on component mount
onMounted(() => {
  loadVersions()
})
</script>

<template>
  <div class="image-chooser">
    <!-- Release Selection -->
    <Transition name="fade">
      <div v-if="!selectedRelease" class="release-selection">
        <div class="release-grid">
          <div
            v-for="release in releases"
            :key="release.id"
            class="release-box"
            :class="{ recommended: release.recommended }"
            @click="selectRelease(release.id)"
          >
            <div
              class="release-image"
              :style="{ backgroundImage: `url(${release.image})` }"
            >
              <!-- Badges positioned in top right corner -->
              <span v-if="release.recommended" class="recommended-badge"
                >Recommended</span
              >
              <span v-if="release.beta" class="beta-badge">Beta</span>

              <div class="release-overlay">
                <div class="release-content">
                  <div class="release-header">
                    <h3 class="release-title">{{ release.title }}</h3>
                    <span class="release-subtitle">{{ release.subtitle }}</span>
                  </div>
                  <p class="release-description">{{ release.description }}</p>

                  <!-- Version Information -->
                  <div
                    v-if="
                      streamVersions &&
                      streamVersions[release.id as keyof StreamVersions]
                    "
                    class="version-info"
                  >
                    <div class="version-item">
                      <span class="version-label">Base:</span>
                      <span class="version-value">{{
                        streamVersions[release.id as keyof StreamVersions].base
                      }}</span>
                    </div>
                    <div class="version-item">
                      <span class="version-label">GNOME:</span>
                      <span class="version-value">{{
                        streamVersions[release.id as keyof StreamVersions].gnome
                      }}</span>
                    </div>
                    <div class="version-item">
                      <span class="version-label">Kernel:</span>
                      <span class="version-value">{{
                        streamVersions[release.id as keyof StreamVersions]
                          .kernel
                      }}</span>
                    </div>
                    <div class="version-item">
                      <span class="version-label">MESA:</span>
                      <span class="version-value">{{
                        streamVersions[release.id as keyof StreamVersions].mesa
                      }}</span>
                    </div>
                    <div class="version-item">
                      <span class="version-label">Nvidia:</span>
                      <span class="version-value">{{
                        streamVersions[release.id as keyof StreamVersions]
                          .nvidia
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Architecture Selection -->
    <Transition name="fade">
      <div
        v-if="showArchitectureStep && !imageName.arch"
        class="step-selection"
      >
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
    </Transition>

    <!-- GPU Selection -->
    <Transition name="fade">
      <div v-if="showGpuStep && !imageName.gpu" class="step-selection">
        <div class="step-header">
          <button
            class="back-button"
            @click="
              () => {
                showArchitectureStep = true
                imageName.arch = undefined
                showGpuStep = false
              }
            "
          >
            ← Back
          </button>
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
    </Transition>

    <!-- Download Section -->
    <Transition name="fade">
      <div v-if="showDownload" class="download-section">
        <div class="step-header">
          <button
            class="back-button"
            @click="
              () => {
                showGpuStep = true
                imageName.gpu = undefined
                showDownload = false
              }
            "
          >
            ← Back
          </button>
          <h3>Ready to download!</h3>
        </div>

        <div class="download-summary">
          <div class="selected-release-info">
            <div
              class="release-preview"
              :style="{ backgroundImage: `url(${imageName.imagesrc})` }"
            >
              <div class="release-overlay-small">
                <h4>{{ getSelectedRelease?.title }}</h4>
                <p>{{ getSelectedRelease?.subtitle }}</p>
              </div>
            </div>
            <div class="selection-details">
              <p>
                <strong>Architecture:</strong>
                {{ imageName.arch === "x86" ? "x86_64" : "ARM64" }}
              </p>
              <p>
                <strong>GPU:</strong>
                {{ imageName.gpu === "amd" ? "AMD/Intel" : "Nvidia" }}
              </p>
            </div>
          </div>

          <div class="download-actions">
            <a
              class="download-button primary"
              :href="
                BLUEFIN_DOWNLOAD_URL.replace(
                  '%TEMPLATE%',
                  (getFormattedImageName() ?? '') + '.iso'
                )
              "
            >
              {{ t("TryBluefin.Download.Iso") }}
              <IconDownload class="download-icon" />
            </a>

            <div class="secondary-actions">
              <a
                class="action-link"
                :title="t('TryBluefin.Download.Checksum')"
                :href="
                  BLUEFIN_DOWNLOAD_URL.replace(
                    '%TEMPLATE%',
                    (getFormattedImageName() ?? '') + '.iso-CHECKSUM'
                  )
                "
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
    </Transition>
  </div>
</template>

<style scoped>
.image-chooser {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  /* Ensure consistent height across all steps to prevent FAQ section from jumping */
  min-height: 500px;
}

/* Release Selection */
.release-selection {
  margin-bottom: 2rem;
  margin-top: 2rem;
}

.release-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.release-box {
  position: relative;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
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
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.release-subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
  display: block;
  margin-bottom: 0.5rem;
}

.recommended-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(var(--color-blue-rgb), 0.9);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.beta-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(var(--color-blue-rgb), 0.9);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.release-description {
  font-size: 1.5rem;
  line-height: 1.4;
  opacity: 0.9;
  margin: 0 0 1rem 0;
}

/* Version Information */
.version-info {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.version-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.version-item:last-child {
  margin-bottom: 0;
}

.version-label {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  min-width: 60px;
}

.version-value {
  font-family: "Courier New", monospace;
  color: #93c5fd;
  font-weight: 500;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 1rem;
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
  /* Style like "Discover" button (btn filled) */
  font-weight: 700;
  height: 36px;
  line-height: 36px;
  border: 2px solid var(--color-blue);
  background-color: var(--color-blue);
  color: var(--color-text-light);
  border-radius: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 20px;
  font-size: 1.4rem;
  text-decoration: none;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: var(--color-blue);
  color: var(--color-text-light);
}

.step-header h3 {
  font-size: 1.5rem;
  margin: 0;
  color: white; /* Download the ISO text should be white - keeping this white */
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
  font-size: 1.6rem; /* Increased from 1.1rem to be larger than average text */
  font-weight: 700; /* Made bold as requested */
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
  /* Center the "Choose a different release" button */
  text-align: center;
}

.download-summary {
  background: #1f2937;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: left; /* Override center alignment for content */
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
  gap: 0.9rem; /* 20% increase from 0.75rem */
  height: 44px; /* 20% increase from 36px */
  line-height: 44px;
  border: 2px solid var(--color-blue);
  background-color: var(--color-blue);
  color: var(--color-text-light);
  border-radius: 22px; /* 20% increase from 18px */
  padding: 0 25px; /* 20% increase from 20px */
  font-size: 1.75rem; /* 20% increase from 1.4rem */
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  cursor: pointer;
}

.download-button:hover {
  background-color: var(--color-blue);
  color: var(--color-text-light);
}

.download-icon {
  width: 1.5rem; /* 20% increase from 1.2rem */
  height: 1.5em;
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
  font-size: 1rem;
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
  /* Increased spacing below documentation note (contains "ventoy is unsupported" text) 
     to provide better visual separation from the "Choose different release" button below.
     Adjust this value to modify spacing between documentation and button. */
  margin-bottom: 3rem; /* Increased from 2rem to 3rem */
  color: white;
  text-align: left; /* Override center alignment for content */
}

.documentation-note :deep(a) {
  color: #93c5fd;
}

.start-over-button {
  /* Style like "Discover" button (btn filled) */
  font-weight: 700;
  height: 36px;
  line-height: 36px;
  border: 2px solid var(--color-blue);
  background-color: var(--color-blue);
  color: var(--color-text-light);
  border-radius: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 20px;
  font-size: 1.4rem;
  text-decoration: none;
  margin: 0 auto;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-over-button:hover {
  background-color: var(--color-blue);
  color: var(--color-text-light);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .release-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .release-box {
    height: 350px;
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
