import * as React from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, TextStyle, View } from "react-native"
import { Screen, Text, Button, Header } from "../../components"
import { color, spacing } from "../../theme"
import { NavigationScreenProps } from "react-navigation"
import { GoogleSignin } from "@react-native-community/google-signin"
import { firebase } from "@react-native-firebase/auth"
import database from "@react-native-firebase/database"

export interface SigninScreenProps extends NavigationScreenProps<{}> {}

const FULL: ViewStyle = {
  flex: 1,
  backgroundColor: color.palette.lightPink,
}
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = {
  color: color.palette.black,
  fontFamily: "Montserrat",
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "left",
}
const SUB_TITLE: TextStyle = {
  ...TEXT,
  fontSize: 18,
  lineHeight: 38,
  textAlign: "left",
}
const BUTTON: ViewStyle = {
  marginTop: 10,
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: color.palette.prettyPink,
}
const BUTTON_TEXT: TextStyle = {
  ...BOLD,
  color: color.palette.white,
  fontFamily: "Montserrat",
  fontSize: 13,
  letterSpacing: 2,
}

export const SigninScreen: React.FunctionComponent<SigninScreenProps> = observer(props => {
  const googleSignin = async () => {
    try {
      const { idToken } = await GoogleSignin.signIn()
      const credential = firebase.auth.GoogleAuthProvider.credential(idToken)
      await firebase.auth().signInWithCredential(credential)
      const user = firebase.auth().currentUser

      const ref = database().ref(`/users/${user.uid}`)
      const snapshot = await ref.once("value")

      if (!snapshot.val()) {
        await ref.set({
          uid: user.uid,
          name: user.displayName,
          role: "member",
        })
      }

      if (user) {
        props.navigation.navigate("primary")
      } else {
        props.navigation.navigate("signin")
      }
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <View style={FULL}>
      <Screen style={CONTAINER} backgroundColor={color.transparent} statusBar="dark-content">
        <Header headerText="Simple Vote! 🗳" style={HEADER} titleStyle={HEADER_TITLE} />
        <Text style={TITLE} text="Welcome everyone!" />
        <Text style={SUB_TITLE} text="🔻Log in with Google and try.🔻" />
        <Button
          style={BUTTON}
          textStyle={BUTTON_TEXT}
          text="구글 계정으로 로그인"
          onPress={googleSignin}
        />
      </Screen>
    </View>
  )
})
