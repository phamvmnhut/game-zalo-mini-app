import { BE_API, actionEnum } from "@config";
import { socket } from "@services/socket-game";
import { useGameStore } from "@store/useGame";
import { useUserStore } from "@store/useUser";
import { Room, RoomUser } from "@type/room";
import { getGameTypeFromNumber } from "@utils/game";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import ReactTimeago from "react-timeago";
import { Avatar, Button, Icon, useNavigate, useSnackbar } from "zmp-ui";

export function GameNotSelected({ roomId }: { roomId: string | undefined }) {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();

  const { user } = useUserStore();
  const { gameSelected, playGame, resetGame } = useGameStore();

  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [listUser, setListUser] = useState<Array<RoomUser>>([]);

  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    if (!roomId) {
      navigate(-1);
    } else {
      axios.get(BE_API + "/room/" + roomId).then((e) => {
        setRoom(e.data.data);
      });
    }
  }, [roomId]);

  const isOwnerRoom = useMemo(() => {
    if (!user || !room) {
      return false;
    } else {
      const userJoined = room.RoomUser.find((e) => e.userId == user.id);
      if (!userJoined) {
        return false;
      } else {
        return userJoined.role == 1;
      }
    }
  }, [user, room]);

  const latestGame = useMemo(() => {
    return room?.RoomGame[room.RoomGame.length - 1];
  }, [room]);

  const gameInterest = useMemo(() => {
    if (!room || room.RoomGame.length == 0) return [0, 0];
    const map = new Map<number, number>();
    room?.RoomGame.forEach((e) => {
      map.set(e.gameType, map.get(e.gameType) ?? 0 + 1);
    });
    return [...map.entries()].reduce((a, e) => (e[1] > a[1] ? e : a));
  }, [room]);

  useEffect(() => {
    socket.on(actionEnum.NEW_JOIN, (data) => {
      setListUser(data.listUser);
    });
    socket.on("play", (data) => {
      playGame(data);
    });

    return () => {
      socket.off(actionEnum.NEW_JOIN, () => {});
      socket.off("play", () => {});
    };
  }, []);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
      resetGame();
    };
  }, []);

  const joinBtnHandle = () => {
    axios
      .put(BE_API + "/room/" + roomId + "/join", {
        roomId: roomId,
        userId: user?.id,
      })
      .then(() => {
        setIsConnected(true);
        socket.emit("join", {
          roomId: roomId,
          userId: user?.id,
        });
      })
      .catch((e) => {
        openSnackbar({
          text: e.response.data.message,
          type: "error",
        });
      });
  };

  const game1 = () => {
    axios
      .put(BE_API + "/room/" + roomId + "/start", {
        roomId: roomId,
        gameType: 1,
        joinedSocket: listUser.map((e) => e.id),
      })
      .catch((e) => {
        openSnackbar({
          text: e.response.data.message,
          type: "error",
        });
      });
  };

  const game2 = () => {
    // setSelectedGame(2);
  };

  return (
    <>
      {room !== undefined && (
        <>
          {gameSelected === undefined && (
            <div className="px-3 pt-4 flex flex-col gap-2">
              <div className="">Chào mừng bạn đến với phòng</div>
              <div className="font-bold text-xl px-2 py-3 bg-blue-50 rounded-md shadow-sm">
                {room.name}
              </div>
              <div className="flex flex-row justify-between items-center">
                <ReactTimeago date={room.createdAt} />
                <Avatar.Group>
                  {room.RoomUser.map((u) => {
                    return <Avatar key={u.id}>{u.user.username}</Avatar>;
                  })}
                </Avatar.Group>
              </div>
              <div className="flex flex-row gap-2 justify-between">
                <div className="w-full bg-blue-100 rounded p-2 flex flex-col justify-end items-center gap-1">
                  <div className="font-bold text-lg">
                    {room.RoomGame.length}
                  </div>
                  <div className="text-center">Lần chơi game</div>
                </div>
                <div className="w-full bg-blue-100 rounded p-2 flex flex-col justify-end items-center gap-1">
                  <div className="font-bold text-lg">
                    {getGameTypeFromNumber(gameInterest[0])}
                  </div>
                  <div className="text-center">Game ưa thích</div>
                </div>
                <div className="w-full bg-blue-100 rounded p-2 flex flex-col justify-end items-center gap-1">
                  <div className="font-bold text-center">
                    {latestGame !== undefined && (
                      <ReactTimeago date={latestGame.createdAt} />
                    )}
                  </div>
                  <div className="text-center">Chơi gần đây</div>
                </div>
              </div>
              {!isConnected && (
                <Button onClick={joinBtnHandle}>Tham gia</Button>
              )}
              {isConnected && (
                <>
                  <div className="flex flex-row items-center justify-start gap-2 mt-5">
                    <Icon icon="zi-more-diamond-solid" />
                    <div className="font-bold">Trong phòng này có</div>
                  </div>
                  {listUser.map((e) => {
                    return (
                      <div
                        key={e.id}
                        className="rounded bg-gray-100 p-3 shadow-sm"
                      >
                        {e.user.username} {e.role == 1 && ": Chủ phòng"}
                      </div>
                    );
                  })}
                  {isOwnerRoom && (
                    <>
                      <div className="pt-3">
                        Chủ phòng chọn game để tiếp tục thử thách:
                      </div>
                      <Button onClick={game1}>Nối chữ</Button>
                      <Button onClick={game2}>Đoán số</Button>
                    </>
                  )}
                </>
              )}
            </div>
          )}
          {gameSelected !== undefined && (
            <div className="font-bold text-xl px-2 py-3 bg-blue-50 shadow-sm">
              {room?.name}
            </div>
          )}
        </>
      )}
    </>
  );
}
