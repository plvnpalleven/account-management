export function flattenObject (obj,parentKey = "",res = {}){
    for(const key in obj){
        //ข้าม key ที่ไม่ได้เป็น property จริง
        if(!obj.hasOwnProperty(key))continue;

        const val = obj[key];
        //สร้าง key ใหม่ ถ้ามี parent (เช่น "addressInfo") ให้ต่อด้วยจุด
        const newKey = parentKey ? `${parentKey}.${key}`:key;

        if(
            typeof val === "object" &&
            val !== null &&
            !Array.isArray(val) 
        ){
            //ถ้าเป็น object ซ้อนให้ recurse
            flattenObject(val,newKey,res);
        }else{
            //ถ้าเป็น primitive เช่น string , number , boolean
            res[newKey] = val;
        }
    }
    return res;
}