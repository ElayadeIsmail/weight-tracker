export function fieldErrorsFromIssues(
  issues: readonly { path?: readonly { key?: unknown }[]; message: string }[],
): Record<string, string> {
  const fields: Record<string, string> = {};

  for (const issue of issues) {
    const key = issue.path?.[0]?.key;
    if (typeof key === "string" && fields[key] === undefined) {
      fields[key] = issue.message;
    }
  }

  return fields;
}
