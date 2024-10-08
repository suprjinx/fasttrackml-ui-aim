import React from 'react';

import NotificationContainer from 'components/NotificationContainer/NotificationContainer';
import ProgressBar from 'components/ProgressBar/ProgressBar';

import { RequestStatusEnum } from 'config/enums/requestStatusEnum';
import pageTitlesEnum from 'config/pageTitles/pageTitles';

import AppBar from 'pages/Metrics/components/MetricsBar/MetricsBar';

import RunsTable from './RunsTable';
import SearchBar from './components/SearchBar/SearchBar';

import './Runs.scss';

function Runs(props: any): React.FunctionComponentElement<React.ReactNode> {
  const [isProgressBarVisible, setIsProgressBarVisible] =
    React.useState<boolean>(false);
  return (
    <div className='Runs__container'>
      <section className='Runs__section'>
        <div className='Runs__section__appBarContainer Runs__fullHeight'>
          <AppBar
            disabled={isProgressBarVisible}
            explorerName='RUNS'
            onBookmarkCreate={props.onBookmarkCreate}
            onBookmarkUpdate={props.onBookmarkUpdate}
            onResetConfigData={props.onResetConfigData}
            liveUpdateConfig={props.liveUpdateConfig}
            onLiveUpdateConfigChange={props.onLiveUpdateConfigChange}
            onSelectExperimentsChange={props.onSelectExperimentsChange}
            onToggleAllExperiments={props.onToggleAllExperiments}
            title={pageTitlesEnum.RUNS_EXPLORER}
          />
          <SearchBar
            selectFormData={props.selectFormData}
            onSearchInputChange={props.onSelectRunQueryChange}
            searchValue={props.query}
            isRunsDataLoading={
              props.requestStatus === RequestStatusEnum.Pending
            }
            isDisabled={isProgressBarVisible}
          />
          <div className='Runs__table__container'>
            <ProgressBar
              progress={props.requestProgress}
              pendingStatus={props.requestStatus === RequestStatusEnum.Pending}
              setIsProgressBarVisible={setIsProgressBarVisible}
            />
            <RunsTable
              columnsOrder={props.columnsOrder}
              hiddenColumns={props.hiddenColumns}
              onColumnsVisibilityChange={props.onColumnsVisibilityChange}
              onTableDiffShow={props.onTableDiffShow}
              onManageColumns={props.onManageColumns}
              onRowHeightChange={props.onRowHeightChange}
              data={props.tableData}
              sameValueColumns={props.sameValueColumns}
              isInfiniteLoading={props.isInfiniteLoading}
              isLatest={props.isLatest}
              hideSystemMetrics={props.hideSystemMetrics}
              onExportTableData={props.onExportTableData}
              tableRowHeight={props.tableRowHeight}
              columns={props.tableColumns}
              runsList={props.tableData}
              requestStatus={props.requestStatus}
              tableRef={props.tableRef}
              getLastRunsData={props.getLastRunsData}
              columnsWidths={props.columnsWidths}
              updateColumnsWidths={props.updateColumnsWidths}
              selectedRows={props.selectedRows}
              onRowSelect={props.onRowSelect}
              archiveRuns={props.archiveRuns}
              deleteRuns={props.deleteRuns}
              onToggleColumnsColorScales={props.onToggleColumnsColorScales}
              columnsColorScales={props.columnsColorScales}
            />
          </div>
        </div>
        {props.notifyData?.length > 0 && (
          <NotificationContainer
            handleClose={props.onNotificationDelete}
            data={props.notifyData}
          />
        )}
      </section>
    </div>
  );
}

export default Runs;
