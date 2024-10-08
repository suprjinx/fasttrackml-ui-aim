import React, { memo } from 'react';
import { useHistory } from 'react-router-dom';

import ConfirmModal from 'components/ConfirmModal/ConfirmModal';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import NameAndDescriptionCard from 'components/NameAndDescriptionCard';
import { ActionCard, Icon } from 'components/kit';

import { ANALYTICS_EVENT_KEYS } from 'config/analytics/analyticsKeysMap';

import * as analytics from 'services/analytics';

import { IExperimentSettingsTabProps } from '.';

import './ExperimentSettingsTab.scss';

function ExperimentSettingsTab({
  experimentName,
  description,
  updateExperiment,
  deleteExperiment,
}: IExperimentSettingsTabProps): React.FunctionComponentElement<React.ReactNode> {
  const history = useHistory();
  const [openDeleteModal, setOpenDeleteModal] = React.useState<boolean>(false);

  function onExperimentDelete() {
    deleteExperiment(() => {
      history.push('/experiments');
    });
  }

  function handleDeleteModalOpen() {
    setOpenDeleteModal(true);
  }

  function handleDeleteModalClose() {
    setOpenDeleteModal(false);
  }
  React.useEffect(() => {
    analytics.pageView(ANALYTICS_EVENT_KEYS.experiment.tabs.settings.tabView);
  }, []);

  function onSave(name: string, description: string) {
    updateExperiment(name, description);
  }

  return (
    <ErrorBoundary>
      <div className='ExperimentSettingsTab'>
        <div className='ExperimentSettingsTab__actionCardsCnt'>
          <NameAndDescriptionCard
            title='Experiment Properties'
            defaultName={experimentName ?? ''}
            defaultDescription={description ?? ''}
            onSave={onSave}
          />
          <ActionCard
            title='Delete Experiment'
            description='Once you delete an experiment, there is no going back. Please be certain.'
            btnTooltip='Delete Experiment'
            btnText='Delete'
            onAction={handleDeleteModalOpen}
            btnProps={{
              variant: 'contained',
              className: 'ExperimentSettingsTab__actionCardsCnt__btn__delete',
            }}
          />
        </div>
        <ConfirmModal
          open={openDeleteModal}
          onCancel={handleDeleteModalClose}
          onSubmit={onExperimentDelete}
          text='Are you sure you want to delete this experiment?'
          icon={<Icon name='delete' />}
          title='Delete experiment'
          statusType='error'
          confirmBtnText='Delete'
        />
      </div>
    </ErrorBoundary>
  );
}

export default memo(ExperimentSettingsTab);
