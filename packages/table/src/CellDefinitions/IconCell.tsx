import React from 'react';
import Icon, { IconProps } from '@availity/icon';

type CellValue<T> = T;
type CellProps<T> = {
  value: CellValue<T>;
};

export type IconConfig<T> = {
  name: string;
  title?: string;
  getTitle?: (value: T) => string;
  defaultValue?: string | React.ReactChild | React.ElementType;
} & IconProps;

const IconCell = <T,>({
  name,
  title,
  getTitle,
  defaultValue = '',
  ...attributes
}: IconConfig<T>): JSX.Element | ((cell: CellProps<T>) => JSX.Element | null) => {
  const IconCellDef = ({ value }: CellProps<T>): JSX.Element | null => {
    let generatedTitle;
    if (title) {
      generatedTitle = title;
    } else if (getTitle) {
      generatedTitle = getTitle(value);
    }

    // eslint-disable-next-line react/jsx-no-useless-fragment
    return value ? <Icon name={name} title={generatedTitle} {...attributes} /> : <>{defaultValue}</>;
  };

  return IconCellDef;
};

export default IconCell;
