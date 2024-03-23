export function getGameTypeFromNumber(e: number) : string {
  switch (e) {
    case 1:
      return "Nối chữ";
    case 2:
      return "Đoán số";
    default:
      return "Không có";
  }
}