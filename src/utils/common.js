export const CreateDropdownData = (obj) => {
    return Object.keys(obj)?.map((key) => ({
        label: obj[key],
        value: key,
    }));
};

export const encodedSlug = (value) => btoa(value);
export const decodedSlug = (value) => atob(value);