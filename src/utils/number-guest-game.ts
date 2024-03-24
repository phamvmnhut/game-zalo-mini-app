export function getMatchingCount(guest: string, origin: string) {
  if (guest == origin) return [4, true]
  // Chuyển đổi chuỗi thành mảng các ký tự
  const arr1 = guest.split('');
  const arr2 = origin.split('');

  // Sử dụng Set để lưu trữ các chữ số duy nhất
  const uniqueDigits = new Set(arr2);

  // Đếm số lượng chữ số trùng nhau
  let matchingCount = 0;
  arr1.forEach(digit => {
    if (uniqueDigits.has(digit)) {
      matchingCount++;
      // Xóa chữ số đã kiểm tra để tránh đếm trùng lặp
      uniqueDigits.delete(digit);
    }
  });

  return [matchingCount, false];
}