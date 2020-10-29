/**
 * 邮箱验证
 *
 */
export function isEmail (s) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号验证
 *
 */
export function isMobile (s) {
  return /^1(3|4|5|6|7|8|9)\d{9}$/.test(s)
}
