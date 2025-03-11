
export const formatDate =(dateObj) =>{
    const date = new Date(dateObj.$date);
    return date.toLocaleDateString("en-Us",{
        month:"long",
        day:"numeric",
        year:"numeric",
    });
};