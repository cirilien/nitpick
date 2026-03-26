// narrow implementation, replace with lodash or whatever if this is needed properly

export function debounce(callback: (text: string) => void, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (text: string) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(text);
    }, delay);
  };
}
