import * as React from "react"
import { Platform, View, SafeAreaView, Alert, TouchableOpacity } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { Button, Header, Text, Screen, TextField } from "../../components"
import { color } from "../../theme"
import DateTimePicker from "@react-native-community/datetimepicker"
import { firebase } from "@react-native-firebase/auth"
import database from "@react-native-firebase/database"
import uuid from "react-native-uuid"
import * as styles from "../../theme/styles"

export interface CreateVoteScreenProps extends NavigationScreenProps<{}> {}

export const CreateVoteScreen: React.FunctionComponent<CreateVoteScreenProps> = props => {
  const goBack = React.useMemo(() => () => props.navigation.goBack(null), [props.navigation])

  const [voteKey, setVoteKey] = React.useState(null)
  const [sd, setSd] = React.useState(new Date())
  const [sdShow, setSdShow] = React.useState(false)
  const [sdMode, setSdMode] = React.useState("date")
  const [dl, setDl] = React.useState(new Date(new Date().setHours(sd.getHours() + 7)))
  const [dlShow, setDlShow] = React.useState(false)
  const [dlMode, setDlMode] = React.useState("date")
  const [title, setTitle] = React.useState("")
  const [items, setItems] = React.useState([
    { key: uuid.v4(), value: "", count: 0 },
    { key: uuid.v4(), value: "", count: 0 },
    { key: uuid.v4(), value: "", count: 0 },
  ])

  React.useEffect(() => {
    // @ts-ignore
    const key = props.navigation.getParam("voteKey", undefined)

    if (key) {
      getVote(key)
      setVoteKey(key)
    }
  }, [props.navigation])

  const getVote = async (key: string) => {
    const ref = database().ref(`votes/${key}`)
    const snapshot = await ref.once("value")

    if (snapshot.val()) {
      const vote = snapshot.val()
      setDl(new Date(vote.deadline.timestamp))
      setSd(new Date(vote.startTime.timestamp))
      setTitle(vote.title)
      setItems(vote.items)
    }
  }

  const dateformat = (date: Date) =>
    `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`

  const _setSd = (e, changeDate) => {
    changeDate = changeDate || sd
    if (Platform.OS !== "ios") setSdShow(false)

    if (sdMode === "time") {
      changeDate = new Date(
        new Date(changeDate).setFullYear(sd.getFullYear(), sd.getMonth(), sd.getDate()),
      )
    }

    if (changeDate < new Date()) {
      Alert.alert("과거의 시간을 선택할 수 없습니다.")
      return
    }
    setSd(changeDate)
    const newDl = new Date(changeDate)
    setDl(new Date(newDl.setHours(newDl.getHours() + 7)))
  }

  const _setSdMode = changeMode => {
    setSdShow(true)
    setSdMode(changeMode)
  }

  const _setDl = (e, changeDate) => {
    changeDate = changeDate || dl
    if (Platform.OS !== "ios") setDlShow(false)

    if (dlMode === "time") {
      changeDate = new Date(
        new Date(changeDate).setFullYear(dl.getFullYear(), dl.getMonth(), dl.getDate()),
      )
    }

    if (changeDate <= sd) {
      Alert.alert("시작시간 이후의 시간을 선택해주세요.")
      return
    }
    setDl(changeDate)
  }

  const _setDlMode = changeMode => {
    setDlShow(true)
    setDlMode(changeMode)
  }

  const _setItems = () => {
    if (items.length > 9) {
      Alert.alert("투표 항목은 최대 10개까지 생성할 수 있습니다.")
      return
    }
    setItems([...items, { key: uuid.v4(), value: "", count: 0 }])
  }

  const setItemsValue = (key: string, text: string, i: number) => {
    const oldItems = items
    oldItems.splice(i, 1, { key, value: text, count: 0 })
    setItems([...oldItems])
  }

  const delItem = (i: number) => {
    if (items.length < 3) {
      Alert.alert("투표 항목은 최소 2개가 필요합니다.")
      return
    }
    const oldItems = items
    oldItems.splice(i, 1)
    setItems([...oldItems])
  }

  let IS_FULL = title.trim() !== "" && items.filter(item => item.value.trim() === "").length === 0

  const saveVote = async () => {
    const user = firebase.auth().currentUser

    if (!IS_FULL) {
      Alert.alert("모든 항목을 채워주셔야 합니다.")
      return
    }

    const id = voteKey || uuid.v1()
    const data = {
      id,
      uid: user.uid,
      author: user.displayName,
      title: title,
      items,
      startTime: {
        day: sd.getDate(),
        month: sd.getMonth() + 1,
        year: sd.getFullYear(),
        timestamp: sd.getTime(),
      },
      deadline: {
        day: dl.getDate(),
        month: dl.getMonth() + 1,
        year: dl.getFullYear(),
        timestamp: dl.getTime(),
      },
    }

    let ref
    if (voteKey) {
      ref = database().ref(`votes/${voteKey}`)
    } else {
      ref = database().ref(`votes/${id}`)
    }

    const snapshot = await ref.once("value")

    if (!snapshot.val()) {
      try {
        await ref.set(data)
      } catch (e) {
        Alert.alert("서버에서 에러가 발생했습니다. 잠시 후 다시 시도해주세요.")
      }
    } else {
      try {
        await ref.update(data)
      } catch (e) {
        Alert.alert("서버에서 에러가 발생했습니다. 잠시 후 다시 시도해주세요.")
      }
    }
    goBack()
  }

  return (
    <View style={styles.FULL}>
      <Screen style={styles.CONTAINER} preset="scroll" backgroundColor={color.palette.lighterPink}>
        <Header
          headerText={voteKey ? "투표를 수정하세요 🗳" : "투표를 생성하세요 🗳"}
          leftIcon="backB"
          onLeftPress={goBack}
          style={styles.HEADER}
          titleStyle={styles.HEADER_TITLE}
        />
        <Text text="투표 제목" style={styles.VOTE_ITEM_TITLE} />
        <TextField
          placeholder="제목을 입력해주세요."
          inputStyle={styles.INPUT_TEXT}
          value={title}
          onChangeText={setTitle}
        />
        <Text text="투표 항목" style={styles.VOTE_ITEM_TITLE} />
        {items.map((item, i) => {
          return (
            <View key={i} style={{ flexDirection: "row" }}>
              <TextField
                placeholder={`투표항목 ${i + 1}`}
                inputStyle={styles.INPUT_TEXT}
                value={item.value}
                onChangeText={text => setItemsValue(item.key, text, i)}
                style={{ flex: 9 }}
              />
              <Button
                text="X"
                style={styles.VOTE_ITEM_DEL}
                textStyle={styles.VOTE_ITEM_DEL_TEXT}
                onPress={() => delItem(i)}
              />
            </View>
          )
        })}
        <Button
          text="투표 항목 추가"
          style={styles.ADD_VOTE_ITEM}
          textStyle={styles.ADD_VOTE_ITEM_TEXT}
          onPress={_setItems}
        />
        {voteKey ? (
          undefined
        ) : (
          <>
            <Text text="시작시간 설정" style={styles.VOTE_ITEM_TITLE} />
            <View style={styles.VOTE_TIME_SETTING}>
              <TouchableOpacity disabled={voteKey !== null} onPress={() => _setSdMode("date")}>
                <Text text={dateformat(sd)} style={styles.VOTE_DATE_TEXT} />
              </TouchableOpacity>
              <TouchableOpacity disabled={voteKey !== null} onPress={() => _setSdMode("time")}>
                <Text text={sd.toLocaleTimeString()} style={styles.VOTE_TIME_TEXT} />
              </TouchableOpacity>
            </View>
            {sdShow && (
              <DateTimePicker
                value={sd}
                // @ts-ignore
                mode={sdMode}
                is24Hour={true}
                display="default"
                onChange={_setSd}
                maximumDate={new Date(new Date().setDate(new Date().getDate() + 7))}
                minimumDate={new Date()}
              />
            )}
            <Text text="마감시간 설정" style={styles.VOTE_ITEM_TITLE} />
            <View style={styles.VOTE_TIME_SETTING}>
              <TouchableOpacity disabled={voteKey !== null} onPress={() => _setDlMode("date")}>
                <Text text={dateformat(dl)} style={styles.VOTE_DATE_TEXT} />
              </TouchableOpacity>
              <TouchableOpacity disabled={voteKey !== null} onPress={() => _setDlMode("time")}>
                <Text text={dl.toLocaleTimeString()} style={styles.VOTE_TIME_TEXT} />
              </TouchableOpacity>
            </View>
            {dlShow && (
              <DateTimePicker
                value={dl}
                // @ts-ignore
                mode={dlMode}
                is24Hour={true}
                display="default"
                onChange={_setDl}
                maximumDate={new Date(new Date().setDate(sd.getDate() + 7))}
                minimumDate={sd}
              />
            )}
          </>
        )}
      </Screen>
      <SafeAreaView style={styles.FOOTER}>
        <View style={styles.FOOTER_CONTENT}>
          <Button
            style={styles.MAKE_VOTE_BUTTON}
            textStyle={styles.MAKE_VOTE_BUTTON_TEXT}
            text={voteKey ? "수정하기" : "저장하기"}
            onPress={saveVote}
          />
        </View>
      </SafeAreaView>
    </View>
  )
}
