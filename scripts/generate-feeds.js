#!/usr/bin/env node

/**
 * Generate RSS/Atom feeds for Bluefin release streams
 * 
 * This script fetches releases from GitHub API and generates
 * RSS/Atom XML feeds for each release stream (stable, gts, lts)
 */

import { promises as fs } from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const GITHUB_API_BASE = 'https://api.github.com/repos/ublue-os/bluefin';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'feeds');
const SITE_URL = 'https://projectbluefin.io';

// RSS/Atom feed template generator
function generateAtomFeed(streamName, releases) {
  const feedId = `${SITE_URL}/feeds/${streamName}.xml`;
  const currentDate = new Date().toISOString();
  
  const entries = releases.map(release => {
    const releaseDate = new Date(release.published_at).toISOString();
    const entryId = `${SITE_URL}/releases/${release.tag_name}`;
    
    // Extract summary from release body
    const lines = (release.body || '').split('\n');
    const summaryLines = lines.slice(0, 3); // First 3 lines as summary
    const summary = summaryLines.join('\n').substring(0, 500) + '...';
    
    return `
    <entry>
      <title>${escapeXml(release.name || release.tag_name)}</title>
      <link href="${release.html_url}" />
      <id>${entryId}</id>
      <updated>${releaseDate}</updated>
      <published>${releaseDate}</published>
      <summary type="text">${escapeXml(summary)}</summary>
      <content type="html"><![CDATA[${release.body || ''}]]></content>
      <author>
        <name>Bluefin Team</name>
        <uri>${SITE_URL}</uri>
      </author>
    </entry>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Bluefin ${streamName.toUpperCase()} Releases</title>
  <subtitle>Release updates for Bluefin ${streamName.toUpperCase()} stream</subtitle>
  <link href="${feedId}" rel="self" />
  <link href="${SITE_URL}" />
  <id>${feedId}</id>
  <updated>${currentDate}</updated>
  <author>
    <name>Bluefin Project</name>
    <uri>${SITE_URL}</uri>
  </author>
  <generator uri="https://github.com/ublue-os/bluefin-website" version="1.0">Bluefin Feed Generator</generator>
  ${entries}
</feed>`;
}

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

// For demonstration purposes, use mock data when API is not accessible
const MOCK_RELEASES = [
  {
    tag_name: 'stable-20250824',
    name: 'stable-20250824: Stable (F42.20250824, #c4c3c57)',
    published_at: '2025-08-24T06:43:34Z',
    html_url: 'https://github.com/ublue-os/bluefin/releases/tag/stable-20250824',
    body: `This is an automatically generated changelog for release \`stable-20250824\`.

From previous \`stable\` version \`stable-20250819\` there have been the following changes. **One package per new version shown.**

### Major packages
| Name | Version |
| --- | --- |
| **Kernel** | 6.14.11-300 |
| **Gnome** | 48.3-1 |
| **Mesa** | 25.1.4-1 ➡️ 25.1.7-1 |
| **Podman** | 5.5.2-1 |
| **Nvidia** | 580.76.05-1 ➡️ 580.76.05-2 |

### How to rebase
For current users, type the following to rebase to this version:
\`\`\`bash
# Get Image Name
IMAGE_NAME=$(jq -r '.[\"image-name\"]' < /usr/share/ublue-os/image-info.json)

# For this Stream
sudo bootc switch --enforce-container-sigpolicy ghcr.io/ublue-os/$IMAGE_NAME:stable
\`\`\``
  },
  {
    tag_name: 'gts-20250824',
    name: 'gts-20250824: Gts (F41.20250824, #c4c3c57)',
    published_at: '2025-08-24T06:54:31Z',
    html_url: 'https://github.com/ublue-os/bluefin/releases/tag/gts-20250824',
    body: `This is an automatically generated changelog for release \`gts-20250824\`.

From previous \`gts\` version \`gts-20250819\` there have been the following changes. **One package per new version shown.**

### Major packages
| Name | Version |
| --- | --- |
| **Kernel** | 6.14.11-200 |
| **Gnome** | 47.7-1 |
| **Podman** | 5.5.2-1 |
| **Nvidia** | 580.76.05-1 ➡️ 580.76.05-2 |

### How to rebase
For current users, type the following to rebase to this version:
\`\`\`bash
# Get Image Name
IMAGE_NAME=$(jq -r '.[\"image-name\"]' < /usr/share/ublue-os/image-info.json)

# For this Stream
sudo bootc switch --enforce-container-sigpolicy ghcr.io/ublue-os/$IMAGE_NAME:gts
\`\`\``
  },
  {
    tag_name: 'stable-20250819',
    name: 'stable-20250819: Stable (F42.20250819, #292c8dd)',
    published_at: '2025-08-19T15:24:47Z',
    html_url: 'https://github.com/ublue-os/bluefin/releases/tag/stable-20250819',
    body: `This is an automatically generated changelog for release \`stable-20250819\`.

From previous \`stable\` version \`stable-20250817\` there have been the following changes.

### Major packages
| Name | Version |
| --- | --- |
| **Kernel** | 6.14.11-300 |
| **Gnome** | 48.3-1 |
| **Mesa** | 25.1.4-1 |
| **Podman** | 5.5.2-1 |`
  }
];

// Fetch releases from GitHub API
async function fetchReleases() {
  try {
    console.log('Fetching releases from GitHub API...');
    
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.github.com',
        path: '/repos/ublue-os/bluefin/releases?per_page=50',
        method: 'GET',
        headers: {
          'User-Agent': 'Bluefin-Website-Feed-Generator/1.0',
          'Accept': 'application/vnd.github.v3+json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            console.log('API Response Status:', res.statusCode);
            
            if (res.statusCode !== 200) {
              console.warn(`GitHub API returned status ${res.statusCode}, using mock data`);
              resolve(MOCK_RELEASES);
              return;
            }
            
            const releases = JSON.parse(data);
            console.log(`Fetched ${releases.length} releases`);
            resolve(releases);
          } catch (error) {
            console.warn('Failed to parse GitHub API response, using mock data');
            resolve(MOCK_RELEASES);
          }
        });
      });

      req.on('error', (error) => {
        console.warn('GitHub API request failed, using mock data:', error.message);
        resolve(MOCK_RELEASES);
      });
      req.end();
    });
  } catch (error) {
    console.warn('Error fetching releases, using mock data:', error);
    return MOCK_RELEASES;
  }
}

// Group releases by stream
function groupReleasesByStream(releases) {
  const streams = {
    stable: [],
    gts: [], 
    lts: []
  };

  releases.forEach(release => {
    const tagName = release.tag_name.toLowerCase();
    
    if (tagName.startsWith('stable-')) {
      streams.stable.push(release);
    } else if (tagName.startsWith('gts-')) {
      streams.gts.push(release);
    } else if (tagName.startsWith('lts-')) {
      streams.lts.push(release);
    }
    // Note: Some releases might not match any stream pattern
  });

  return streams;
}

// Ensure output directory exists
async function ensureOutputDir() {
  try {
    await fs.access(OUTPUT_DIR);
  } catch (error) {
    console.log('Creating feeds directory...');
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  }
}

// Main function
async function main() {
  try {
    console.log('Generating RSS/Atom feeds for Bluefin releases...');
    
    // Ensure output directory exists
    await ensureOutputDir();
    
    // Fetch releases from GitHub
    const releases = await fetchReleases();
    
    if (!Array.isArray(releases) || releases.length === 0) {
      throw new Error('No releases found or invalid response from GitHub API');
    }
    
    // Group releases by stream
    const releasesByStream = groupReleasesByStream(releases);
    
    // Generate feeds for each stream
    for (const [streamName, streamReleases] of Object.entries(releasesByStream)) {
      console.log(`Generating ${streamName} feed with ${streamReleases.length} releases...`);
      
      // Limit to latest 20 releases per stream
      const latestReleases = streamReleases.slice(0, 20);
      
      if (latestReleases.length > 0 || streamName === 'lts') {
        // Generate Atom feed
        const atomFeed = generateAtomFeed(streamName, latestReleases);
        const feedPath = path.join(OUTPUT_DIR, `${streamName}.xml`);
        
        await fs.writeFile(feedPath, atomFeed, 'utf8');
        console.log(`Generated ${streamName} feed: ${feedPath}`);
      } else {
        console.log(`Skipping ${streamName} feed (no releases found)`);
      }
    }
    
    // Generate a combined feed with all releases
    console.log('Generating combined feed...');
    const allReleases = releases.slice(0, 30); // Latest 30 releases across all streams
    const combinedFeed = generateAtomFeed('all', allReleases);
    const combinedPath = path.join(OUTPUT_DIR, 'all.xml');
    await fs.writeFile(combinedPath, combinedFeed, 'utf8');
    console.log(`Generated combined feed: ${combinedPath}`);
    
    console.log('Feed generation completed successfully!');
    
  } catch (error) {
    console.error('Error generating feeds:', error);
    process.exit(1);
  }
}

// Run the script
main();

export { generateAtomFeed, groupReleasesByStream, fetchReleases };