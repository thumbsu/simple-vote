import { createSwitchNavigator } from "react-navigation"
import { PrimaryNavigator } from "./primary-navigator"
import {
  AuthloadingScreen,
  SigninScreen,
} from "../screens"

export const AuthNavigator = createSwitchNavigator({
  authloading: { screen: AuthloadingScreen },
  signin: { screen: SigninScreen },
  primary: { screen: PrimaryNavigator },
})