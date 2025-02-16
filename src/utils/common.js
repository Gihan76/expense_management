export const CreateDropdownData = (obj) => {
    return Object.keys(obj)?.map((key) => ({
        label: obj[key],
        value: key,
    }));
};