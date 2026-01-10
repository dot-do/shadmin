import {
    required as createRequiredValidator,
    number as createNumberValidator,
} from 'shadmin';

export const required = createRequiredValidator();
export const number = createNumberValidator();
