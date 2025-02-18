import * as yup from 'yup';
import { FIELD_MANDATORY, FUTURE_DATES_NOT_ALLOWED, INVALID_DATE, PAST_DATES_NOT_ALLOWED, POSTIVE_VALUE } from '../../../config/constants';

// remove time from date
const stripTime = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
};

export const expenseValidationSchema = yup.object({
    name: yup.string().required(FIELD_MANDATORY),
    category: yup.string().required(FIELD_MANDATORY),
    price: yup.number()
        .required(FIELD_MANDATORY)
        .positive(POSTIVE_VALUE("Price")),
    date: yup.date()
        .typeError(INVALID_DATE)
        .transform((originalValue) => {
            if (originalValue) {
                return stripTime(originalValue);
            }
        })
        .min(stripTime(new Date(2025, 0, 1)), PAST_DATES_NOT_ALLOWED)
        .max(stripTime(new Date()), FUTURE_DATES_NOT_ALLOWED)
        .required(FIELD_MANDATORY),
    by: yup.string().required(FIELD_MANDATORY),
});