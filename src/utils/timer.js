// 获取mysql标准时间的方法

export function getTimer(JSTimer) {
  var date = new Date(JSTimer)
  return date.getFullYear() +
    '-' + (date.getMonth() + 1) +
    '-' + date.getDate() +
    ' ' + date.getHours() +
    ':' + date.getMinutes() +
    ':' + date.getSeconds()
}
