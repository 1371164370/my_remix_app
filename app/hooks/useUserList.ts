import { useEffect, useState } from "react";
import { User } from "../../types";
import { useSocket } from "./useSocket";

export const useUserList = (jwt: string): [
  User[],
  React.Dispatch<React.SetStateAction<User[]>>
] => {
  const [userList, setUserList] = useState<User[]>([]);
  const socket = useSocket(jwt)

  useEffect(() => {
    socket?.on("user_list_change", (userList) => {
      setUserList(userList);
    });
    return () => {
      socket?.off("user_list_change");
    };
  }, [socket]);

  return [userList, setUserList];
};
