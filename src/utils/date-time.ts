export const formatDateTime = (date?: Date): string => {
    if (!date) {
        return "";
    }
    let day: number | string = date.getDate();
    let month: number | string = date.getMonth() + 1;
    const year = date.getFullYear();

    const hh =
        date.getHours() < 10
            ? `0${date.getHours()}`
            : date.getHours().toString();
    const MM =
        date.getMinutes() < 10
            ? `0${date.getMinutes()}`
            : date.getMinutes().toString();

    if (day < 10) {
        day = `0${day}`;
    }
    if (month < 10) {
        month = `0${month}`;
    }

    return `${hh}:${MM} - ${day}/${month}/${year}`;
};
