export const wait = (timeout: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout)
  })
}

export const dateformat = (timestamp: number) => {
  const date = new Date(timestamp)
  return `${date.getFullYear()}년 ${date.getMonth() +
    1}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`
}