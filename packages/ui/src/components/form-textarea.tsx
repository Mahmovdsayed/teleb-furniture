'use client';

import { FieldError, UseFormRegister } from 'react-hook-form'
import AlertWrapper from './alert-wrapper'
import { Field, FieldDescription, FieldLabel } from './field'
import { Textarea } from './textarea'

interface IProps {
    name: string
    label: string
    placeholder?: string
    description?: string
    register: UseFormRegister<any>
    error?: FieldError
    defaultValue?: string | number | readonly string[] | undefined
    className?: string
    rows?: number
    maxLength?: number
    disabled?: boolean
}

const FormTextarea = ({
    name,
    label,
    placeholder,
    description,
    register,
    error,
    defaultValue,
    className,
    rows,
    disabled
}: IProps) => {
    return (
        <Field>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <Textarea
                disabled={disabled}
                {...register(name)}
                id={name}
                placeholder={placeholder}
                defaultValue={defaultValue}
                className={`min-h-32 resize-none ${className || ''}`}
                rows={rows}
            />

            {description && (
                <FieldDescription>{description}</FieldDescription>
            )}

            {error && <AlertWrapper errText={String(error.message)} />}
        </Field>
    )
}

export default FormTextarea