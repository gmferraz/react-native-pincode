import { colors } from "./design/colors";
import { grid } from "./design/grid";
import delay from "./delay";
import { PinResultStatus } from "./utils";

import AsyncStorage from "@react-native-community/async-storage";
import * as React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform
} from "react-native";

export type IProps = {
  buttonComponent?: any
  changeStatus: (status: PinResultStatus) => void
  colorIcon?: string
  iconComponent?: any
  lockedIconComponent?: any
  nameIcon?: string
  onClickButton: any
  pinAttemptsAsyncStorageName: string
  sizeIcon?: number
  styleButton?: any
  styleMainContainer?: any
  styleText?: any
  styleTextButton?: any
  styleTextTimer?: any
  styleTitle?: any
  styleViewButton?: any
  styleViewIcon?: any
  styleViewTextLock?: any
  styleViewTimer?: any
  textButton: string
  textDescription?: string
  textSubDescription?: string
  textTitle?: string
  timePinLockedAsyncStorageName: string
  timeToLock: number
  timerComponent?: any
  titleComponent?: any
  textDescriptionComponent?: any
  textTimer?: string
}

export type IState = {
  timeDiff: number
}

class ApplicationLocked extends React.PureComponent<IProps, IState> {
  static defaultProps: Partial<IProps> = {
    styleButton: null,
    styleTextButton: null,
    styleViewTimer: null,
    styleTextTimer: null,
    textTimer: null,
    styleTitle: null,
    styleViewIcon: null,
    nameIcon: "lock",
    sizeIcon: 24,
    colorIcon: colors.white,
    styleViewTextLock: null,
    styleText: null,
    styleViewButton: null,
    styleMainContainer: null,
    textDescriptionComponent: null
  }
  timeLocked: number;
  isUnmounted: boolean;

  constructor(props: IProps) {
    super(props);
    this.state = {
      timeDiff: 0
    };
    this.isUnmounted = false;
    this.timeLocked = 0;
    this.timer = this.timer.bind(this);
  }

  componentDidMount() {
    AsyncStorage.getItem(this.props.timePinLockedAsyncStorageName).then(val => {
      this.timeLocked = new Date(val ? val : "").getTime() + this.props.timeToLock;
      this.timer();
    });
  }

  async timer() {
    const timeDiff = +new Date(this.timeLocked) - +new Date();
    this.setState({ timeDiff: Math.max(0, timeDiff) });
    await delay(1000);
    if (timeDiff < 1000) {
      this.props.changeStatus(PinResultStatus.initial);
      AsyncStorage.multiRemove([
        this.props.timePinLockedAsyncStorageName,
        this.props.pinAttemptsAsyncStorageName
      ]);
    }
    if (!this.isUnmounted) {
      this.timer();
    }
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  renderErrorLocked = () => {
    const minutes = Math.floor(this.state.timeDiff / 1000 / 60);
    const seconds = Math.floor(this.state.timeDiff / 1000) % 60;
    return (
      <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
        {this.props.textDescriptionComponent
          ? this.props.textDescriptionComponent()
          : null}
        <Text
          style={this.props.styleTextTimer}>
            {this.props.textTimer}
            {`${
              seconds < 10 ? "0" + seconds : seconds
            }s`}
        </Text>
      </View>
    );
  };

  render() {
    return (
      <View
        style={styles.container}>
        {this.renderErrorLocked()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 120,
    height: "100%",
    width: "100%",
  },
  text: {
    fontSize: grid.unit,
    color: colors.base,
    lineHeight: grid.unit * grid.lineHeight,
    textAlign: "center"
  },
  viewTextLock: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: grid.unit * 3,
    paddingRight: grid.unit * 3,
    flex: 3
  },
  textTimer: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 20,
    color: colors.base
  },
  title: {
    fontSize: grid.navIcon,
    color: colors.base,
    opacity: grid.mediumOpacity,
    fontWeight: "200",
    marginBottom: grid.unit * 4
  },
  viewIcon: {
    width: grid.unit * 4,
    justifyContent: "center",
    alignItems: "center",
    height: grid.unit * 4,
    borderRadius: grid.unit * 2,
    opacity: grid.mediumOpacity,
    backgroundColor: colors.alert,
    overflow: "hidden",
    marginBottom: grid.unit * 4
  },
  viewTimer: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 10,
    paddingTop: 10,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "rgb(230, 231, 233)",
    marginBottom: grid.unit * 4
  },
  viewCloseButton: {
    alignItems: "center",
    opacity: grid.mediumOpacity,
    justifyContent: "center",
    marginTop: grid.unit * 2
  },
  button: {
    backgroundColor: colors.turquoise,
    borderRadius: grid.border,
    paddingLeft: grid.unit * 2,
    paddingRight: grid.unit * 2,
    paddingBottom: grid.unit,
    paddingTop: grid.unit
  },
  closeButtonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 14
  }
});

export default ApplicationLocked;
