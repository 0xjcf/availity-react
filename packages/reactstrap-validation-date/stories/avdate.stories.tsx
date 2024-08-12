import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Label, Button } from 'reactstrap';
import { AvGroup, AvFeedback } from 'availity-reactstrap-validation';

import { AvDate, AvDateField, AvDateRange, AvDateRangeField } from '..';
// import README from '../README.md';
import '../styles.scss';

// eslint-disable-next-line import/no-relative-packages
import AvFormResults from '../../../story-utils/AvFormResults';
import { AvDateFieldProps } from '../types/AvDateField';
import { AvDateRangeProps } from '../types/AvDateRange';
import { AvDateRangeFieldProps } from '../types/AvDateRangeField';

const types = ['text', 'date'];
export default {
  title: 'Legacy Form Components/AvDate',
  component: AvDate,
  parameters: {
    docs: {
      // page: README,
    },
  },
} as Meta;

export const Default: Story = ({ datepicker, disabled, max, min, required, type }) => (
  <AvFormResults>
    <AvDate
      name="standAlone"
      datepicker={datepicker}
      disabled={disabled}
      max={max}
      min={min}
      required={required}
      type={type}
    />
    <Button className="mt-3" color="primary">
      Submit
    </Button>
  </AvFormResults>
);
Default.args = {
  datepicker: true,
  disabled: false,
  max: '',
  min: '',
  required: true,
  type: 'text',
};
Default.argTypes = {
  type: {
    type: 'select',
    options: types,
  },
};
Default.storyName = 'default';

export const WithLabel: Story = ({ datepicker, disabled, errorMessage, label, max, min, required, type }) => (
  <AvFormResults>
    <AvGroup>
      <Label for="standAloneWithLabel">{label}</Label>
      <AvDate
        name="standAlone"
        datepicker={datepicker}
        disabled={disabled}
        max={max}
        min={min}
        required={required}
        type={type}
      />
      <AvFeedback>{errorMessage}</AvFeedback>
    </AvGroup>
    <Button color="primary">Submit</Button>
  </AvFormResults>
);
WithLabel.args = {
  datepicker: true,
  disabled: false,
  errorMessage: 'This field is invalid',
  label: 'AvDate Label',
  max: '',
  min: '',
  required: true,
  type: 'text',
};
WithLabel.argTypes = {
  type: {
    type: 'select',
    options: types,
  },
};
WithLabel.storyName = 'with label';

export const _AvDateField: Story = ({
  datepicker,
  disabled,
  errorMessage,
  label,
  max,
  min,
  required,
  requiredErrorMessage,
  type,
}) => (
  <AvFormResults>
    <AvDateField
      name="AvDateField"
      datepicker={datepicker}
      disabled={disabled}
      errorMessage={errorMessage}
      label={label}
      max={max}
      min={min}
      required={required}
      type={type}
      distance={{
        max: {
          value: 90,
          units: 'days',
        },
      }}
      validate={{
        required: {
          value: required,
          errorMessage: required && requiredErrorMessage,
        },
      }}
    />
    <Button color="primary">Submit</Button>
  </AvFormResults>
);
_AvDateField.args = {
  datepicker: true,
  disabled: false,
  errorMessage: 'This field is invalid',
  label: 'Field Label',
  max: '',
  min: '',
  required: true,
  requiredErrorMessage: 'This field is required',
  type: 'text',
};
_AvDateField.argTypes = {
  type: {
    type: 'select',
    options: types,
  },
};
_AvDateField.storyName = 'AvDateField';

const distanceUnits = ['day', 'month'];
export const _AvDateRange: Story = ({
  autoSync,
  datepicker,
  defaultEndDate,
  defaultStartDate,
  disabled,
  errorMessage,
  maxDistance,
  maxDistanceUnits,
  minDistance,
  minDistanceUnits,
  ranges,
  required,
  requiredErrorMessage,
  type,
}) => {
  const min = minDistance &&
    minDistanceUnits && {
      value: minDistance,
      units: minDistanceUnits,
    };
  const max = maxDistance &&
    maxDistanceUnits && {
      value: maxDistance,
      units: maxDistanceUnits,
    };
  const distance = (min || max) && { min, max };
  const baseStart = {
    name: 'date.start',
    value: undefined,
  };
  const baseEnd = {
    name: 'date.end',
    value: undefined,
  };
  if (defaultStartDate) {
    baseStart.value = defaultStartDate;
  }
  if (defaultEndDate) {
    baseEnd.value = defaultEndDate;
  }
  return (
    <AvFormResults>
      <AvDateRange
        name="AvDateRange"
        type={type}
        start={baseStart}
        end={baseEnd}
        min={min}
        max={max}
        required={required}
        disabled={disabled}
        autoSync={autoSync}
        distance={distance}
        ranges={ranges}
        errorMessage={errorMessage}
        validate={{
          required: {
            value: required,
            errorMessage: required && requiredErrorMessage,
          },
        }}
        datepicker={datepicker}
      />
      <Button color="primary">Submit</Button>
    </AvFormResults>
  );
};
_AvDateRange.args = {
  autoSync: true,
  datepicker: true,
  defaultEndDate: '2019-12-31',
  defaultStartDate: '2019-01-01',
  disabled: false,
  errorMessage: 'This field is invalid',
  maxDistance: 0,
  maxDistanceUnits: distanceUnits[0],
  minDistance: 0,
  minDistanceUnits: distanceUnits[0],
  ranges: true,
  required: true,
  requiredErrorMessage: 'This field is required',
  type: 'text',
};
_AvDateRange.argTypes = {
  maxDistanceUnits: {
    type: 'select',
    options: distanceUnits,
  },
  minDistanceUnits: {
    type: 'select',
    options: distanceUnits,
  },
  type: {
    type: 'select',
    options: types,
  },
};
_AvDateRange.storyName = 'AvDateRange';

export const _AvDateRangeField: Story = ({
  autoSync,
  datepicker,
  defaultEndDate,
  defaultStartDate,
  disabled,
  errorMessage,
  label,
  maxDistance,
  maxDistanceUnits,
  minDistance,
  minDistanceUnits,
  ranges,
  required,
  requiredErrorMessage,
  type,
}) => {
  const min = minDistance &&
    minDistanceUnits && {
      value: minDistance,
      units: minDistanceUnits,
    };
  const max = maxDistance &&
    maxDistanceUnits && {
      value: maxDistance,
      units: maxDistanceUnits,
    };
  const distance = (min || max) && { min, max };
  const baseStart = {
    name: 'date.start',
    value: undefined,
  };
  const baseEnd = {
    name: 'date.end',
    value: undefined,
  };

  if (defaultStartDate) {
    baseStart.value = defaultStartDate;
  }
  if (defaultEndDate) {
    baseEnd.value = defaultEndDate;
  }

  return (
    <AvFormResults>
      <AvDateRangeField
        name="AvDateRange"
        label={label}
        type={type}
        start={baseStart}
        end={baseEnd}
        min={min}
        max={max}
        distance={distance}
        ranges={ranges}
        required={required}
        disabled={disabled}
        autoSync={autoSync}
        errorMessage={errorMessage}
        validate={{
          required: {
            value: required,
            errorMessage: required && requiredErrorMessage,
          },
        }}
        datepicker={datepicker}
      />
      <Button color="primary">Submit</Button>
    </AvFormResults>
  );
};
_AvDateRangeField.args = {
  autoSync: true,
  datepicker: true,
  defaultEndDate: '2019-12-31',
  defaultStartDate: '2019-01-01',
  disabled: false,
  errorMessage: 'This field is invalid',
  label: 'Date Range',
  maxDistance: 0,
  maxDistanceUnits: distanceUnits[0],
  minDistance: 0,
  minDistanceUnits: distanceUnits[0],
  ranges: true,
  required: true,
  requiredErrorMessage: 'This field is required',
  type: 'text',
};
_AvDateRangeField.argTypes = {
  maxDistanceUnits: {
    type: 'select',
    options: distanceUnits,
  },
  minDistanceUnits: {
    type: 'select',
    options: distanceUnits,
  },
  type: {
    type: 'select',
    options: types,
  },
};
_AvDateRangeField.storyName = 'AvDateRangeField';

export const hidden_AvDateField = (props: AvDateFieldProps) => <AvDateField {...props} />;
export const hidden_AvDateRange = (props: AvDateRangeProps) => <AvDateRange {...props} />;
export const hidden_AvDateRangeField = (props: AvDateRangeFieldProps) => <AvDateRangeField {...props} />;
