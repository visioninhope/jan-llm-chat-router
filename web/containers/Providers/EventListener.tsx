import { Fragment } from 'react'

import React from 'react'

import AppUpdateListener from './AppUpdateListener'
import ClipboardListener from './ClipboardListener'
import DeepLinkListener from './DeepLinkListener'
import DownloadEventListener from './DownloadEventListener'

import KeyListener from './KeyListener'
import ModelEventListener from './ModelEventListener'
import ModelImportListener from './ModelImportListener'
import QuickAskListener from './QuickAskListener'

const EventListenerWrapper: React.FC = () => {
  return (
    <Fragment>
      <AppUpdateListener />
      <KeyListener />
      <DownloadEventListener />
      <ModelEventListener />
      <ClipboardListener />
      <DeepLinkListener />
      <QuickAskListener />
      <ModelImportListener />
    </Fragment>
  )
}

export default EventListenerWrapper
