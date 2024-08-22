import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useField, useFormikContext } from 'formik';
import '@availity/react-dates/initialize';
import { SingleDatePicker } from '@availity/react-dates';
import { InputGroup, Input, Row, Col } from 'reactstrap';
import moment from 'moment';

import '../polyfills';

import { isOutsideRange, limitPropType, buildYearPickerOptions } from './utils';

export const isoDateFormat = 'YYYY-MM-DD';

const yearPickerStyles = {
  minWidth: '100%', // 4 digit years not wide enough to fill column
};

const AvDate = ({
  className,
  name,
  placeholder,
  innerRef,
  onChange,
  onPickerFocusChange,
  min,
  max,
  format = 'MM/DD/YYYY',
  validate,
  datePickerProps,
  'data-testid': dataTestId,
  openDirection = 'down',
  ...attributes
}) => {
  const { setFieldValue, setFieldTouched, validateField } = useFormikContext();
  const [field, metadata] = useField({
    name,
    validate,
  });
  const [isFocused, setIsFocused] = useState(false);
  const classes = classNames(
    className,
    metadata.touched ? 'is-touched' : 'is-untouched',
    metadata.touched && metadata.error && 'is-invalid',
    !field.value && 'current-day-highlight'
  );

  const pickerId = `${(attributes.id || name).replaceAll(/[^\da-z]/gi, '')}-picker`;

  // Should only run validation once per real change to component, instead of each time setFieldValue/Touched is called.
  // By batching multiple calls for validation we can avoid multiple moment comparisons of the same values
  // and stale values can be avoided without resorting to async/await: https://github.com/jaredpalmer/formik/issues/2083#issuecomment-571259235
  useEffect(() => {
    if (field.value || metadata.touched) {
      validateField(name);
    }
  }, [field.value, metadata.touched, name, validateField]);

  // For updating when we delete the current input
  const onInputChange = (value) => {
    const date = moment(value, [isoDateFormat, format, 'MMDDYYYY', 'YYYYMMDD', 'M/D/YYYY', 'MM-DD-YYYY'], true);
    const isoFormatted = date.format(isoDateFormat);
    setFieldValue(name, date.isValid() ? isoFormatted : date, false);
    setFieldTouched(name, true, false);

    if (date.isValid()) {
      if (isFocused !== false) {
        setIsFocused(false);
      }
      if (onChange) {
        onChange(isoFormatted);
      }
    }
  };

  const onPickerChange = (value) => {
    let val = value;
    if (val !== null) {
      if (val instanceof Object && val.isValid()) {
        val = val.format(isoDateFormat);
      }

      setFieldValue(name, val, false);
      setFieldTouched(name, true, false);
    }

    if (onChange) {
      onChange(val);
    }
  };

  const onFocusChange = ({ focused }) => {
    if (!focused) {
      setFieldTouched(name, true, false);
    }

    if (focused !== undefined && isFocused !== focused) {
      setIsFocused(focused);
    }
    if (onPickerFocusChange) {
      onPickerFocusChange({ focused });
    }
  };

  const getDateValue = () => {
    const date = moment(field.value, [isoDateFormat, format, 'MMDDYYYY', 'YYYYMMDD', 'M/D/YYYY'], true);
    if (date.isValid()) return date;

    return null;
  };

  const renderMonthElement = ({ month, onMonthSelect, onYearSelect }) => {
    const yearPickerOptions = buildYearPickerOptions(min, max, month, format);
    return (
      <Row>
        <Col>
          <select
            data-testid="monthPicker"
            aria-label="month picker"
            value={month.month()}
            onChange={(e) => {
              onMonthSelect(month, e.target.value);
            }}
          >
            {moment.months().map((label, value) => (
              <option key={label} value={value} aria-label={label}>
                {label}
              </option>
            ))}
          </select>
        </Col>
        <Col>
          <select
            data-testid="yearPicker"
            aria-label="year picker"
            style={yearPickerStyles}
            value={month.year()}
            onChange={(e) => {
              onYearSelect(month, e.target.value);
            }}
          >
            {yearPickerOptions.map(({ value, label }) => (
              <option key={label} value={value} aria-label={label}>
                {label}
              </option>
            ))}
          </select>
        </Col>
      </Row>
    );
  };

  renderMonthElement.propTypes = {
    month: PropTypes.instanceOf(moment),
    onMonthSelect: PropTypes.func,
    onYearSelect: PropTypes.func,
  };

  return (
    <>
      <Input name={name} style={{ display: 'none' }} className={classes} />
      <InputGroup
        disabled={attributes.disabled}
        className={classes}
        onChange={({ target }) => target.id === pickerId && onInputChange(target.value)}
        data-testid={`date-input-group-${name}`}
      >
        <SingleDatePicker
          renderMonthElement={renderMonthElement}
          autoComplete="date"
          numberOfMonths={1}
          {...datePickerProps}
          disabled={attributes.disabled}
          id={pickerId}
          placeholder={placeholder ?? format.toLowerCase()}
          date={getDateValue()}
          onDateChange={onPickerChange}
          focused={isFocused}
          onFocusChange={onFocusChange}
          isOutsideRange={isOutsideRange(min, max)}
          navPosition="navPositionBottom"
          openDirection={openDirection}
        />
      </InputGroup>
    </>
  );
};

AvDate.propTypes = {
  /** The name of the field. Will be the key of the selected date that comes through in the values of the `onSubmit` callback. */
  name: PropTypes.string.isRequired,
  /** Whether the date is disabled. */
  disabled: PropTypes.bool,
  className: PropTypes.string,
  /** Used in conjunction with `max` to derive `isOutsideRange` prop from `react-dates` and selectable year options in datepicker. Dates outside the allowed range will not be clickable in datepicker. */
  min: limitPropType,
  /** Used in conjunction with min to derive `isOutsideRange` prop from `react-dates` and selectable year options in datepicker. Dates outside the allowed range will not be clickable in datepicker. */
  max: limitPropType,
  onChange: PropTypes.func,
  /** Function to be run when focus on the input changes. */
  onPickerFocusChange: PropTypes.func,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  /** How to format date value in `onSubmit` callback. Must be a format recognized by <a href={https://momentjs.com/docs/#/displaying/format/}>moment.</a>Default: `MM/DD/YYYY` */
  format: PropTypes.string,
  'data-testid': PropTypes.string,
  validate: PropTypes.func,
  /** Props to be spread onto the datepicker component from `react-dates`. */
  datePickerProps: PropTypes.object,
  /** Set which direction the date picker renders. Possible values are `up` and `down`. Default: `down` */
  openDirection: PropTypes.string,
  /** Placeholder input when no values have been entered. */
  placeholder: PropTypes.string,
};

export default AvDate;
