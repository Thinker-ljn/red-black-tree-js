export default function generate (len, random = true) {
  let arr = Array.from(Array(len).keys())
  while (random && 0 != len) {
    let random = Math.floor(Math.random() * len)
    len--

    [arr[random], arr[len]] = [arr[len], arr[random]]
  }
  return arr
}
