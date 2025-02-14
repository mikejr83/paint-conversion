/**
 * Hash of translated names for the paint key'd off of locale code.
 */
export type TranslatedName = { [langCode: string]: string };

/**
 * Represents a paint.
 */
export interface Paint {
  /**
   * Default name of paint. English name.
   */
  name: string;
  /**
   * Identifier key for the paint.
   */
  key: string;
  /**
   * The brand of manufacturer.
   */
  brand: string;
  /**
   * The series that the paint belongs to at the manufacturer.
   */
  series: string;
  /**
   * HTML color code.
   */
  color: string;
  /**
   * Alternative names for the paint. These are translated names of the paint.
   */
  altNames?: TranslatedName;
  /**
   * Relative match strength to paints in a comparison set.
   */
  matchStrength?: number;
}
