import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useSnackbar } from "zmp-ui";

interface OTPInputProps {
  length: number;
  onComplete: (otp: string) => void;
}

export const OTPInput = forwardRef((props: OTPInputProps, ref) => {
  const { openSnackbar } = useSnackbar();

  const { length, onComplete } = props;
  const [inputs, setInputs] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<React.RefObject<HTMLInputElement>[]>(
    Array(length)
      .fill(0)
      .map(() => React.createRef<HTMLInputElement>())
  );

  useImperativeHandle(ref, () => ({
    reset: () => setInputs(Array(length).fill("")),
  }));

  const handleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (
      value &&
      !isNaN(value as any) &&
      parseInt(value, 10) >= 0 &&
      parseInt(value, 10) <= 9
    ) {
      if (inputs.includes(value)) {
        openSnackbar({
          text: "Không được nhập số trùng nhau",
          type: "warning",
        });
        return;
      }
      const newInputs = [...inputs];
      newInputs[index] = value;
      setInputs(newInputs);

      if (index < length - 1 && value) {
        inputRefs.current[index + 1].current?.focus();
      }

      if (newInputs.every((input) => input !== "")) {
        onComplete(newInputs.join(""));
      }
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !inputs[index] && index > 0) {
      inputRefs.current[index - 1].current?.focus();
    }
  };

  return (
    <div className="flex flex-row gap-2">
      {inputs.map((_, index) => (
        <input
          key={index}
          type="tel"
          ref={inputRefs.current[index]}
          value={inputs[index]}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          maxLength={1}
          className="border rounded-md w-10 h-10 text-center"
        />
      ))}
    </div>
  );
});
