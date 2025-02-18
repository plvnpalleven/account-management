// utils/formatDate.js (ตัวอย่างไฟล์แยก หรือจะเขียนในไฟล์เดียวกับ component ก็ได้)
export const formatDate = (dateObj) => {
    // เช็คว่ามี $date หรือไม่
    const dateString = dateObj?.$date ? dateObj.$date : dateObj;
  
    // สร้าง Date object
    const dateInstance = new Date(dateString);
  
    // ใช้ toLocaleDateString() แปลงเป็น DD/MM/YYYY (en-GB)
    return dateInstance.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  