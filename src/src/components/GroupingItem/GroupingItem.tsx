import React from 'react';
import classNames from 'classnames';

import { Tooltip } from '@material-ui/core';

import ControlPopover from 'components/ControlPopover/ControlPopover';
import GroupingPopover from 'components/GroupingPopover/GroupingPopover';
import { Icon } from 'components/kit';
import { IconName } from 'components/kit/Icon';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';

import { GroupNameEnum } from 'config/grouping/GroupingPopovers';

import { IGroupingItemProps } from 'types/pages/components/GroupingItem/GroupingItem';

import './GroupingItem.scss';

const icons = {
  stroke: 'line-style',
  chart: 'chart-group',
  row: 'image-group',
  color: 'coloring',
};

function GroupingItem({
  title,
  groupName,
  groupingData,
  inputLabel,
  advancedComponent,
  onSelect,
  onGroupingModeChange,
  groupingSelectOptions,
  conditionalGroupingOptions,
  isDisabled,
}: IGroupingItemProps): React.FunctionComponentElement<React.ReactNode> {
  return (
    <ErrorBoundary>
      <ControlPopover
        title={title}
        anchor={({ onAnchorClick, opened }) => (
          <Tooltip title={`Group by ${groupName}`}>
            <div
              onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                if (!isDisabled) {
                  onAnchorClick(e);
                }
              }}
              className={classNames('GroupingItem', {
                isDisabled: isDisabled,
              })}
            >
              <div
                className={`GroupingItem__icon__box ${opened ? 'active' : ''} ${
                  groupingSelectOptions?.length &&
                  (groupingData?.[groupName]?.length ||
                    (groupName !== GroupNameEnum.ROW &&
                      groupingData?.conditions?.[groupName].length))
                    ? 'outlined'
                    : ''
                }`}
              >
                <Icon name={icons[groupName] as IconName} />
              </div>
            </div>
          </Tooltip>
        )}
        component={
          <GroupingPopover
            groupName={groupName}
            inputLabel={inputLabel}
            groupingData={groupingData}
            groupingSelectOptions={groupingSelectOptions}
            conditionalGroupingOptions={conditionalGroupingOptions}
            advancedComponent={advancedComponent}
            onSelect={onSelect}
            onGroupingModeChange={onGroupingModeChange}
          />
        }
      />
    </ErrorBoundary>
  );
}

export default GroupingItem;
