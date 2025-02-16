import * as yup from 'yup';
import { FIELD_MANDATORY, FUTURE_DATES_NOT_ALLOWED, INVALID_DATE, PAST_DATES_NOT_ALLOWED, POSTIVE_VALUE } from '../../../config/constants';

export const expenseValidationSchema = yup.object({
    name: yup.string().required(FIELD_MANDATORY),
    category: yup.string().required(FIELD_MANDATORY),
    amount: yup.string().required(FIELD_MANDATORY),
    price: yup.number()
        .required(FIELD_MANDATORY)
        .positive(POSTIVE_VALUE("Price")),
    date: yup.date()
        .typeError(INVALID_DATE)
        .min(new Date(2025, 0, 1), PAST_DATES_NOT_ALLOWED)
        .max(new Date(), FUTURE_DATES_NOT_ALLOWED)
        .required(FIELD_MANDATORY),
    by: yup.string().required(FIELD_MANDATORY),
});