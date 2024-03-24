import { BE_API } from "@config";
import { socket } from "@services/socket-game";
import { useGameStore } from "@store/useGame";
import { useUserStore } from "@store/useUser";
import { getMatchingCount } from "@utils/number-guest-game";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import Countdown from "react-countdown";
import { Button, Icon, Input, Modal, useNavigate, useSnackbar } from "zmp-ui";

export function NumberGuest() {
  const { openSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { user } = useUserStore();
  const {
    currentTurn,
    currentValue,
    nextTurn,
    endTurnTime,
    history,
    roomGameId,
    updateRound,
    updateWinner,
    userList,
    numberGuest,
    currentRound,
  } = useGameStore();

  const [value, setValue] = useState<string>("");
  const [popupGuideToPlayVisible, setPopupGuideToPlayVisible] = useState(false);
  const [popupWinnerVisible, setPopupWinnerVisible] = useState(false);

  useEffect(() => {
    socket.on("new_submit", (data) => {
      console.log("new update", data);
      updateRound(data);
    });

    socket.on("ended", (data) => {
      // updateWinner(data);
      if (data) {
        // setPopupWinnerVisible(true);
      }
    });

    return () => {
      socket.off("new_submit", () => {});
      socket.off("ended", () => {});
    };
  }, []);

  const currentUser = useMemo(() => {
    if (!userList) return undefined;
    return userList.find((e) => e.userId == currentTurn);
  }, [currentTurn, userList]);

  const isPlayRound = useMemo(() => {
    const isPlay = currentRound != undefined && currentRound != 1;
    const isYourTurn = currentTurn == user?.id;
    return isPlay && isYourTurn;
  }, [currentRound, currentTurn]);

  const isInitRound = useMemo(() => {
    const isInit = currentRound == 1;
    const index = userList.findIndex((e) => e.userId == user?.id);
    console.log({
      index,
      "user?.id": user?.id,
      numberGuest,
    });
    if (index == -1) return false;
    if (numberGuest.length < index) return false;
    const isNotSubmitNumber = numberGuest[index] == "0000";
    return isInit && isNotSubmitNumber;
  }, [currentRound, userList, numberGuest, user]);

  const submit = () => {
    if (!isPlayRound && !isInitRound) {
      openSnackbar({
        text: "Không đến lượt",
        type: "error",
      });
    } else {
      // call api
      axios
        .put(BE_API + "/game/" + roomGameId + "/submit", {
          userId: user?.id,
          number: value.toString(),
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
            <div className="font-bold">Game Đoán số</div>
            <div className="" onClick={() => setPopupGuideToPlayVisible(true)}>
              <Icon icon="zi-info-circle" />
            </div>
          </div>
          <table>
            <thead>
              <tr>
                {userList.map((e, index) => {
                  return (
                    <th key={index}>
                      {e.userId == user?.id
                        ? numberGuest[index]
                        : e.user.username}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                {userList.map((e, index) => {
                  return (
                    <td key={index} className="h-auto">
                      <div className="flex flex-col items-center justify-start w-full h-full ">
                        {history
                          .filter((h) => h.userId == user?.id)
                          .map((h) => {
                            const [matchCount, isMatch] = getMatchingCount(
                              h.value,
                              numberGuest[index]
                            );
                            return (
                              <div className="" key={h.time}>
                                {e.userId == user?.id ? (
                                  <div>{h.value}</div>
                                ) : (
                                  <div>{matchCount} {isMatch && "Đúng hết"}</div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
          {isPlayRound || isInitRound ? (
            <>
              <Input
                className="!m-0 !rounded-l-none"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập số"
              />
              <Button className="!mt-3" onClick={submit}>
                Gửi
              </Button>
            </>
          ) : (
            <div className="self-center mt-5">
              Đến lượt của{" "}
              <span className="font-bold">{currentUser?.user.username}</span>
            </div>
          )}
        </div>
      </div>
      <Modal
        visible={popupGuideToPlayVisible}
        title="Hướng dẫn game Đoán số"
        onClose={() => {
          setPopupGuideToPlayVisible(false);
        }}
        description="Đây là hướng dẫn game Đoán số"
      >
        <Button
          className="!mt-5"
          onClick={() => {
            setPopupGuideToPlayVisible(false);
          }}
          fullWidth
        >
          Xác nhận
        </Button>
      </Modal>
      <Modal
        visible={popupWinnerVisible}
        title="Game kết thúc"
        onClose={() => {
          setPopupWinnerVisible(false);
        }}
      >
        <div className="flex flex-col"></div>
        <Button
          className="!mt-5"
          onClick={() => {
            setPopupWinnerVisible(false);
            navigate(-1);
          }}
          fullWidth
        >
          Xác nhận
        </Button>
      </Modal>
    </>
  );
}
