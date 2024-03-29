// Welcome to the main entry point of the app.
//
// In this file, we'll be kicking off our app or storybook.

import "./i18n"
import React, { useState, useEffect } from "react"
import { AppRegistry, YellowBox } from "react-native"
import { StatefulNavigator, BackButtonHandler, exitRoutes } from "./navigation"
import { RootStore, RootStoreProvider, setupRootStore } from "./models/root-store"

import { contains } from "ramda"
import { enableScreens } from "react-native-screens"

import { GoogleSignin } from "@react-native-community/google-signin"
import database from '@react-native-firebase/database';

import { Buffer } from 'buffer';
global.Buffer = Buffer; // very important

// This puts screens in a native ViewController or Activity. If you want fully native
// stack navigation, use `createNativeStackNavigator` in place of `createStackNavigator`:
// https://github.com/kmagiera/react-native-screens#using-native-stack-navigator
enableScreens()

/**
 * Ignore some yellowbox warnings. Some of these are for deprecated functions
 * that we haven't gotten around to replacing yet.
 */
YellowBox.ignoreWarnings([
  "componentWillMount is deprecated",
  "componentWillReceiveProps is deprecated",
])

/**
 * Storybook still wants to use ReactNative's AsyncStorage instead of the
 * react-native-community package; this causes a YellowBox warning. This hack
 * points RN's AsyncStorage at the community one, fixing the warning. Here's the
 * Storybook issue about this: https://github.com/storybookjs/storybook/issues/6078
 */
const ReactNative = require("react-native")
Object.defineProperty(ReactNative, "AsyncStorage", {
  get(): any {
    return require("@react-native-community/async-storage").default
  },
})

/**
 * Are we allowed to exit the app?  This is called when the back button
 * is pressed on android.
 *
 * @param routeName The currently active route name.
 */
const canExit = (routeName: string) => contains(routeName, exitRoutes)

const googleSigninConfigure = async () => {
  await GoogleSignin.configure({
    scopes: [],
    webClientId: "574138143626-9d535pg995uj3fqms5nmks22htal3mrl.apps.googleusercontent.com",
  })
}
 
database().setPersistenceEnabled(true);
database().setPersistenceCacheSizeBytes(2000000); // 2MB

/**
 * This is the root component of our app.
 */
export const App: React.FunctionComponent<{}> = () => {
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined) // prettier-ignore
  useEffect(() => {
    setupRootStore().then(setRootStore)
    googleSigninConfigure()
  }, [])

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  //
  // This step should be completely covered over by the splash screen though.
  //
  // You're welcome to swap in your own component to render if your boot up
  // sequence is too slow though.
  if (!rootStore) {
    return null
  }

  // otherwise, we're ready to render the app
  return (
    <RootStoreProvider value={rootStore}>
      <BackButtonHandler canExit={canExit}>
        <StatefulNavigator />
      </BackButtonHandler>
    </RootStoreProvider>
  )
}

/**
 * This needs to match what's found in your app_delegate.m and MainActivity.java.
 */
const APP_NAME = "voteApp"

// Should we show storybook instead of our app?
//
// ⚠️ Leave this as `false` when checking into git.
const SHOW_STORYBOOK = false

let RootComponent = App
if (__DEV__) {
  // Only include Storybook if we're in dev mode
  const { StorybookUIRoot } = require("../storybook")

  if (SHOW_STORYBOOK) RootComponent = StorybookUIRoot
}
AppRegistry.registerComponent(APP_NAME, () => RootComponent)
