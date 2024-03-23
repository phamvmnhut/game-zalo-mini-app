export function copyText(textToCopy: string) {
  const tempInput = document.createElement("textarea");
  tempInput.value = textToCopy;
  document.body.appendChild(tempInput);
  tempInput.select();
  const result = document.execCommand("copy");
  document.body.removeChild(tempInput);
  return result
}