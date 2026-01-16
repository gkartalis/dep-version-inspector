// npm registry checker for latest versions

export async function fetchLatestVersion(packageName) {
  try {
    const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.version;
  } catch (e) {
    console.error(`Could not fetch latest version for ${packageName}: ${e.message}`);
    return null;
  }
}

export async function enrichWithLatestVersions(rows) {
  const enrichedRows = [];

  for (const row of rows) {
    const latest = await fetchLatestVersion(row.dep);
    enrichedRows.push({ ...row, latest });
  }

  return enrichedRows;
}
