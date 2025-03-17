/**
 * Calculate total OT hours based on startTime and endTime
 * @param {string} startTime - format "HH:mm", e.g. "18:00"
 * @param {string} endTime - format "HH:mm", e.g. "20:30"
 * @returns {number} total OT hours in decimal, e.g. 2.5
 */

function calculateOTHours(startTime, endTime) {
  const diffMs = endTime - startTime; //ได้เป็น milliseconds
  const hours = diffMs / (1000 * 60 * 60)//แปลง ms -> ชม.

  return hours > 0 ? hours: 0;
}

//export ฟังก์ชัน
module.exports = { calculateOTHours };
