// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Platform from '../../../../core/platform/platform.js';
import * as UI from '../../legacy.js';
export const CSSAngleRegex = /(?<value>[+-]?\d*\.?\d+)(?<unit>deg|grad|rad|turn)/;
export const parseText = (text) => {
  const result = text.match(CSSAngleRegex);
  if (!result || !result.groups) {
    return null;
  }
  return {
    value: Number(result.groups.value),
    unit: result.groups.unit,
  };
};
export const getAngleFromRadians = (rad, targetUnit) => {
  let value = rad;
  switch (targetUnit) {
    case 'grad' /* AngleUnit.Grad */:
      value = UI.Geometry.radiansToGradians(rad);
      break;
    case 'deg' /* AngleUnit.Deg */:
      value = UI.Geometry.radiansToDegrees(rad);
      break;
    case 'turn' /* AngleUnit.Turn */:
      value = UI.Geometry.radiansToTurns(rad);
      break;
  }
  return {
    value,
    unit: targetUnit,
  };
};
export const getRadiansFromAngle = (angle) => {
  switch (angle.unit) {
    case 'deg' /* AngleUnit.Deg */:
      return UI.Geometry.degreesToRadians(angle.value);
    case 'grad' /* AngleUnit.Grad */:
      return UI.Geometry.gradiansToRadians(angle.value);
    case 'turn' /* AngleUnit.Turn */:
      return UI.Geometry.turnsToRadians(angle.value);
  }
  return angle.value;
};
export const get2DTranslationsForAngle = (angle, radius) => {
  const radian = getRadiansFromAngle(angle);
  return {
    translateX: Math.sin(radian) * radius,
    translateY: -Math.cos(radian) * radius,
  };
};
export const roundAngleByUnit = (angle) => {
  let roundedValue = angle.value;
  switch (angle.unit) {
    case 'deg' /* AngleUnit.Deg */:
    case 'grad' /* AngleUnit.Grad */:
      // Round to nearest whole unit.
      roundedValue = Math.round(angle.value);
      break;
    case 'rad' /* AngleUnit.Rad */:
      // Allow up to 4 decimals.
      roundedValue = Math.round(angle.value * 10000) / 10000;
      break;
    case 'turn' /* AngleUnit.Turn */:
      // Allow up to 2 decimals.
      roundedValue = Math.round(angle.value * 100) / 100;
      break;
    default:
      Platform.assertNever(angle.unit, `Unknown angle unit: ${angle.unit}`);
  }
  return {
    value: roundedValue,
    unit: angle.unit,
  };
};
export const getNextUnit = (currentUnit) => {
  switch (currentUnit) {
    case 'deg' /* AngleUnit.Deg */:
      return 'grad' /* AngleUnit.Grad */;
    case 'grad' /* AngleUnit.Grad */:
      return 'rad' /* AngleUnit.Rad */;
    case 'rad' /* AngleUnit.Rad */:
      return 'turn' /* AngleUnit.Turn */;
    default:
      return 'deg' /* AngleUnit.Deg */;
  }
};
export const convertAngleUnit = (angle, newUnit) => {
  if (angle.unit === newUnit) {
    return angle;
  }
  const radian = getRadiansFromAngle(angle);
  return getAngleFromRadians(radian, newUnit);
};
export const getNewAngleFromEvent = (angle, event) => {
  const direction = UI.UIUtils.getValueModificationDirection(event);
  if (direction === null) {
    return;
  }
  let diff = direction === 'Up' ? Math.PI / 180 : -Math.PI / 180;
  if (event.shiftKey) {
    diff *= 10;
  }
  const radian = getRadiansFromAngle(angle);
  return getAngleFromRadians(radian + diff, angle.unit);
};
//# sourceMappingURL=CSSAngleUtils.js.map
