export function isElectron(): boolean {
  return !!(window as any).api?.saveImage;
}
