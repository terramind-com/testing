/**
 * Truncates a string at the nearest word boundary before maxLength.
 * @param str - The string to truncate
 * @param maxLength - The maximum length of the truncated string (including ellipsis)
 * @param ellipsis - The string to append if truncated (default: '...')
 * @returns The truncated string or the original if it's shorter than maxLength
 */
export function truncateString(
  str: string,
  maxLength: number,
  ellipsis: string = '...'
): string {
  if (str.length <= maxLength) {
    return str;
  }

  // Calculate the available space for actual content
  const availableLength = maxLength - ellipsis.length;

  if (availableLength <= 0) {
    return ellipsis.slice(0, maxLength);
  }

  // Get substring up to availableLength
  const truncated = str.slice(0, availableLength);

  // Find the last space in the truncated string
  let lastSpaceIndex = truncated.lastIndexOf(' ');

  // Search for a word boundary where the result fits within maxLength
  // We need: lastSpaceIndex + ellipsis.length <= maxLength
  // Since lastSpaceIndex is the position of the space, the text length is lastSpaceIndex
  // So we need: lastSpaceIndex + ellipsis.length <= maxLength
  while (lastSpaceIndex !== -1 && lastSpaceIndex + ellipsis.length > maxLength) {
    // Look for an earlier space
    lastSpaceIndex = truncated.lastIndexOf(' ', lastSpaceIndex - 1);
  }

  if (lastSpaceIndex === -1) {
    // No valid word boundary found, truncate at character limit
    return str.slice(0, availableLength) + ellipsis;
  }

  // Truncate at the word boundary (exclude the space itself)
  return str.slice(0, lastSpaceIndex) + ellipsis;
}
