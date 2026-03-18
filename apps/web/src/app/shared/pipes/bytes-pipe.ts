import { Pipe, PipeTransform } from '@angular/core'

/**
 * Format a number of bytes into a human readable string.
 *
 * @param bytes - The number of bytes
 * @param decimals - The number of decimals to show
 * @returns The formatted bytes
 *
 * @example
 * ```html
 * {{ 1024 | bytes }} // Returns: '1 KiB'
 * {{ 1024 * 1024 | bytes }} // Returns: '1 MiB'
 * {{ 1024 * 1024 * 1024 | bytes }} // Returns: '1 GiB'
 * ```
 */
@Pipe({
  name: 'bytes',
})
export class BytesPipe implements PipeTransform {
  transform(bytes: number, decimals: number = 2): string {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }
}
