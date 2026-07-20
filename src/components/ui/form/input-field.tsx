import { ComponentProps } from 'react';
import { Input } from '../input';
import { InputMask } from '@react-input/mask';
import { FormField } from './field';

type InputFieldProps = ComponentProps<typeof FormField>
  & ComponentProps<typeof Input>
  & {
    mask?: string;
  };

export const InputField = ({ name, className, mask, ...props }: InputFieldProps) => {
  return (
    <FormField name={name} className={className} {...props}>
      {({ field }) => mask ? (
        <InputMask
          mask={mask}
          component={Input}
          replacement={{ _: /\d/ }}
          {...field}
          {...props}
        />
      )
        : <Input {...field} {...props} />}
    </FormField>
  );
};