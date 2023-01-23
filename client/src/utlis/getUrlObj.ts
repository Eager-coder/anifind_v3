export default function getUrlObj(str: string) {
	const urlParams = new URLSearchParams(str)
	const entries = urlParams.entries()
	return Object.fromEntries(entries)
}
