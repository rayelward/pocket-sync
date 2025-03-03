import { useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import {
  PocketSyncConfigSelector,
  skipAlternateAssetsSelector,
} from "../../recoil/config/selectors"
import { useUpdateConfig } from "./hooks/useUpdateConfig"

import "./index.css"
import { reconnectWhenOpenedAtom } from "../../recoil/atoms"
import { invokeClearFileCache } from "../../utils/invokes"
import { useTranslation, Trans } from "react-i18next"
import { useDisconnectPocket } from "../../hooks/useDisconnectPocket"
import { Thanks } from "./thanks"

export const Settings = () => {
  const config = useRecoilValue(PocketSyncConfigSelector)
  const [archiveUrlInput, setArchiveUrl] = useState(config.archive_url || "")
  const skipAlternateAssets = useRecoilValue(skipAlternateAssetsSelector)
  const [reconnectWhenOpened, setReconnectWhenOpened] = useRecoilState(
    reconnectWhenOpenedAtom
  )
  const updateConfig = useUpdateConfig()
  const { t } = useTranslation("settings")
  const onDisconnect = useDisconnectPocket()

  return (
    <div className="settings">
      <div className="settings__items">
        <div className="settings__row">
          <h3 className="settings__row-title">{t("3d_pocket.title")}</h3>

          <select
            value={config.colour}
            onChange={({ target }) =>
              updateConfig("colour", target.value as "black" | "white")
            }
          >
            <option value="black">{t("3d_pocket.black")}</option>
            <option value="white">{t("3d_pocket.white")}</option>
          </select>
        </div>

        <div className="settings__row">
          <h3 className="settings__row-title">{t("archive.title")}</h3>
          <div className="settings__ramble">{t("archive.warning")}</div>
          {/* eslint-disable-next-line react/jsx-no-literals */}
          <pre>{"https://archive.org/download/openFPGA-Files"}</pre>
          <div className="settings__text-input-and-save">
            <input
              type="text"
              className="settings__text-input"
              value={archiveUrlInput}
              onChange={({ target }) => setArchiveUrl(target.value)}
            />
            <button
              onClick={() => updateConfig("archive_url", archiveUrlInput)}
            >
              {t("archive.save")}
            </button>
          </div>
        </div>

        <div className="settings__row">
          <h3 className="settings__row-title">{t("alternate_skip.title")}</h3>
          <div className="settings__ramble">{t("alternate_skip.ramble_1")}</div>
          <div
            className="settings__ramble"
            dangerouslySetInnerHTML={{ __html: t("alternate_skip.ramble_2") }}
          ></div>
          <label className="settings__checkbox">
            {t("alternate_skip.checkbox")}
            <input
              type="checkbox"
              checked={skipAlternateAssets}
              onChange={({ target }) =>
                updateConfig("skipAlternateAssets", target.checked)
              }
            />
          </label>
        </div>

        <div className="settings__row">
          <h3 className="settings__row-title">{t("reconnect.title")}</h3>
          <div className="settings__ramble">
            <Trans
              t={t}
              i18nKey="reconnect.ramble"
              values={{ ppath: reconnectWhenOpened.path }}
            >
              {"_"}
              <pre>{"_"}</pre>
              {"_"}
            </Trans>
          </div>
          <label className="settings__checkbox">
            {t("reconnect.checkbox")}
            <input
              type="checkbox"
              checked={reconnectWhenOpened.enable}
              onChange={({ target }) => {
                setReconnectWhenOpened((r) => ({
                  ...r,
                  enable: target.checked,
                }))
              }}
            />
          </label>
        </div>

        <div className="settings__row">
          <h3 className="settings__row-title">{t("clear_file_cache.title")}</h3>
          <div className="settings__ramble">{t("clear_file_cache.ramble")}</div>
          <label className="settings__checkbox">
            <button onClick={() => invokeClearFileCache()}>
              {t("clear_file_cache.button")}
            </button>
          </label>
        </div>

        <div className="settings__row">
          <h3 className="settings__row-title">{t("disconnect.title")}</h3>
          <div className="settings__ramble">{t("disconnect.ramble")}</div>
          <label className="settings__checkbox">
            <button onClick={() => onDisconnect()}>
              {t("disconnect.button")}
            </button>
          </label>
        </div>
      </div>

      <Thanks />
    </div>
  )
}
