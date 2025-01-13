export function extractPath(urlString: string): string {
  const url = new URL(urlString);
  let path = url.pathname;

  if (path.endsWith("/")) {
    path += "index.html";
  }

  if (!isLikelyFileUrlUsingURL(path)) {
    path += "/index.html";
  }

  return path;
}

function isLikelyFileUrlUsingURL(path: string) {
  return path.lastIndexOf(".") > path.lastIndexOf("/");
}
