export function getParamforUrl(paramName: string): string | null {
  const url = new URL(window.location.href);
  return url.searchParams.get(paramName);
}

export function deleteParamFromUrl(paramName: string): void {
  const url = new URL(window.location.href);
  url.searchParams.delete(paramName);
  window.history.pushState(null, '', url.toString());
}

export function setParamToUrl(params: Record<string, string>) {
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);

  Object.keys(params).forEach((key) => {
    searchParams.set(key, params[key]);
  });

  url.search = searchParams.toString();
  window.history.pushState(null, '', url.toString());

  if (getParamforUrl('filter') !== 'listId') {
    searchParams.delete('listId');
    url.search = searchParams.toString();
    window.history.pushState(null, '', url.toString());
  }
}
