import { useMoralis } from "react-moralis"
import { useEffect, useCallback } from "react"

export default function ManualHeader() {
    const LS_KEY ="web3"
    const LS_VALUE ="connected"
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } =
        useMoralis()

    const enableWeb3CB = useCallback(enableWeb3, [enableWeb3] )
    useEffect(() => {
        if (!isWeb3Enabled) {
            const connected = localStorage?.getItem(LS_KEY)
            if (connected === LS_VALUE) {
                enableWeb3CB()
            }
        }
    }, [isWeb3Enabled, enableWeb3CB])

    const deactivateWeb3CB = useCallback(deactivateWeb3, [deactivateWeb3] )
    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (!account) {
                localStorage?.removeItem(LS_KEY)
                deactivateWeb3CB()
                console.log("Null account found")
            }
        })
    }, [Moralis, deactivateWeb3CB])

    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3()
                        localStorage?.setItem(LS_KEY, LS_VALUE)
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    Connect
                </button>
            )}
        </div>
    )
}
