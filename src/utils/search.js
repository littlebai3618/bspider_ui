export function searchStr(map, sk) {
  var result = []
  for (var j = 0, len = sk.length; j < len; j++) {
    if (!(map[sk[j]] === undefined || map[sk[j]] === null)) {
      result.push(sk[j] + '=' + map[sk[j]])
    }
  }
  return result.join(',')
}
