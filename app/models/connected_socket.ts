import { GomokuClientSocket } from "../types/index";
import {} from "react-model";
import { action } from "~/routes/login";
interface StateType {
  socket?: GomokuClientSocket;
}

interface ActionParamType {
  setSocket: GomokuClientSocket | undefined;
}

const initialState = {
  socket: undefined,
};

const model: ModelType<StateType, ActionParamType> = {
  state: initialState,
  actions: {
    setSocket: async (payload, { state }) => {
      return {
        socket: payload,
      };
    },
  },
};

export default model;
