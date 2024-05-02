import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useField, useFormikContext } from 'formik';

import Feedback from './Feedback';
import FormGroup from './FormGroup';
import Label from './Label';

export const CheckboxGroupContext = createContext();

export const useCheckboxGroup = (name) => {
  const { setFieldValue } = useFormikContext();
  const { name: groupName, groupOnChange, value = [], ...rest } = useContext(CheckboxGroupContext);

  const toggle = () => {
    const valueArray = [...value];

    const indexOfVal = valueArray.indexOf(name);

    if (indexOfVal === -1) {
      valueArray.push(name);
    } else {
      valueArray.splice(indexOfVal, 1);
    }

    setFieldValue(groupName, valueArray);

    if (groupOnChange) {
      groupOnChange(valueArray);
    }
  };

  return { toggle, value: value.indexOf(name) > -1, ...rest };
};

const CheckboxGroup = ({
  name,
  children,
  onChange: groupOnChange,
  groupClassName,
  label,
  labelClassName,
  required,
  helpId,
  isHelpVideoType,
  ...rest
}) => {
  const [field, metadata] = useField(name);

  const classes = classNames(
    groupClassName,
    'form-control border-0 p-0 h-auto',
    metadata.touched ? 'is-touched' : 'is-untouched',
    metadata.touched && metadata.error && 'is-invalid'
  );

  let tag = 'div';
  let legend = null;

  if (label) {
    tag = 'fieldset';
    const legendId = `${name}-legend`.toLowerCase();
    const srRequiredAsterisk = required ? '* ' : null;
    const styles = { cursor: 'default', lineHeight: 'inherit', color: '#000' };
    const labelClasses = classNames('form-inline', labelClassName, !labelClassName && 'h4 font-weight-normal');

    legend = (
      <>
        <legend id={legendId} className="sr-only">
          {srRequiredAsterisk}
          {label}
        </legend>
        <div className={labelClasses} style={styles}>
          <Label tag="div" aria-hidden helpId={helpId} required={required} isHelpVideoType={isHelpVideoType}>
            {label}
          </Label>
        </div>
      </>
    );
  }

  return (
    <CheckboxGroupContext.Provider value={{ ...field, groupOnChange, metadata }}>
      <FormGroup tag={tag} for={name} {...rest}>
        {legend}
        <div className={classes} data-testid={`check-items-${name}`}>
          {children}
        </div>
        <Feedback name={name} />
      </FormGroup>
    </CheckboxGroupContext.Provider>
  );
};

CheckboxGroup.propTypes = {
  /** Name of the checkbox group. Should match name given in initialValues/validationSchema. */
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
  /** Class name to apply to the form control. */
  groupClassName: PropTypes.string,
  /** Help topic id, adds <FieldHelpIcon/> next to the label (should not be within label for accessibility). */
  helpId: PropTypes.string,
  /** Label for the group or checkboxes. */
  label: PropTypes.node,
  onChange: PropTypes.func,
  /** Class name to apply to the Label. Default is Legend styling */
  labelClassName: PropTypes.string,
  /** Will add <RequiredAsterisk /> to label. */
  required: PropTypes.bool,
  /** Allows the type of `<FieldHelpIcon/>` to be changed between help-icon and video-help */
  isHelpVideoType: PropTypes.bool,
};

export default CheckboxGroup;
