/**
 *
 * @param {string} entireUrl The url string.
 * @returns
 */
export function replaceProtocolToWS(entireUrl = "") {
    try {
        const wsUrl = new URL(entireUrl);
        wsUrl.protocol === "https:" ? (wsUrl.protocol = "wss:") : (wsUrl.protocol = "ws:");
        return wsUrl.toString();
    } catch (error) {
        return undefined;
    }
}