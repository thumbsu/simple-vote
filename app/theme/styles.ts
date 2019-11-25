import { ViewStyle, TextStyle, ImageStyle } from "react-native"
import { spacing, color } from "."

export const FULL: ViewStyle = { flex: 1 }
export const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
  paddingBottom: spacing[4],
}
export const TEXT: TextStyle = {
  color: color.palette.black,
  fontFamily: "Montserrat",
}
export const BOLD: TextStyle = { fontWeight: "bold" }
export const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
}
export const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
export const VOTE_CONTAINER: ViewStyle = {
  marginTop: 20,
}
export const VOTE_HEADER: ViewStyle = {
  paddingVertical: 10,
}
export const VOTE_HEADER_STATUS: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}
export const VOTE_HEADER_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 22,
  letterSpacing: 1.2,
}
export const VOTE_STATUS_ACTIVE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
}
export const VOTE_FIRE: ImageStyle = {
  width: 13,
  height: 13,
  resizeMode: "contain",
}
export const VOTE_STATUS_INACTIVE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
}
export const VOTE_ITEM_INACTIVE: ViewStyle = {
  marginVertical: 5,
  padding: 8,
  borderLeftWidth: 2,
  borderBottomWidth: 2,
  borderLeftColor: color.palette.lightPink,
  borderBottomColor: color.palette.lightPink,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}
export const VOTE_ITEM_ACTIVE: ViewStyle = {
  padding: 12,
  backgroundColor: color.palette.lightPink,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}
export const VOTE_ITEM_TEXT: TextStyle = {
  ...TEXT,
  fontSize: 18,
}
export const VOTE_ITEM_COUNT_WRAP: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}
export const VOTE_LIKE: ImageStyle = {
  width: 18,
  height: 18,
  resizeMode: "contain",
}
export const VOTE_COUNT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 18,
  marginLeft: 10,
}
export const MAKE_VOTE_BUTTON: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: color.palette.lightPink,
}
export const MAKE_VOTE_BUTTON_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}
export const FOOTER: ViewStyle = { backgroundColor: color.palette.babyPink }
export const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}
export const VOTE_INFO: TextStyle = {
  ...TEXT,
  fontSize: 12,
}
export const INPUT_TEXT: TextStyle = {
  ...TEXT,
  padding: 10,
  color: color.palette.black,
}
export const VOTE_ITEM_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
}
export const ADD_VOTE_ITEM: ViewStyle = {
  marginVertical: spacing[3],
  paddingVertical: 15,
  paddingHorizontal: spacing[3],
  borderRadius: 0,
  backgroundColor: color.palette.white,
}
export const ADD_VOTE_ITEM_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
  textAlign: "left",
  color: "gray",
}
export const VOTE_TIME_SETTING: ViewStyle = {
  paddingVertical: spacing[3],
  flexDirection: "row",
  justifyContent: "space-between",
}
export const VOTE_DATE_TEXT: TextStyle = {
  ...TEXT,
}
export const VOTE_TIME_TEXT: TextStyle = {
  ...TEXT,
}
export const VOTE_ITEM_DEL: ViewStyle = {
  marginLeft: spacing[4],
  padding: 0,
  borderRadius: 0,
  marginVertical: spacing[3],
  backgroundColor: color.palette.lightPink,
}
export const VOTE_ITEM_DEL_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 15,
}
export const COMMENT_CONTAINER: ViewStyle = {
  paddingVertical: spacing[4],
  marginTop: spacing[4],
}
export const COMMENT_HEADER_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 16,
  letterSpacing: 2,
}
export const COMMENT_INFO_TEXT: TextStyle = {
  ...TEXT,
  marginTop: spacing[2],
  fontSize: 13,
  letterSpacing: 2,
}
export const COMMENT_SAVE_BUTTON: ViewStyle = {
  marginLeft: spacing[4],
  padding: 0,
  borderRadius: 0,
  marginVertical: spacing[3],
  backgroundColor: color.palette.lightPink,
}
export const COMMENT_SAVE_BUTTON_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 15,
}
export const COMMENT_TEXT_WRAP: ViewStyle = {
  paddingVertical: spacing[2],
}
export const COMMENT_TEXT_NAME: TextStyle = {
  ...TEXT,
  ...BOLD,
  color: color.palette.babyPink,
  marginTop: 2,
  letterSpacing: 2,
}
export const COMMENT_TEXT: TextStyle = {
  ...TEXT,
  letterSpacing: 2,
}
export const COMMENT_DEL: ImageStyle = {
  width: 15,
  height: 15,
  resizeMode: "contain",
}