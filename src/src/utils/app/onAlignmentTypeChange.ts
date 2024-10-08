import { ANALYTICS_EVENT_KEYS } from 'config/analytics/analyticsKeysMap';
import { CONTROLS_DEFAULT_CONFIG } from 'config/controls/controlsDefaultConfig';

import * as analytics from 'services/analytics';

import { IModel, State } from 'types/services/models/model';
import { IAppModelConfig } from 'types/services/models/explorer/createAppModel';

import { AlignmentOptionsEnum } from '../d3';

export default function onAlignmentTypeChange<M extends State>({
  chartId,
  type,
  model,
  appName,
  updateModelData,
}: {
  chartId: number;
  type: AlignmentOptionsEnum;
  model: IModel<M>;
  appName: string;
  updateModelData: (
    configData: IAppModelConfig | any,
    shouldURLUpdate?: boolean,
  ) => void;
}): void {
  const configData = model.getState()?.config;
  if (configData?.chart) {
    const updatedAlignmentConfigs = configData.chart.alignmentConfigs.map(
      (alignmentConfig: any, index: number) => {
        if (index === chartId) {
          const newAlignmentConfig = { ...alignmentConfig, type };

          if (type !== AlignmentOptionsEnum.CUSTOM_METRIC) {
            newAlignmentConfig.metric = '';
          }

          return newAlignmentConfig;
        }
        return alignmentConfig;
      },
    );

    configData.chart = {
      ...configData.chart,
      alignmentConfigs: updatedAlignmentConfigs,
      zoom: { ...configData.chart.zoom, history: [] },
    };

    updateModelData(configData, true);
  }
  analytics.trackEvent(
    `${
      // @ts-ignore
      ANALYTICS_EVENT_KEYS[appName].chart.controls.changeXAxisProperties
    }, Align X axis by "${type.toLowerCase()}"`,
  );
}
