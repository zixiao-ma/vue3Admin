/**
 * @author MaZiXiao
 * @date 2022-07-16 13:49
 */

/**
 * 判断是否为外部资源
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
