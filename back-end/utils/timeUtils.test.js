// นำเข้า calculateOTHours จากไฟล์ timeUtils.js
const { calculateOTHours } = require('../utils/timeUtils');

describe('calculateOTHours', () => {
  test('should correctly calculate OT hours when crossing midnight', () => {
    // สมมุติ: เริ่ม OT เวลา 23:00 ของวันที่ 19 และจบ OT เวลา 01:00 ของวันที่ 20
    const otStart = new Date('2025-03-19T23:00:00'); // เวลาเริ่ม
    const otEnd = new Date('2025-03-20T01:00:00');   // เวลาจบ

    const otHours = calculateOTHours(otStart, otEnd);

    // คาดว่าเวลาทำ OT จะได้ 2 ชั่วโมง
    expect(otHours).toBe(2);
  });

  test('should return 0 if otEnd is before otStart', () => {
    const otStart = new Date('2025-03-20T01:00:00');
    const otEnd = new Date('2025-03-19T23:00:00');

    const otHours = calculateOTHours(otStart, otEnd);

    // ถ้า otEnd อยู่ก่อน otStart ควรคืนค่า 0
    expect(otHours).toBe(0);
  });
});
