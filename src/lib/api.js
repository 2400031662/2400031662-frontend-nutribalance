function normalizeApiBaseUrl(value) {
  const trimmedValue = (value || "").trim().replace(/\/$/, "");

  if (!trimmedValue) {
    return "";
  }

  return trimmedValue.replace(/\/api$/, "");
}

export const apiBaseUrl = normalizeApiBaseUrl(
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL
);

function normalizeApiPath(path) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function buildApiUrl(path) {
  const apiPath = normalizeApiPath(path);

  if (!apiBaseUrl) {
    return apiPath;
  }

  return `${apiBaseUrl}${apiPath}`;
}

export async function apiFetch(path, options) {
  const apiPath = normalizeApiPath(path);
  const directUrl = buildApiUrl(apiPath);
  const preferProxy = import.meta.env.DEV;
  const firstUrl = preferProxy || !apiBaseUrl ? apiPath : directUrl;
  const secondUrl = firstUrl === apiPath ? directUrl : apiPath;

  try {
    return await fetch(firstUrl, options);
  } catch (directError) {
    if (!secondUrl || secondUrl === firstUrl) {
      throw directError;
    }

    return fetch(secondUrl, options);
  }
}

export async function parseApiResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const rawBody = await response.text();

  if (!rawBody) {
    return null;
  }

  if (contentType.includes("application/json")) {
    return JSON.parse(rawBody);
  }

  return { message: rawBody };
}
