export function transparentize (value, opacity) {
  const rgb = [
    parseInt(value.slice(1, 3), 16),
    parseInt(value.slice(3, 5), 16),
    parseInt(value.slice(5, 7), 16),
  ]
  return `rgba(${rgb.join(",")}, ${opacity})`
}