import React from 'react';
import { useRouteMatch } from 'react-router-dom';

import { MenuItem } from '@material-ui/core';

import BookmarkForm from 'components/BookmarkForm/BookmarkForm';
import AppBar from 'components/AppBar/AppBar';
import ControlPopover from 'components/ControlPopover/ControlPopover';
import LiveUpdateSettings from 'components/LiveUpdateSettings/LiveUpdateSettings';
import { Button, Icon, Text } from 'components/kit';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import ConfirmModal from 'components/ConfirmModal/ConfirmModal';

import { DOCUMENTATIONS } from 'config/references';

import { IResourceState } from 'modules/core/utils/createResource';
import {
  IExperimentData,
  IExperimentDataShort,
} from 'modules/core/api/experimentsApi';

import createExperimentEngine from 'pages/Dashboard/components/ExploreSection/ExperimentsCard/ExperimentsStore';
import ExperimentBar from 'pages/Experiment/components/ExperimentBar';
import useExperimentState from 'pages/Experiment/useExperimentState';

import { IMetricsBarProps } from 'types/pages/metrics/components/MetricsBar/MetricsBar';

import { getSelectedExperiments } from 'utils/app/getSelectedExperiments';

import './MetricsBar.scss';

function MetricsBar({
  title,
  explorerName = 'METRICS',
  liveUpdateConfig,
  disabled,
  onBookmarkCreate,
  onBookmarkUpdate,
  onResetConfigData,
  onLiveUpdateConfigChange,
  onSelectExperimentsChange,
  onToggleAllExperiments,
}: IMetricsBarProps): React.FunctionComponentElement<React.ReactNode> {
  const [popover, setPopover] = React.useState<string>('');
  const [selectedExperiments, setSelectedExperiments] = React.useState<
    IExperimentDataShort[]
  >(getSelectedExperiments());

  const route = useRouteMatch<any>();

  const { current: experimentsEngine } = React.useRef(createExperimentEngine);

  const experimentsStore: IResourceState<IExperimentData[]> =
    experimentsEngine.experimentsState((state) => state);

  React.useEffect(() => {
    experimentsEngine.fetchExperiments();
    return () => {
      experimentsEngine.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch all experiments along with default
  const {
    experimentState,
    experimentsState,
    selectedExperiments: filteredSelectedExperiments,
    getExperimentsData,
  } = useExperimentState(experimentsStore.data?.[0]?.id);

  // Remove selected experiments that are not in the list of fetched experiments
  React.useEffect(() => {
    if (filteredSelectedExperiments.length !== selectedExperiments.length) {
      setSelectedExperiments(filteredSelectedExperiments);
    }
  }, [filteredSelectedExperiments, selectedExperiments]);

  const { data: experimentData, loading: isExperimentLoading } =
    experimentState;

  const { data: experimentsData, loading: isExperimentsLoading } =
    experimentsState;

  function handleBookmarkClick(value: string): void {
    setPopover(value);
  }

  function handleClosePopover(): void {
    setPopover('');
  }

  function handleBookmarkUpdate(): void {
    onBookmarkUpdate(route.params.appId);
    handleClosePopover();
  }

  function handleExperimentsChange(experiment: IExperimentDataShort): void {
    onSelectExperimentsChange(experiment);
    setSelectedExperiments(getSelectedExperiments());
  }

  return (
    <ErrorBoundary>
      <AppBar title={title} disabled={disabled}>
        <ExperimentBar
          experimentsData={experimentsData}
          isExperimentLoading={isExperimentLoading}
          isExperimentsLoading={isExperimentsLoading}
          selectedExperiments={selectedExperiments}
          getExperimentsData={getExperimentsData}
          onSelectExperimentsChange={handleExperimentsChange}
          onToggleAllExperiments={onToggleAllExperiments}
        />
        <LiveUpdateSettings
          {...liveUpdateConfig}
          onLiveUpdateConfigChange={onLiveUpdateConfigChange}
        />
        {route.params.appId ? (
          <ErrorBoundary>
            <ControlPopover
              title='Bookmark'
              anchor={({ onAnchorClick }) => (
                <Button color='secondary' size='small' onClick={onAnchorClick}>
                  <Text size={14} className='MetricsBar__item__bookmark__Text'>
                    Bookmark
                  </Text>
                  <Icon
                    name='bookmarks'
                    className='MetricsBar__item__bookmark__Icon'
                  />
                </Button>
              )}
              component={
                <div className='MetricsBar__popover'>
                  <MenuItem onClick={() => handleBookmarkClick('create')}>
                    Create Bookmark
                  </MenuItem>
                  <MenuItem onClick={() => handleBookmarkClick('update')}>
                    Update Bookmark
                  </MenuItem>
                </div>
              }
            />
          </ErrorBoundary>
        ) : (
          <Button
            color='secondary'
            className='MetricsBar__item__bookmark'
            size='small'
            onClick={() => handleBookmarkClick('create')}
          >
            <Text size={14} className='MetricsBar__item__bookmark__Text'>
              Bookmark
            </Text>
            <Icon
              fontSize={14}
              name='bookmarks'
              className='MetricsBar__item__bookmark__Icon'
            />
          </Button>
        )}
        <div className='MetricsBar__menu'>
          <ErrorBoundary>
            <ControlPopover
              title='Menu'
              anchor={({ onAnchorClick }) => (
                <Button
                  withOnlyIcon
                  color='secondary'
                  size='small'
                  onClick={onAnchorClick}
                >
                  <Icon
                    fontSize={16}
                    name='menu'
                    className='MetricsBar__item__bookmark__Icon'
                  />
                </Button>
              )}
              component={
                <div className='MetricsBar__popover'>
                  <MenuItem onClick={onResetConfigData}>
                    Reset Controls to System Defaults
                  </MenuItem>
                  <a
                    href={DOCUMENTATIONS.EXPLORERS[explorerName].MAIN}
                    target='_blank'
                    rel='noreferrer'
                  >
                    <MenuItem>Explorer Documentation</MenuItem>
                  </a>
                </div>
              }
            />
          </ErrorBoundary>
        </div>
        <ErrorBoundary>
          <BookmarkForm
            onBookmarkCreate={onBookmarkCreate}
            onClose={handleClosePopover}
            open={popover === 'create'}
          />
        </ErrorBoundary>
        <ConfirmModal
          open={popover === 'update'}
          onCancel={handleClosePopover}
          onSubmit={handleBookmarkUpdate}
          text='Are you sure you want to update bookmark?'
          icon={<Icon name='check' />}
          title='Update bookmark'
          statusType='success'
          confirmBtnText='Update'
        />
      </AppBar>
    </ErrorBoundary>
  );
}

export default React.memo(MetricsBar);
