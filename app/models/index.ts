import { Model } from "react-model";
import SocketModel from "./connected_socket";

const models = { SocketModel };

export const {
  getInitialState,
  useStore,
  getState,
  actions,
  subscribe,
  unsubscribe,
} = Model(models);
