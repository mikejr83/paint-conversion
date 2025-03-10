export function ConvertNameToKey(name: string) {
  return name.toLocaleUpperCase().replaceAll(/\s+/gm, '_');
}
