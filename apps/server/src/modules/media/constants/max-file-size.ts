let maxFileSize = 1024 * 1024 * 10 // 10MB

/**
 * Set the maximum file size in bytes. Required for metadata configuration in controller.
 * @param size The maximum file size in bytes
 */
export const setMaxFileSize = (size: number) => {
  maxFileSize = size
}

/**
 * Get the maximum file size in bytes. Required for metadata configuration in controller.
 * @returns The maximum file size in bytes
 */
export const getMaxFileSize = () => {
  return maxFileSize
}
