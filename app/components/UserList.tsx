import { useUserList } from "~/hooks/useUserList";

export const UserList = () => {
  const [userList, setUserList] = useUserList();

  return (
    <>
      {userList.map((user) => (
        <>{JSON.stringify(user)}</>
      ))}
    </>
  );
};
