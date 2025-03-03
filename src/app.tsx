import "./font.css"
import "./app.css"
import { useRecoilState, useSetRecoilState } from "recoil"
import { pocketPathAtom, reconnectWhenOpenedAtom } from "./recoil/atoms"
import { Layout } from "./components/layout"
import React, { Suspense, useCallback, useEffect, useState } from "react"
import { invokeOpenPocket, invokeOpenPocketFolder } from "./utils/invokes"
import { Tip } from "./components/tip"
import { NewsFeed } from "./components/newsFeed"
import { currentViewAtom } from "./recoil/view/atoms"
import { useTranslation } from "react-i18next"

const Pocket = React.lazy(() =>
  import("./components/three/pocket").then((m) => ({ default: m.Pocket }))
)

export const App = () => {
  const [pocketPath, setPocketPath] = useRecoilState(pocketPathAtom)
  const [reconnectWhenOpened, setReconnectWhenOpened] = useRecoilState(
    reconnectWhenOpenedAtom
  )
  const setView = useSetRecoilState(currentViewAtom)
  const [attempts, setAttempts] = useState(0)
  const { t } = useTranslation("app")

  useEffect(() => {
    if (reconnectWhenOpened.enable && reconnectWhenOpened.path) {
      invokeOpenPocketFolder(reconnectWhenOpened.path).then((result) => {
        if (result) {
          setView({ view: "Pocket Sync", selected: null })
          setPocketPath(result)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onOpenPocket = useCallback(async () => {
    const result = await invokeOpenPocket()
    setView({ view: "Pocket Sync", selected: null })
    setPocketPath(result)
    if (result === null) {
      setAttempts((a) => a + 1)
    } else {
      setReconnectWhenOpened((r) => ({ ...r, path: result }))
      setAttempts(0)
    }
  }, [setView, setPocketPath, setReconnectWhenOpened])

  if (pocketPath) {
    return <Layout />
  }

  return (
    <div className="container">
      <h1>{t("app_name")}</h1>

      <Suspense fallback={<div style={{ flexGrow: 1 }}></div>}>
        <Pocket move="spin" />
      </Suspense>

      {attempts > 0 && <Tip>{t("not_pocket_tip")}</Tip>}

      <div className="row">
        <button type="button" onClick={() => onOpenPocket()}>
          {t("connect_button")}
        </button>
      </div>
      <NewsFeed />
    </div>
  )
}
