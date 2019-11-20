import * as React from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { Screen, Text } from "../components"
// import { useStores } from "../models/root-store"
import { color } from "../theme"
import { NavigationScreenProps } from "react-navigation"
import { firebase } from "@react-native-firebase/auth"


export interface AuthloadingScreenProps extends NavigationScreenProps<{}> {
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
}

export const AuthloadingScreen: React.FunctionComponent<AuthloadingScreenProps> = observer((props) => {
  // const { someStore } = useStores()
  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      props.navigation.navigate(user ? "primary" : "signin")
    })
  })
  return (
    <Screen style={ROOT} preset="scroll">
      <Text preset="header" text="Auth loading" />
    </Screen>
  )
})
