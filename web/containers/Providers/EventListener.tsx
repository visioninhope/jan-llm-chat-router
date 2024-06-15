import { Fragment } from 'react'

import React from 'react'

import AppUpdateListener from './AppUpdateListener'
import ClipboardListener from './ClipboardListener'
import DeepLinkListener from './DeepLinkListener'
import DownloadEventListener from './DownloadEventListener'

import KeyListener from './KeyListener'
import ModelImportListener from './ModelImportListener'
import QuickAskListener from './QuickAskListener'

const EventListenerWrapper: React.FC = () => {
  // const setInstallingExtension = useSetAtom(setInstallingExtensionAtom)
  // const removeInstallingExtension = useSetAtom(removeInstallingExtensionAtom)

  // const onFileDownloadUpdate = useCallback(
  //   async (state: DownloadState) => {
  //     console.debug('onFileDownloadUpdate', state)
  //     if (state.downloadType === 'extension') {
  //       const installingExtensionState: InstallingExtensionState = {
  //         extensionId: state.extensionId!,
  //         percentage: state.percent,
  //         localPath: state.localPath,
  //       }
  //       setInstallingExtension(state.extensionId!, installingExtensionState)
  //     }
  //   },
  //   [setInstallingExtension]
  // )

  // const onFileDownloadError = useCallback(
  //   (state: DownloadState) => {
  //     console.debug('onFileDownloadError', state)
  //     if (state.downloadType === 'extension') {
  //       removeInstallingExtension(state.extensionId!)
  //     }
  //   },
  //   [removeInstallingExtension]
  // )

  // const onFileDownloadSuccess = useCallback((state: DownloadState) => {
  //   console.debug('onFileDownloadSuccess', state)
  //   events.emit(ModelEvent.OnModelsUpdate, {})
  // }, [])

  // const onFileUnzipSuccess = useCallback(
  //   (state: DownloadState) => {
  //     console.debug('onFileUnzipSuccess', state)
  //     toaster({
  //       title: 'Success',
  //       description: `Install ${formatExtensionsName(state.extensionId!)} successfully.`,
  //       type: 'success',
  //     })
  //     removeInstallingExtension(state.extensionId!)
  //   },
  //   [removeInstallingExtension]
  // )

  // useEffect(() => {
  //   console.debug('EventListenerWrapper: registering event listeners...')
  //   events.on(DownloadEvent.onFileDownloadUpdate, onFileDownloadUpdate)
  //   events.on(DownloadEvent.onFileDownloadError, onFileDownloadError)
  //   events.on(DownloadEvent.onFileDownloadSuccess, onFileDownloadSuccess)
  //   events.on(DownloadEvent.onFileUnzipSuccess, onFileUnzipSuccess)

  //   return () => {
  //     console.debug('EventListenerWrapper: unregistering event listeners...')
  //     events.off(DownloadEvent.onFileDownloadUpdate, onFileDownloadUpdate)
  //     events.off(DownloadEvent.onFileDownloadError, onFileDownloadError)
  //     events.off(DownloadEvent.onFileDownloadSuccess, onFileDownloadSuccess)
  //     events.off(DownloadEvent.onFileUnzipSuccess, onFileUnzipSuccess)
  //   }
  // }, [
  //   onFileDownloadUpdate,
  //   onFileDownloadError,
  //   onFileDownloadSuccess,
  //   onFileUnzipSuccess,
  // ])

  return (
    <Fragment>
      <AppUpdateListener />
      <KeyListener />
      <DownloadEventListener />
      <ClipboardListener />
      <DeepLinkListener />
      <QuickAskListener />
      <ModelImportListener />
    </Fragment>
  )
}

export default EventListenerWrapper
