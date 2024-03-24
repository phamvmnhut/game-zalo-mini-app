export function getMatchingCount(guest: string, origin: string) {
  // Chuyển đổi chuỗi thành mảng các ký tự
  const arr1 = guest.split('');
  const arr2 = origin.split('');

  // Sử dụng Set để lưu trữ các chữ số duy nhất từ chuỗi thứ hai
  const uniqueDigits = new Set(arr2);

  // Khởi tạo biến đếm
  let matchingDigits = 0;
  let positionMatches = 0;

  arr1.forEach((digit, index) => {
    // Kiểm tra sự trùng khớp của chữ số
    if (uniqueDigits.has(digit)) {
      matchingDigits++;
      // Xóa chữ số đã kiểm tra để tránh đếm trùng lặp
      uniqueDigits.delete(digit);
    }

    // Kiểm tra trùng khớp vị trí
    if (digit === arr2[index]) {
      positionMatches++;
    }
  });

  return { matchingDigits, positionMatches };
}