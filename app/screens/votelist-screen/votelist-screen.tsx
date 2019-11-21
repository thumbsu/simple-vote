import * as React from "react"
import { View, Image, ViewStyle, TextStyle, ImageStyle, SafeAreaView, Alert } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { Button, Header, Screen, Text, Wallpaper } from "../../components"
import { color, spacing } from "../../theme"
import { TouchableOpacity } from "react-native-gesture-handler"
const like = require("./like.png")
const fire = require("./fire.png")

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
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
const VOTE_CONTAINER: ViewStyle = {
  marginTop: 20,
}
const VOTE_HEADER: ViewStyle = {
  paddingVertical: 10,
}
const VOTE_HEADER_STATUS: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}
const VOTE_HEADER_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 22,
  letterSpacing: 1.2,
}
const VOTE_STATUS_ACTIVE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
}
const VOTE_FIRE: ImageStyle = {
  width: 13,
  height: 13,
  resizeMode: "contain",
}
const VOTE_STATUS_INACTIVE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
}
const VOTE_ITEM_INACTIVE: ViewStyle = {
  marginVertical: 5,
  padding: 8,
  borderLeftWidth: 2,
  borderLeftColor: color.palette.lightPink,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}
const VOTE_ITEM_ACTIVE: ViewStyle = {
  padding: 8,
  backgroundColor: color.palette.lightPink,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}
const VOTE_ITEM_TEXT: TextStyle = {
  ...TEXT,
  fontSize: 18,
}
const VOTE_ITEM_COUNT_WRAP: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}
const VOTE_LIKE: ImageStyle = {
  width: 18,
  height: 18,
  resizeMode: "contain",
}
const VOTE_COUNT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 18,
  marginLeft: 10,
}
const TITLE_WRAPPER: TextStyle = {
  ...TEXT,
  textAlign: "center",
}
const TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
}
const ALMOST: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 26,
  fontStyle: "italic",
}
const BOWSER: ImageStyle = {
  alignSelf: "center",
  marginVertical: spacing[5],
  maxWidth: "100%",
}
const CONTENT: TextStyle = {
  ...TEXT,
  color: "#BAB6C8",
  fontSize: 15,
  lineHeight: 22,
  marginBottom: spacing[5],
}
const MAKE_VOTE_BUTTON: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: color.palette.lightPink,
}
const MAKE_VOTE_BUTTON_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}
const FOOTER: ViewStyle = { backgroundColor: color.palette.babyPink }
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}

export interface VotelistScreenProps extends NavigationScreenProps<{}> {}

export const VotelistScreen: React.FunctionComponent<VotelistScreenProps> = props => {
  const nextScreen = React.useMemo(() => () => props.navigation.navigate("demo"), [
    props.navigation,
  ])

  return (
    <View style={FULL}>
      <Screen style={CONTAINER} preset="scroll" backgroundColor={color.palette.lighterPink}>
        <Header headerTx="votelistScreen.miniTitle" style={HEADER} titleStyle={HEADER_TITLE} />
        <View style={VOTE_CONTAINER}>
          <View style={VOTE_HEADER}>
            <View style={VOTE_HEADER_STATUS}>
              <Text style={VOTE_STATUS_ACTIVE} text="진행중" />
              <Image source={fire} style={VOTE_FIRE} />
            </View>
            <Text style={VOTE_HEADER_TEXT} text="투표 제목" />
          </View>
          <TouchableOpacity
            style={VOTE_ITEM_INACTIVE}
            onPress={() => {
              Alert.alert("투표")
            }}
          >
            <Text style={VOTE_ITEM_TEXT} text="투표 항목" />
            <Text style={VOTE_COUNT} text="1" />
          </TouchableOpacity>
          <TouchableOpacity
            style={VOTE_ITEM_ACTIVE}
            onPress={() => {
              Alert.alert("투표")
            }}
          >
            <Text style={VOTE_ITEM_TEXT} text="투표한 것" />
            <View style={VOTE_ITEM_COUNT_WRAP}>
              <Image source={like} style={VOTE_LIKE} />
              <Text style={VOTE_COUNT} text="1" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={VOTE_CONTAINER}>
          <View style={VOTE_HEADER}>
            <Text style={VOTE_STATUS_INACTIVE} text="종료됨" />
            <Text style={VOTE_HEADER_TEXT} text="투표 제목" />
          </View>
          <TouchableOpacity
            style={VOTE_ITEM_INACTIVE}
            onPress={() => {
              Alert.alert("투표")
            }}
          >
            <Text style={VOTE_ITEM_TEXT} text="투표 항목" />
            <Text style={VOTE_COUNT} text="1" />
          </TouchableOpacity>
          <TouchableOpacity
            style={VOTE_ITEM_ACTIVE}
            onPress={() => {
              Alert.alert("투표")
            }}
          >
            <Text style={VOTE_ITEM_TEXT} text="투표한 것" />
            <View style={VOTE_ITEM_COUNT_WRAP}>
              <Image source={like} style={VOTE_LIKE} />
              <Text style={VOTE_COUNT} text="1" />
            </View>
          </TouchableOpacity>
        </View>
      </Screen>
      <SafeAreaView style={FOOTER}>
        <View style={FOOTER_CONTENT}>
          <Button
            style={MAKE_VOTE_BUTTON}
            textStyle={MAKE_VOTE_BUTTON_TEXT}
            tx="votelistScreen.makeVoteButton"
            onPress={nextScreen}
          />
        </View>
      </SafeAreaView>
    </View>
  )
}
