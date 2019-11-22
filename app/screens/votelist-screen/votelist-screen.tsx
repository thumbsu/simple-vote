import * as React from "react"
import {
  View,
  Image,
  ViewStyle,
  TextStyle,
  ImageStyle,
  SafeAreaView,
  Alert,
  RefreshControl,
} from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { Button, Header, Screen, Text } from "../../components"
import { color, spacing } from "../../theme"
import { TouchableOpacity } from "react-native-gesture-handler"
import { firebase } from "@react-native-firebase/auth"
import database from "@react-native-firebase/database"

const like = require("./like.png")
const fire = require("./fire.png")
const crown = require("./crown.png")

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
  borderBottomWidth: 2,
  borderLeftColor: color.palette.lightPink,
  borderBottomColor: color.palette.lightPink,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}
const VOTE_ITEM_ACTIVE: ViewStyle = {
  padding: 12,
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

const wait = (timeout: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout)
  })
}

export interface VotelistScreenProps extends NavigationScreenProps<{}> {}

export const VotelistScreen: React.FunctionComponent<VotelistScreenProps> = props => {
  const nextScreen = React.useMemo(() => () => props.navigation.navigate("createVote"), [
    props.navigation,
  ])
  const [refreshing, setRefreshing] = React.useState(false)
  const [votes, setVotes] = React.useState([])
  const [user, setUser] = React.useState(null)

  const onVoteListChange = (snapshot: any) => {
    const list = []
    if (snapshot.val()) {
      Object.values(snapshot.val()).forEach((vote: any) => {
        list.push({
          key: vote.id,
          ...vote,
        })
      })
    }

    setVotes(list)
  }

  React.useEffect(() => {
    const currentUser = firebase.auth().currentUser
    setUser(currentUser)

    const ref = database().ref("votes")
    ref.on("value", onVoteListChange)

    return () => ref.off("value", onVoteListChange)
  }, [refreshing])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)

    wait(2000).then(() => setRefreshing(false))
  }, [refreshing])

  const voteOnItem = async (voteKey: string, itemKey: string) => {
    const oldVote = votes.filter(v => v.key === voteKey)[0]

    if (oldVote.deadline.timestamp < new Date().getTime()) {
      Alert.alert("이미 종료된 투표입니다!")
      return
    }

    if (oldVote.voter && oldVote.voter.includes(user.uid)) {
      Alert.alert("이미 투표하셨습니다!")
      return
    }

    oldVote.items.map(item => {
      if (item.key === itemKey) {
        if (!item.voter) {
          item.voter = [user.uid]
          item.count += 1
        } else if (item.voter && !item.voter.includes(user.uid)) {
          item.voter.push(user.uid)
          item.count += 1
        }
      }
      return item
    })

    oldVote.voter = [user.uid]

    const ref = database().ref(`votes/${oldVote.id}`)
    const snapshot = await ref.once("value")

    if (snapshot.val()) {
      try {
        await ref.update(oldVote)
      } catch (e) {
        Alert.alert("서버에서 에러가 발생했습니다. 잠시 후 다시 시도해주세요.")
      }
    }
  }

  const manageVote = async (vote: any) => {
    if (vote.deadline.timestamp < new Date().getTime()) {
      return Alert.alert("이미 종료된 투표입니다.")
    }

    Alert.alert(
      "설정하기",
      "투표 제목을 수정하고 삭제할 수 있습니다.",
      [
        {
          text: "제목 수정하기",
          onPress: () => {
            Alert.prompt("수정하기", "투표 제목을 수정하세요.", async text => {
              console.log(text)
              const ref = database().ref(`votes/${vote.id}`)
              const snapshot = await ref.once("value")

              if (snapshot.val()) {
                try {
                  await ref.update({ ...vote, title: text })
                } catch (e) {
                  Alert.alert("서버에서 에러가 발생했습니다. 잠시 후 다시 시도해주세요.")
                }
              }
            })
          },
        },
        {
          text: "삭제하기",
          onPress: async () => {
            await database()
              .ref(`votes/${vote.id}`)
              .remove(() => {
                Alert.alert("투표가 삭제되었습니다.")
              })
          },
        },
        {
          text: "취소하기",
          style: "cancel",
        },
      ],
      { cancelable: false },
    )
  }

  const renderEndVoteItems = voteItems => {
    let max = 0
    let highScoreItem = ""
    voteItems.forEach(item => {
      if (item.count > max) {
        max = item.count
        highScoreItem = item.value
      }
    })

    if (max === 0) {
      return voteItems.map(item => {
        return (
          <View
            key={`${item.value}${item.count}`}
            style={
              item.voter && item.voter.includes(user.uid) ? VOTE_ITEM_ACTIVE : VOTE_ITEM_INACTIVE
            }
          >
            <Text style={VOTE_ITEM_TEXT} text={item.value} />
            <View style={VOTE_ITEM_COUNT_WRAP}>
              {item.voter && item.voter.includes(user.uid) && (
                <Image source={like} style={VOTE_LIKE} />
              )}
              <Text style={VOTE_COUNT} text={item.count || "0"} />
            </View>
          </View>
        )
      })
    }

    return (
      <View style={VOTE_ITEM_ACTIVE}>
        <Text style={VOTE_ITEM_TEXT} text={highScoreItem} />
        <View style={VOTE_ITEM_COUNT_WRAP}>
          <Image source={crown} style={VOTE_LIKE} />
          <Text style={VOTE_COUNT} text={`${max}`} />
        </View>
      </View>
    )
  }

  return (
    <View style={FULL}>
      <Screen
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        style={CONTAINER}
        preset="scroll"
        backgroundColor={color.palette.lighterPink}
      >
        <Header headerText="투표를 만들고 참여하세요 🗳" style={HEADER} titleStyle={HEADER_TITLE} />
        {votes &&
          votes.map((vote: any) => {
            return (
              <View key={vote.key} style={VOTE_CONTAINER}>
                <View style={VOTE_HEADER}>
                  <View style={{ ...VOTE_HEADER_STATUS, justifyContent: "space-between" }}>
                    {vote.deadline.timestamp > new Date().getTime() ? (
                      <View style={VOTE_HEADER_STATUS}>
                        <Text style={VOTE_STATUS_ACTIVE} text="진행중" />
                        <Image source={fire} style={VOTE_FIRE} />
                      </View>
                    ) : (
                      <View style={VOTE_HEADER_STATUS}>
                        <Text style={VOTE_STATUS_INACTIVE} text="종료됨" />
                      </View>
                    )}
                    {vote.uid === user.uid && (
                      <TouchableOpacity onPress={() => manageVote(vote)}>
                        <Text style={VOTE_STATUS_ACTIVE} text="투표 설정" />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={VOTE_HEADER_TEXT} text={vote.title} />
                </View>
                {vote.deadline.timestamp < new Date().getTime()
                  ? renderEndVoteItems(vote.items)
                  : vote.items.map((item: any) => {
                      return (
                        <TouchableOpacity
                          key={`${item.value}${item.count}`}
                          style={
                            item.voter && item.voter.includes(user.uid)
                              ? VOTE_ITEM_ACTIVE
                              : VOTE_ITEM_INACTIVE
                          }
                          onPress={() => {
                            voteOnItem(vote.key, item.key)
                          }}
                        >
                          <Text style={VOTE_ITEM_TEXT} text={item.value} />
                          <View style={VOTE_ITEM_COUNT_WRAP}>
                            {item.voter && item.voter.includes(user.uid) && (
                              <Image source={like} style={VOTE_LIKE} />
                            )}
                            <Text style={VOTE_COUNT} text={item.count || "0"} />
                          </View>
                        </TouchableOpacity>
                      )
                    })}
              </View>
            )
          })}
      </Screen>
      <SafeAreaView style={FOOTER}>
        <View style={FOOTER_CONTENT}>
          <Button
            style={MAKE_VOTE_BUTTON}
            textStyle={MAKE_VOTE_BUTTON_TEXT}
            text="투표 생성"
            onPress={nextScreen}
          />
        </View>
      </SafeAreaView>
    </View>
  )
}
