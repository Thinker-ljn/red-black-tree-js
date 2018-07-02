export default function generate (len) {
  let arr = Array.from(Array(len).keys())
  while (0 != len) {
    let random = Math.floor(Math.random() * len)
    len--

    [arr[random], arr[len]] = [arr[len], arr[random]]
  }
  return arr
}
