import { useStateProvider } from "@/context/StateContext";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { reducerCases } from "@/context/constants";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";

function logout() {
  const [{ socket, userInfo }, dispatch] = useStateProvider();
  const router = useRouter();

  useEffect(() => {
    socket.current.emit("signout", userInfo.id);
    dispatch({ type: reducerCases.SET_USER_INFO, userInfo: undefined });
    signOut(firebaseAuth);
    router.push("/login");
  }, [socket]);
  return <div className="bg-conversation-panel-background"></div>;
}

export default logout;
