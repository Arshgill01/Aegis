function normalizeTrailingSlash(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

export function runDetailPath(runId: string) {
  return `/runs/${encodeURIComponent(runId)}`;
}

export function approvalDetailPath(approvalId: string) {
  return `/approvals/${encodeURIComponent(approvalId)}`;
}

export function normalizeNavigationPath(pathname: string) {
  const normalizedPath = normalizeTrailingSlash(pathname);

  if (normalizedPath.startsWith("/runs/")) {
    return "/runs";
  }

  if (normalizedPath.startsWith("/approvals/")) {
    return "/approvals";
  }

  return normalizedPath;
}
