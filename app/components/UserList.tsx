import { useUserList } from "~/hooks/useUserList";
import { ClientOnly } from "./ClientOnly";
interface Props{
  jwt:string
}

export const UserList = ({jwt}:Props) => {
  // const [userList, setUserList] = useUserList(jwt);

  return (
    <ClientOnly fallback={'loading'}>
     UserList
      {/* {userList.map((user) => (
        <>{JSON.stringify(user)}</>
      ))} */}
    </ClientOnly>
  );
};
