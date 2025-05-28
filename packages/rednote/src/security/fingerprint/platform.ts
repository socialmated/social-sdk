/**
 * Represents the supported operating system platforms.
 */
enum Platform {
  Windows,
  // eslint-disable-next-line @typescript-eslint/naming-convention -- ignore
  iOS,
  Android,
  MacOs,
  Linux,
  Other,
}

/**
 * Returns the corresponding `Platform` enum value for a given platform string.
 *
 * @param platform - The name of the platform as a string (e.g., 'Android', 'iOS', 'Mac OS', 'Linux').
 * @returns The matching `Platform` enum value, or `Platform.Other` if the platform is unrecognized.
 */
function getPlatformCode(platform: string): Platform {
  switch (platform) {
    case 'Android':
      return Platform.Android;
    case 'iOS':
      return Platform.iOS;
    case 'Mac OS':
      return Platform.MacOs;
    case 'Linux':
      return Platform.Linux;
    default:
      return Platform.Other;
  }
}

export { getPlatformCode, Platform };
