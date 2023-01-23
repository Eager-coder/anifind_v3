export const getUnixTimeNow = (): number => {
	return Math.floor(Date.now() / 1000)
}
export const getCookieExpDate = (): Date => {
	return new Date(Date.now() + 14 * 86400 * 1000)
}
