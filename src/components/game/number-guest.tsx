import { BE_API } from "@config";
import { socket } from "@services/socket-game";
import { useGameStore } from "@store/useGame";
import { useUserStore } from "@store/useUser";
import { clsV2 } from "@utils/cls";
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
  const [userGuestIndex, setUserGuestIndex] = useState(0);

  useEffect(() => {
    socket.on("new_submit", (data) => {
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
    if (index == -1) return false;
    if (numberGuest.length < index) return false;
    const isNotSubmitNumber = numberGuest[index] == "0000";
    return isInit && isNotSubmitNumber;
  }, [currentRound, userList, numberGuest, user]);

  const userCanGuest = useMemo(() => {
    return userList.filter((e) => e.userId != user?.id);
  }, [userList, user]);

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
          guestFor: userCanGuest[userGuestIndex].userId,
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
          <div className="font-bold text-3xl self-center py-2">
            {numberGuest[userList.findIndex((e) => e.userId == user?.id)]}
          </div>
          {isPlayRound || isInitRound ? (
            <>
              {isPlayRound && (
                <div className="flex flex-wrap gap-1">
                  {userCanGuest.map((e, index) => {
                    return (
                      <div
                        key={e.userId}
                        className={clsV2(
                          "rounded-sm px-2 py-1",
                          index == userGuestIndex
                            ? "bg-blue-300"
                            : "bg-blue-100"
                        )}
                        onClick={() => setUserGuestIndex(index)}
                      >
                        {e.user.username}
                      </div>
                    );
                  })}
                </div>
              )}
              {isInitRound && (
                <div className="flex flex-wrap gap-1">
                  Nhập số để đối thủ đoán:
                </div>
              )}
              <Input
                className="!m-0"
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
          <div className="flex flex-col gap-1">
            {history
              .sort((a, b) => b.time - a.time)
              .map((e) => {
                const userIndex = userList.findIndex(
                  (u) => u.userId == e.userId
                );
                const userHere = userList[userIndex];
                const userGuestedIndex = userList.findIndex(
                  (u) => u.userId == e.guestFor
                );
                const userGuested = userList[userGuestedIndex];
                const { matchingDigits, positionMatches } = getMatchingCount(
                  e.value,
                  numberGuest[userGuestedIndex]
                );
                return (
                  <div
                    key={e.time}
                    className={clsV2(
                      "flex flex-row justify-between rounded p-2",
                      userHere.userId == user?.id
                        ? " bg-blue-400"
                        : "bg-blue-200"
                    )}
                  >
                    <div className="flex flex-col items-start">
                      <div>
                        {userHere.userId == user?.id
                          ? "Bạn"
                          : userHere.user.username}
                        {" -> "}
                        <span className="font-bold">
                          {userGuested.userId == user?.id
                            ? "Bạn"
                            : userGuested.user.username}
                        </span>
                      </div>
                      <div className="">{e.value}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="">Số đúng: {matchingDigits}</div>
                      <div className="">Vị trí đúng: {positionMatches} </div>
                    </div>
                  </div>
                );
              })}
          </div>
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
