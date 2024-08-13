export function dateFileName() {
  return new Date()
    .toLocaleString('zh-CN')
    .replace(/\//g, '')
    .replace(/:/g, '')
    .replace(' ', '_')
}
