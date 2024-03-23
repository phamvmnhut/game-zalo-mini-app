import { useUserStore } from "@store/useUser";
import React, { useState } from "react";
import { Button, Icon, Input, Modal, Sheet } from "zmp-ui";

export function UserLogin() {
  const { user, login, logout } = useUserStore();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);

  const [username, setUserName] = useState<string>("");

  const handleLogin = () => {
    login(username).then(() => setSheetVisible(false));
  };

  const handleLogout = () => {
    logout().then(() => {
      setPopupVisible(false);
    });
  };

  return (
    <div className="px-3">
      <div className="rounded-lg bg-blue-100/50 shadow-md px-5 py-5">
        {user == null && (
          <div className="flex flex-col gap-2 items-start">
            <div className="text-lg font-bold">Chưa có tài khoản</div>
            <Button size="small" onClick={() => setSheetVisible(true)}>
              Đăng nhập/ Đăng ký
            </Button>
          </div>
        )}
        {user != null && (
          <div className="flex flex-col gap-2 items-start">
            <div className="font-bold">
              Chào{" "}
              <span className="text-blue-900 text-xl">{user.username}</span>
            </div>
            <div className="w-full flex flex-row justify-end">
              <div className="" onClick={() => setPopupVisible(true)}>
                <Icon icon="zi-leave" />
              </div>
            </div>
          </div>
        )}
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
          <div className=" text-lg font-bold">Đăng nhập/ Đăng ký</div>
          <Input
            label="Tên đăng nhập"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
          <div className="flex flex-row gap-2 justify-between">
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => setSheetVisible(false)}
            >
              Huỷ
            </Button>
            <Button className="w-full" onClick={handleLogin}>
              Gửi
            </Button>
          </div>
        </div>
      </Sheet>

      <Modal
        visible={popupVisible}
        title="Đăng xuất tài khoản"
        onClose={() => {
          setPopupVisible(false);
        }}
        description="Bạn có chắc muốn đăng xuất tài khoản không?"
      >
        <div className="flex flex-row justify-between gap-2 mt-5">
          <Button
            onClick={() => {
              setPopupVisible(false);
            }}
            variant="secondary"
            fullWidth
          >
            Huỷ
          </Button>
          <Button onClick={handleLogout} fullWidth>
            Xác nhận
          </Button>
        </div>
      </Modal>
    </div>
  );
}
