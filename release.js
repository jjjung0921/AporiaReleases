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
    const name = `Aporia-${version}-universal.dmg`;
    const expected = `https://github.com/jjjung0921/AporiaReleases/releases/download/${release.tag_name}/${name}`;
    const asset = release.assets.find(item => item.name === name && item.browser_download_url === expected);
    if (!asset) throw new Error('No distribution artifact');
    download.href = expected;
    download.textContent = 'macOS용 다운로드';
    status.textContent = `${version} · Apple Silicon 및 Intel · Developer ID 서명·Apple 공증`;
  } catch {
    status.textContent = '배포 상태를 불러오지 못했습니다. ‘배포 버전 확인’에서 확인하세요.';
  }
})();
