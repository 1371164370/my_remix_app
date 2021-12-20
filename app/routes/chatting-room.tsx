import type {User } from "@prisma/client";
import {
  Link,
  LinksFunction,
  LoaderFunction,
  Outlet,
  useLoaderData,
} from "remix";
import { UserList } from "~/components/UserList";
import { getUser, requireJWT } from "~/utils/session.server";
import stylesUrl from "../styles/chatting-room.css";

type ChattingRoomData = {
  userList: User[];
  curUser: User;
  token:string
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: stylesUrl,
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const curUser = await getUser(request);
  const token = await requireJWT(request)
  const userList:User[] = [];
  return {
    userList,
    curUser,
    token
  };
};

export default function ChattingRoom() {
  const data = useLoaderData<ChattingRoomData>();
  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
          {data.curUser ? (
            <div className="user-info">
              <span>{`Hi ${data.curUser.username}`}</span>
              <form action="/logout" method="post">
                <button type="submit" className="button">
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <UserList jwt={data.token}/>
            <Link to="new" className="button">
              Add your own
            </Link>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
