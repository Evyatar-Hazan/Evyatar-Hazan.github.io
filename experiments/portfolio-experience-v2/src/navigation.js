export function localizedInternalPath(path, language, currentSearch = window.location.search) {
  const destination = new URL(path, window.location.origin);
  const currentParameters = new URLSearchParams(currentSearch);

  currentParameters.forEach((value, key) => {
    if (!destination.searchParams.has(key)) destination.searchParams.set(key, value);
  });
  destination.searchParams.set('lang', language);

  return `${destination.pathname}${destination.search}${destination.hash}`;
}

export function localizedStoryPath(hash, language, currentSearch = window.location.search) {
  const normalizedHash = hash.startsWith('#') ? hash : `#${hash}`;
  return localizedInternalPath(`/${normalizedHash}`, language, currentSearch);
}
