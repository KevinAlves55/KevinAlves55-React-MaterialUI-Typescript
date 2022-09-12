import { useEffect, useState } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { PatternFormatProps, PatternFormat } from "react-number-format";
import { useField } from "@unform/core";

type VPatternFormatProps = Omit<PatternFormatProps, "value"> & Omit<TextFieldProps, "value"> & {

    name: string;
    onValueChange?: (value: string) => void;

}

export const VPatternFormat: React.FC<VPatternFormatProps> = ({ name, onValueChange, ...rest }) => {

    const { clearError, fieldName, defaultValue, error, registerField } = useField(name);

    const [value, setValue] = useState<string>(defaultValue);

    useEffect(() => {

        registerField({
            name: fieldName,
            getValue: () => value,
            setValue: (_, newValue) => setValue(newValue)
        });

    }, [registerField, fieldName, value]);

    const handleChange = (value: string) => {
        setValue(value);
        onValueChange && onValueChange(value);
    };

    return(
        
        <PatternFormat
            {...rest}

            customInput={TextField}
            error={!!error}
            helperText={error}
            defaultValue={defaultValue}
            
            value={value}
            onChange={e => { setValue(e.target.value); rest.onChange?.(e); }}
            onValueChange={({ value }) => handleChange(value)}
            onKeyDown={e => { error && clearError(); rest.onKeyDown?.(e); }}
        />

    );

};
