import { useEffect, useState } from "react";
import { socket } from "~/socket.client";
import { useStore } from "~/models";
import { User } from "~/types";

export const useUserList = (): [
  User[],
  React.Dispatch<React.SetStateAction<User[]>>
] => {
  const [userList, setUserList] = useState<User[]>([]);
  const [{ socket }, _] = useStore("SocketModel");

  useEffect(() => {
    socket?.on("user_list_change", (userList) => {
      setUserList(userList);
    });
    return () => {
      socket?.off("user_list_change");
    };
  }, []);

  return [userList, setUserList];
};
