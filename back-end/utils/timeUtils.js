/**
 * Calculate total OT hours based on startTime and endTime
 * @param {string} startTime - format "HH:mm", e.g. "18:00"
 * @param {string} endTime - format "HH:mm", e.g. "20:30"
 * @returns {number} total OT hours in decimal, e.g. 2.5
 */

function calculateOTHours(startTime, endTime) {
  //แปลง startTime และ endTime เป็นตัวเลขชั่วโมง/นาที
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);

  //คำนวณเป็นนาที
  const startTotalMinutes = startH * 60 + startM;
  const endTotalMinutes = endH * 60 + endM;

  //หาค่าต่างๆ
  const diffMinutes = endTotalMinutes - startTotalMinutes;

  //แปลงนาที -> ชั่วโมงทศนิยม
  const hours = diffMinutes / 60;

  //ถ้า hours ติดลบ , ให้เป็น 0 (กันเคสผิดพลาด)
  return hours > 0 ? hours : 0;
}

//export ฟังก์ชัน
module.exports = { calculateOTHours };
