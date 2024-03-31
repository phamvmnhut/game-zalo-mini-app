import { OTPInput } from "@components/ui/input-opt";
import { BE_API } from "@config";
import { socket } from "@services/socket-game";
import { useGameStore } from "@store/useGame";
import { useUserStore } from "@store/useUser";
import { clsV2 } from "@utils/cls";
import { getMatchingCount } from "@utils/number-guest-game";
import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Countdown from "react-countdown";
import {
  Avatar,
  Button,
  Icon,
  Input,
  Modal,
  useNavigate,
  useSnackbar,
} from "zmp-ui";

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

  const otpRef = useRef<{ reset: () => void }>(null);

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
          otpRef.current?.reset();
        })
        .catch((e) => {
          openSnackbar({
            text: e.response.data.message,
            type: "error",
          });
        });
    }
  };

  return (
    <>
      <div className="px-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row justify-between items-center mt-3">
            <div className="font-bold">Game Đoán số</div>
            <div className="" onClick={() => setPopupGuideToPlayVisible(true)}>
              <Icon icon="zi-info-circle" />
            </div>
          </div>
          <div className="bg-blue-200/50 rounded-md px-3 py-3">
            <div className="font-bold text-3xl self-center text-center py-3">
              {numberGuest[userList.findIndex((e) => e.userId == user?.id)]}
            </div>

            <div className="flex flex-row justify-center">
              <OTPInput
                ref={otpRef}
                length={4}
                onComplete={(e) => setValue(e)}
              />
            </div>

            <div className="flex flex-col justify-center">
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
                <div className="flex flex-wrap gap-1 py-1">
                  Nhập số để đối thủ đoán:
                </div>
              )}
              {!(isPlayRound || isInitRound) && (
                <div className="py-1">
                  Đến lượt của{" "}
                  <span className="font-bold">
                    {currentUser?.user.username}
                  </span>
                </div>
              )}
              <Button
                className="!mt-2"
                onClick={submit}
                disabled={!(isPlayRound || isInitRound)}
              >
                Gửi
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-1 px-3">
        <div className="flex flex-row items-center gap-2">
          <div className={clsV2("rounded-sm px-2 py-1", "bg-blue-300")}>
            Lịch sử
          </div>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto flex flex-col gap-2 px-3 bg-gray-100/50 pt-4 mx-3 mb-3 rounded-lg shadow-sm">
        {history
          .sort((a, b) => a.time - b.time)
          .map((e) => {
            const userIndex = userList.findIndex((u) => u.userId == e.userId);
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
                  "flex flex-row items-end gap-2 justify-end",
                  userHere.userId == user?.id ? "" : "flex-row-reverse"
                )}
              >
                <div
                  className={clsV2(
                    "flex flex-col px-2 py-1 rounded-md",
                    userHere.userId == user?.id ? " bg-blue-200" : "bg-gray-100"
                  )}
                >
                  <div>
                    {"Đoán "}
                    <span className="font-bold">
                      {userGuested.userId == user?.id
                        ? "Bạn"
                        : userGuested.user.username}
                    </span>
                    {" số "}
                    {e.value}
                  </div>
                  <div className="">
                    Số đúng: {matchingDigits}, Vị trí đúng: {positionMatches}
                  </div>
                </div>
                <Avatar size={24}>{userHere.user.username}</Avatar>
              </div>
            );
          })}
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
