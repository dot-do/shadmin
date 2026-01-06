/**
 * Core Record type definitions for Shadmin
 * 100% API-compatible with react-admin
 *
 * This is the single source of truth for RaRecord and Identifier types.
 * All other modules should import from this file via '../types' or '../../types'.
 */

/**
 * Identifier type - can be string or number
 * Used as the type for record IDs throughout the application
 */
export type Identifier = string | number

/**
 * RaRecord - Base record type for all data records
 * All records must have an 'id' field and can have any additional properties
 *
 * @template IdentifierType - The type of the id field, defaults to Identifier (string | number)
 *
 * @example
 * ```tsx
 * // Basic usage
 * interface User extends RaRecord {
 *   name: string
 *   email: string
 * }
 *
 * // With specific ID type
 * interface Product extends RaRecord<number> {
 *   name: string
 *   price: number
 * }
 * ```
 */
export type RaRecord<IdentifierType extends Identifier = Identifier> = {
  id: IdentifierType
  [key: string]: unknown
}
