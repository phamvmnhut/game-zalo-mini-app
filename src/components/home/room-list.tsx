import { BE_API, ROUTES } from "@config";
import { useUserStore } from "@store/useUser";
import { Room } from "@type/room";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactTimeago from "react-timeago";
import { Avatar, Button, Input, Sheet, useNavigate, useSnackbar } from "zmp-ui";

export function RoomList() {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();

  const { user } = useUserStore();

  const [roomList, setRoomList] = useState<Array<Room>>([]);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [roomName, setRoomName] = useState<string>("");

  const joinBtnClick = (roomId: string) => {
    if (user) {
      navigate(ROUTES.GAME + "/" + roomId);
    } else {
      openSnackbar({
        text: "Bạn chưa đăng nhập",
        type: "info",
      });
    }
  };

  const handleCreateRoomBtn = () => {
    if (user) {
      setSheetVisible(true);
    } else {
      openSnackbar({
        text: "Bạn chưa đăng nhập",
        type: "info",
      });
    }
  };
  const handleCreateRoom = () => {
    axios
      .post(BE_API + "/room", {
        name: roomName,
        userId: user?.id,
      })
      .then((e) => {
        navigate(ROUTES.GAME + "/" + e.data.data.id);
      });
  };

  useEffect(() => {
    axios.get(BE_API + "/room").then((e) => {
      setRoomList(e.data.data.result);
    });
  }, []);

  return (
    <div className="px-3 pt-5">
      <div className="grid grid-cols-2 gap-x-2 gap-y-2">
        {roomList.map((e) => {
          return (
            <div
              className="rounded shadow-sm px-3 pt-4 pb-2 bg-gradient-to-b from-blue-200 to-blue-100"
              key={e.id}
              onClick={() => joinBtnClick(e.id)}
            >
              <div className="text-lg font-bold">{e.name} </div>
              <div className="flex flex-row justify-between items-center">
                <ReactTimeago date={e.createdAt} />
                <Avatar.Group>
                  {e.RoomUser.map((u) => {
                    return <Avatar key={u.id}>{u.user.username}</Avatar>;
                  })}
                </Avatar.Group>
              </div>
            </div>
          );
        })}
        <div className="h-full rounded shadow-sm px-3 pt-4 pb-2 bg-gradient-to-b from-blue-200 to-blue-100">
          <div className="flex flex-row justify-center items-center">
            <Button onClick={handleCreateRoomBtn} size="small">
              Tạo phòng mới
            </Button>
          </div>
        </div>
      </div>
      <Sheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        autoHeight
        mask
        handler
        swipeToClose
      >
        <div className="w-full h-full px-3 pt-3 py-10 flex flex-col gap-3">
          <div className=" text-lg font-bold">Tạo phòng mới</div>
          <Input
            label="Tên phòng"
            placeholder="Nhập tên phòng"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <div className="flex flex-row gap-2 justify-between">
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => setSheetVisible(false)}
            >
              Huỷ
            </Button>
            <Button className="w-full" onClick={handleCreateRoom}>
              Gửi
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
