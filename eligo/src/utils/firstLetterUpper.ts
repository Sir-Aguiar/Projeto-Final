export default function (text: string) {
  const arr = text.split("");
  arr[0] = arr[0].toUpperCase();
  return arr.join("");
}
