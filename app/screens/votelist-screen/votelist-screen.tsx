import * as React from "react"
import { View, Image, SafeAreaView, Alert, RefreshControl, TouchableOpacity } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { Button, Header, Screen, Text } from "../../components"
import { color, spacing } from "../../theme"
import { firebase } from "@react-native-firebase/auth"
import database from "@react-native-firebase/database"
import { wait, dateformat } from "../../theme/utils"
import * as styles from "../../theme/styles"

const like = require("../../theme/img/like.png")
const fire = require("../../theme/img/fire.png")
const crown = require("../../theme/img/crown.png")

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

    list.sort((a, b) => {
      if (a.startTime.timestamp > b.startTime.timestamp) {
        return -1
      }
      if (a.startTime.timestamp < b.startTime.timestamp) {
        return 1
      }
      return 0
    })

    setVotes(list)
  }

  React.useEffect(() => {
    const currentUser = firebase.auth().currentUser
    setUser(currentUser)

    setRefreshing(true)
    const ref = database().ref("votes")
    ref.on("value", onVoteListChange)
    setRefreshing(false)

    return () => ref.off("value", onVoteListChange)
  }, [])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)

    wait(2000).then(() => setRefreshing(false))
  }, [refreshing])

  const voteOnItem = async (voteKey: string, itemKey: string) => {
    const oldVote = votes.filter(v => v.key === voteKey)[0]

    if (oldVote.startTime.timestamp > new Date().getTime()) {
      Alert.alert("아직 투표가 시작되지 않았습니다!")
      return
    }

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

    if (oldVote.voter) {
      oldVote.voter.push(user.uid)
    } else {
      oldVote.voter = [user.uid]
    }

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
    Alert.alert(
      "설정하기",
      "투표 제목을 수정하고 삭제할 수 있습니다.",
      [
        {
          text: "수정하기",
          onPress: () =>
            props.navigation.navigate("createVote", {
              voteKey: vote.key,
            }),
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

  const renderEndVoteItems = vote => {
    let max = 0
    let highScoreItem = []
    let result
    vote.items.forEach(item => {
      if (item.count !== 0 && item.count >= max) {
        max = item.count
        highScoreItem.push(item.value)
      }
    })

    if (!vote.voter || max === 0) {
      // 아무도 투표를 하지 않음
      result = (
        <View>
          <Text
            text="투표 결과"
            style={{ ...styles.TEXT, ...styles.BOLD, marginBottom: spacing[3] }}
          />
          <View style={styles.VOTE_ITEM_ACTIVE}>
            <Text style={styles.VOTE_ITEM_TEXT} text="승자가 없네요ㅠㅠ" />
            <View style={styles.VOTE_ITEM_COUNT_WRAP}>
              <Image source={crown} style={styles.VOTE_LIKE} />
            </View>
          </View>
        </View>
      )
    } else {
      result = (
        <View>
          <Text
            text="투표 결과"
            style={{ ...styles.TEXT, ...styles.BOLD, marginBottom: spacing[3] }}
          />
          {highScoreItem.map((item: string, i: number) => {
            return (
              <View
                key={`${new Date().getTime()}${item}`}
                style={{ ...styles.VOTE_ITEM_ACTIVE, marginVertical: 2 }}
              >
                <Text style={styles.VOTE_ITEM_TEXT} text={item} />
                <View style={styles.VOTE_ITEM_COUNT_WRAP}>
                  <Image source={crown} style={styles.VOTE_LIKE} />
                  <Text style={styles.VOTE_COUNT} text={`${max}`} />
                </View>
              </View>
            )
          })}
        </View>
      )
    }

    return (
      <View>
        {result}
        <View style={{ marginTop: spacing[4] }}>
          <Text
            text="투표 항목"
            style={{ ...styles.TEXT, ...styles.BOLD, marginBottom: spacing[3] }}
          />
          {vote.items.map(item => {
            return (
              <View
                key={`${item.value}${item.count}`}
                style={
                  item.voter && item.voter.includes(user.uid)
                    ? styles.VOTE_ITEM_ACTIVE
                    : styles.VOTE_ITEM_INACTIVE
                }
              >
                <Text style={styles.VOTE_ITEM_TEXT} text={item.value} />
                <View style={styles.VOTE_ITEM_COUNT_WRAP}>
                  {item.voter && item.voter.includes(user.uid) && (
                    <Image source={like} style={styles.VOTE_LIKE} />
                  )}
                  <Text style={styles.VOTE_COUNT} text={item.count || "0"} />
                </View>
              </View>
            )
          })}
        </View>
      </View>
    )
  }

  const renderProgressVoteItems = vote => {
    return vote.items.map((item: any) => {
      return (
        <TouchableOpacity
          key={`${item.value}${item.count}`}
          style={
            item.voter && item.voter.includes(user.uid)
              ? styles.VOTE_ITEM_ACTIVE
              : styles.VOTE_ITEM_INACTIVE
          }
          onPress={() => {
            voteOnItem(vote.key, item.key)
          }}
        >
          <Text style={styles.VOTE_ITEM_TEXT} text={item.value} />
          <View style={styles.VOTE_ITEM_COUNT_WRAP}>
            {item.voter && item.voter.includes(user.uid) && (
              <Image source={like} style={styles.VOTE_LIKE} />
            )}
            <Text style={styles.VOTE_COUNT} text={item.count || "0"} />
          </View>
        </TouchableOpacity>
      )
    })
  }

  return (
    <View style={styles.FULL}>
      <Screen
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        style={styles.CONTAINER}
        preset="scroll"
        backgroundColor={color.palette.lighterPink}
      >
        <Header
          headerText="투표를 만들고 참여하세요 🗳"
          style={styles.HEADER}
          titleStyle={styles.HEADER_TITLE}
        />
        {votes &&
          votes.map((vote: any) => {
            return (
              <TouchableOpacity
                key={vote.key}
                onPress={() =>
                  props.navigation.navigate("voteDetail", {
                    voteKey: vote.key,
                  })
                }
              >
                <View style={styles.VOTE_CONTAINER}>
                  <View style={styles.VOTE_HEADER}>
                    <View style={{ ...styles.VOTE_HEADER_STATUS, justifyContent: "space-between" }}>
                      <View style={styles.VOTE_HEADER_STATUS}>
                        {vote.deadline.timestamp > new Date().getTime() ? (
                          <>
                            <Text style={styles.VOTE_STATUS_ACTIVE} text="진행중" />
                            <Image source={fire} style={styles.VOTE_FIRE} />
                          </>
                        ) : (
                          <Text style={styles.VOTE_STATUS_INACTIVE} text="종료됨" />
                        )}
                      </View>
                      {vote.uid === user.uid && (
                        <TouchableOpacity onPress={() => manageVote(vote)}>
                          <Text style={styles.VOTE_STATUS_ACTIVE} text="투표 설정" />
                        </TouchableOpacity>
                      )}
                    </View>
                    <Text style={styles.VOTE_HEADER_TEXT} text={vote.title} />
                    <View>
                      <Text
                        text={`투표 시작: ${dateformat(vote.startTime.timestamp)}`}
                        style={styles.VOTE_INFO}
                      />
                      <Text
                        text={`투표 마감: ${dateformat(vote.deadline.timestamp)}`}
                        style={styles.VOTE_INFO}
                      />
                      <Text text={`생성자: ${vote.author}`} style={styles.VOTE_INFO} />
                    </View>
                  </View>
                  {vote.deadline.timestamp < new Date().getTime()
                    ? renderEndVoteItems(vote)
                    : renderProgressVoteItems(vote)}
                </View>
              </TouchableOpacity>
            )
          })}
      </Screen>
      <SafeAreaView style={styles.FOOTER}>
        <View style={styles.FOOTER_CONTENT}>
          <Button
            style={styles.MAKE_VOTE_BUTTON}
            textStyle={styles.MAKE_VOTE_BUTTON_TEXT}
            text="투표 생성"
            onPress={nextScreen}
          />
        </View>
      </SafeAreaView>
    </View>
  )
}
