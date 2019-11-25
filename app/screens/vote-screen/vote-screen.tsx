import * as React from "react"
import { observer } from "mobx-react-lite"
import { View, Image, TouchableOpacity, Alert, RefreshControl } from "react-native"
import { Screen, Text, Header, TextField, Button } from "../../components"
import { color, spacing } from "../../theme"
import { NavigationScreenProps } from "react-navigation"
import database from "@react-native-firebase/database"
import * as styles from "../../theme/styles"
import { firebase } from "@react-native-firebase/auth"
import { wait, dateformat } from "../../theme/utils"

const like = require("../../theme/img/like.png")
const fire = require("../../theme/img/fire.png")
const crown = require("../../theme/img/crown.png")
const del = require("../../theme/img/delete-button.png")

export interface VoteScreenProps extends NavigationScreenProps<{}> {}

export const VoteScreen: React.FunctionComponent<VoteScreenProps> = observer(props => {
  const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])
  const [refreshing, setRefreshing] = React.useState(false)
  const [vote, setVote] = React.useState(null)
  const [user, setUser] = React.useState(null)
  const [comment, setComment] = React.useState("")

  const onVoteChange = (snapshot: any) => {
    if (snapshot.val()) {
      const vote = snapshot.val()
      if (vote.comments) {
        vote.comments.sort((a, b) => {
          if (a.timestamp > b.timestamp) {
            return 1
          }
          if (a.timestamp < b.timestamp) {
            return -1
          }
          return 0
        })
      }
      setVote(vote)
    }
  }

  React.useEffect(() => {
    const currentUser = firebase.auth().currentUser
    setUser(currentUser)
    // @ts-ignore
    const key = props.navigation.getParam("voteKey", undefined)

    setRefreshing(true)
    const ref = database().ref(`votes/${key}`)
    ref.on("value", onVoteChange)
    setRefreshing(false)

    return () => ref.off("value", onVoteChange)
  }, [])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)

    wait(2000).then(() => setRefreshing(false))
  }, [refreshing])

  const saveComment = async () => {
    const ref = database().ref(`votes/${vote.id}`)
    const snapshot = await ref.once("value")

    const newVote = vote
    if (newVote.comments) {
      newVote.comments.push({
        uid: user.uid,
        name: user.displayName,
        value: comment,
        timestamp: new Date().getTime(),
      })
    } else {
      newVote.comments = [
        {
          uid: user.uid,
          name: user.displayName,
          value: comment,
          timestamp: new Date().getTime(),
        },
      ]
    }

    if (snapshot.val()) {
      try {
        await ref.update(newVote)
        setComment("")
      } catch (e) {
        Alert.alert("서버에서 에러가 발생했습니다. 잠시 후 다시 시도해주세요.")
      }
    }
  }

  const delComment = async (i: number) => {
    Alert.alert(
      "댓글 삭제",
      undefined,
      [
        {
          text: "삭제하기",
          onPress: async () => {
            const ref = database().ref(`votes/${vote.id}`)
            const snapshot = await ref.once("value")

            const newVote = vote
            newVote.comments.splice(i, 1)

            if (snapshot.val()) {
              try {
                await ref.update(newVote)
                setComment("")
              } catch (e) {
                Alert.alert("서버에서 에러가 발생했습니다. 잠시 후 다시 시도해주세요.")
              }
            }
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

  const voteOnItem = async (itemKey: string) => {
    const oldVote = vote

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
    let highScoreItem = ""
    let result
    vote.items.forEach(item => {
      if (item.count > max) {
        max = item.count
        highScoreItem = item.value
      }
    })

    if (!vote.voter || vote.voter.length % vote.items.length === max || max === 0) {
      // 모두 똑같은 투표 수거나 아무도 투표를 하지 않음
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
          <View style={styles.VOTE_ITEM_ACTIVE}>
            <Text style={styles.VOTE_ITEM_TEXT} text={highScoreItem} />
            <View style={styles.VOTE_ITEM_COUNT_WRAP}>
              <Image source={crown} style={styles.VOTE_LIKE} />
              <Text style={styles.VOTE_COUNT} text={`${max}`} />
            </View>
          </View>
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
            voteOnItem(item.key)
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

  if (!vote) {
    return <View />
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
          headerText="투표 상세보기"
          leftIcon="backB"
          onLeftPress={goBack}
          style={styles.HEADER}
          titleStyle={styles.HEADER_TITLE}
        />
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
        <View style={styles.COMMENT_CONTAINER}>
          <Text text="댓글" style={styles.COMMENT_HEADER_TEXT} />
          {!vote.comments ? (
            <Text text="아직 댓글이 없습니다." style={styles.COMMENT_INFO_TEXT} />
          ) : (
            <View>
              {vote.comments.map((comment, i) => {
                return (
                  <View
                    key={JSON.stringify(comment.value) + JSON.stringify(comment.uid)}
                    style={styles.COMMENT_TEXT_WRAP}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text text={comment.name} style={styles.COMMENT_TEXT_NAME} />
                      {comment.uid === user.uid ? (
                        <TouchableOpacity onPress={() => delComment(i)}>
                          <Image source={del} style={styles.COMMENT_DEL} />
                        </TouchableOpacity>
                      ) : (
                        undefined
                      )}
                    </View>
                    <Text text={comment.value} style={styles.COMMENT_TEXT} />
                  </View>
                )
              })}
            </View>
          )}
          {vote.deadline.timestamp < new Date().getTime() ? (
            <Text
              text="댓글은 투표 진행 중에만 작성할 수 있습니다."
              style={styles.COMMENT_INFO_TEXT}
            />
          ) : (
            <View style={{ flexDirection: "row" }}>
              <TextField
                placeholder="댓글을 달아주세요."
                inputStyle={styles.INPUT_TEXT}
                value={comment}
                onChangeText={setComment}
                onSubmitEditing={() => saveComment()}
                style={{ flex: 9 }}
              />
              <Button
                text="저장"
                style={styles.COMMENT_SAVE_BUTTON}
                textStyle={styles.COMMENT_SAVE_BUTTON_TEXT}
                onPress={() => saveComment()}
              />
            </View>
          )}
        </View>
      </Screen>
    </View>
  )
})
