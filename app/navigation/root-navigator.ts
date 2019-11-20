import { createStackNavigator } from "react-navigation"
import { AuthNavigator } from "./auth-navigator"

export const RootNavigator = createStackNavigator(
  {
    authSwitch: { screen: AuthNavigator },
  },
  {
    headerMode: "none",
    navigationOptions: { gesturesEnabled: false },
  },
)
