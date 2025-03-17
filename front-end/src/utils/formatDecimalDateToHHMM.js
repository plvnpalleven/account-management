export function formatDecimalHoursToHHMM(decimalHours) {
  if (!decimalHours || decimalHours <= 0) {
    return "00:00";
  }

  // ปัดเศษลงเพื่อหาจำนวนชั่วโมงเต็ม
  const hours = Math.floor(decimalHours);

  // หารทศนิยมส่วนที่เหลือแล้วคูณ 60 เพื่อแปลงเป็นนาที
  const minutes = Math.round((decimalHours - hours) * 60);

  // แปลงเป็นสตริงแบบ 2 หลัก เช่น 01, 02, ...
  const hh = String(hours).padStart(1, "0");
  const mm = String(minutes).padStart(1, "0");

  return `${hh}.${mm}`;
}
