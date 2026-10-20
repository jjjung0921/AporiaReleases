'use strict';
(async () => {
  const status = document.getElementById('release-status');
  const download = document.getElementById('download');
  try {
    const response = await fetch('https://api.github.com/repos/jjjung0921/AporiaReleases/releases/latest', {
      headers: {Accept: 'application/vnd.github+json'}, signal: AbortSignal.timeout(10000)
    });
    if (response.status === 404) return;
    if (!response.ok) throw new Error('Release unavailable');
    const release = await response.json();
    if (release.draft || release.prerelease || !/^v\d+\.\d+\.\d+$/.test(release.tag_name)) throw new Error('Invalid release');
    const version = release.tag_name.slice(1);
    const names = [`Aporia-${version}-universal.dmg`, `Aporia-${version}-universal-unnotarized.dmg`];
    const asset = names.map(name => release.assets.find(item => item.name === name &&
      item.browser_download_url === `https://github.com/jjjung0921/AporiaReleases/releases/download/${release.tag_name}/${name}`)).find(Boolean);
    if (!asset) throw new Error('No distribution artifact');
    const unnotarized = asset.name.endsWith('-unnotarized.dmg');
    download.href = asset.browser_download_url;
    download.textContent = unnotarized ? 'macOS용 다운로드 · 미공증' : 'macOS용 다운로드';
    status.textContent = `${version} · Apple Silicon 및 Intel · ${unnotarized ? '무료 미공증 배포 · macOS 실행 경고가 표시될 수 있습니다' : 'Developer ID 서명·Apple 공증'}`;
  } catch {
    status.textContent = '배포 상태를 불러오지 못했습니다. ‘배포 버전 확인’에서 확인하세요.';
  }
})();
