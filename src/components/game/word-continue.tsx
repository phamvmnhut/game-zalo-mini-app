import { BE_API } from "@config";
import { socket } from "@services/socket-game";
import { useGameStore } from "@store/useGame";
import { useUserStore } from "@store/useUser";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import Countdown from "react-countdown";
import { Button, Icon, Input, Modal, useSnackbar } from "zmp-ui";

export function WordContinue() {
  const { openSnackbar } = useSnackbar();

  const { user } = useUserStore();
  const {
    currentTurn,
    currentValue,
    nextTurn,
    endTurnTime,
    history,
    roomGameId,
    selectGame,
  } = useGameStore();

  const [value, setValue] = useState<string>("");
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    socket.on("new_submit", (data) => {
      selectGame(data);
    });

    return () => {
      socket.off("new_submit", () => {});
    };
  }, []);

  const lastWord = useMemo(() => {
    if (!currentValue) return ".";
    return currentValue?.split(" ")[1];
  }, [currentValue]);

  const submit = () => {
    if (
      user == undefined ||
      currentTurn == undefined ||
      user.id.toString() != currentTurn
    ) {
      openSnackbar({
        text: "Không đến lượt",
        type: "error",
      });
    } else {
      // call api
      axios
        .put(BE_API + "/game/" + roomGameId + "/submit", {
          word: lastWord == "." ? value.trim() : lastWord + " " + value.trim(),
          roomGameId: roomGameId,
        })
        .then(() => {
          setValue("");
        })
        .catch((e) => {
          openSnackbar({
            text: e.response.data.message,
            type: "error",
          });
        });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      submit();
    }
  };

  return (
    <>
      <div className="px-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row justify-between items-center">
            <div className="font-bold">Game nối chữ</div>
            <div className="" onClick={() => setPopupVisible(true)}>
              <Icon icon="zi-info-circle" />
            </div>
          </div>
          <div className="font-bold text-3xl self-center py-2">
            {currentValue}
          </div>
          <div className="self-center bg-blue-200/50 px-2 py-1 rounded-md">
            {endTurnTime != undefined && (
              <Countdown date={new Date(endTurnTime * 1000)} />
            )}
          </div>
          {currentTurn == user?.id.toString() ? (
            <>
              <div className="flex flex-row justify-start items-stretch">
                <div className="h-auto border-2 border-blue-400 flex flex-col justify-center px-5 rounded-l-lg">
                  {lastWord}
                </div>
                <Input
                  className="!m-0 !rounded-l-none"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Nhập từ"
                />
              </div>
              <Button className="!mt-3" onClick={submit}>
                Gửi
              </Button>
            </>
          ) : (
            <div className="self-center mt-5">Lượt của đối thủ</div>
          )}
        </div>
      </div>
      <Modal
        visible={popupVisible}
        title="Hướng dẫn game Nối chữ"
        onClose={() => {
          setPopupVisible(false);
        }}
        description="Đây là hướng dẫn game nối chữ"
      >
        <Button
          className="!mt-5"
          onClick={() => {
            setPopupVisible(false);
          }}
          fullWidth
        >
          Xác nhận
        </Button>
      </Modal>
    </>
  );
}
