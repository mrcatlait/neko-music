export const NumericTypes = {
  /**
   * 2 bytes /	small-range integer / -32768 to +32767
   */
  smallint: 'smallint',
  /**
   * 4 bytes / typical choice for integer / -2147483648 to +2147483647
   */
  integer: 'integer',
  /**
   * 8 bytes / large-range integer / -9223372036854775808 to +9223372036854775807
   */
  bigint: 'bigint',
}

export const CharacterTypes = {
  /**
   * variable-length with limit
   */
  varchar: 'varchar',
  /**
   * variable unlimited length
   */
  text: 'text',
}

/**
 * 1 byte / state of true or false
 */
export const BooleanType = 'boolean'

export const DateTimeTypes = {
  /**
   * 8 bytes / both date and time
   */
  timestamp: 'timestamp',
  /**
   * 4 bytes / date (no time of day)
   */
  date: 'date',
  /**
   * 8 bytes / time of day (no date)
   */
  time: 'time ',
}

export const DateTimeTypesGenerator = 'now()'

export const UUIDType = 'uuid'

export const UUIDGenerator = 'uuid_generate_v4()'

export const NetworkAddressTypes = {
  /**
   * 7 or 19 bytes /	IPv4 and IPv6 networks
   */
  cidr: 'cidr',
  /**
   * 7 or 19 bytes /	IPv4 and IPv6 hosts and networks
   */
  inet: 'inet',
}
