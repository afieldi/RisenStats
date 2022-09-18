import championsMap from '../data/champions_map.json';

export function ChampionIdToName(championId: number): string {
  const key = championId.toString();
  function isValidKey(value: string): value is keyof typeof championsMap {
    return value in championsMap;
  }
  if (isValidKey(key)) {
    return championsMap[key];
  }
  return '';
}

export function SaveBlob(blob: any, fileName: string) {
  const url = window.URL.createObjectURL(
    new Blob([blob]),
  );
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    fileName,
  );

  // Append to html link element page
  document.body.appendChild(link);

  // Start download
  link.click();

  // Clean up and remove the link
  link.parentNode?.removeChild(link);
}