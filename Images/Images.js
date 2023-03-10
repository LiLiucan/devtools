// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const sheet = new CSSStyleSheet();
sheet.replaceSync(':root {}');
const style = sheet.cssRules[0].style;

style.setProperty(
  '--image-file-accelerometer-bottom',
  'url("' + new URL('./accelerometer-bottom.png', import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-accelerometer-left',
  'url("' + new URL('./accelerometer-left.png', import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-accelerometer-right',
  'url("' + new URL('./accelerometer-right.png', import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-accelerometer-top',
  'url("' + new URL('./accelerometer-top.png', import.meta.url).toString() + '")',
);
style.setProperty('--image-file-checker', 'url("' + new URL('./checker.png', import.meta.url).toString() + '")');
style.setProperty(
  '--image-file-chromeDisabledSelect_2x',
  'url("' + new URL('./chromeDisabledSelect_2x.png', import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-chromeDisabledSelect',
  'url("' + new URL('./chromeDisabledSelect.png', import.meta.url).toString() + '")',
);
style.setProperty('--image-file-chromeLeft', 'url("' + new URL('./chromeLeft.avif', import.meta.url).toString() + '")');
style.setProperty(
  '--image-file-chromeMiddle',
  'url("' + new URL('./chromeMiddle.avif', import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-chromeRight',
  'url("' + new URL('./chromeRight.avif', import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-cssoverview_icons_2x',
  'url("' + new URL('./cssoverview_icons_2x.avif', import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-navigationControls_2x',
  'url("' + new URL('./navigationControls_2x.png', import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-navigationControls',
  'url("' + new URL('./navigationControls.png', import.meta.url).toString() + '")',
);
style.setProperty('--image-file-nodeIcon', 'url("' + new URL('./nodeIcon.avif', import.meta.url).toString() + '")');
style.setProperty(
  '--image-file-popoverArrows',
  'url("' + new URL('./popoverArrows.png', import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-profileGroupIcon',
  'url("' + new URL('./profileGroupIcon.png', import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-profileIcon',
  'url("' + new URL('./profileIcon.png', import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-profileSmallIcon',
  'url("' + new URL('./profileSmallIcon.png', import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-resourcesTimeGraphIcon',
  'url("' + new URL('./resourcesTimeGraphIcon.avif', import.meta.url).toString() + '")',
);
style.setProperty('--image-file-searchNext', 'url("' + new URL('./searchNext.png', import.meta.url).toString() + '")');
style.setProperty('--image-file-searchPrev', 'url("' + new URL('./searchPrev.png', import.meta.url).toString() + '")');
style.setProperty('--image-file-speech', 'url("' + new URL('./speech.png', import.meta.url).toString() + '")');
style.setProperty(
  '--image-file-toolbarResizerVertical',
  'url("' + new URL('./toolbarResizerVertical.png', import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-touchCursor_2x',
  'url("' + new URL('./touchCursor_2x.png', import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-touchCursor',
  'url("' + new URL('./touchCursor.png', import.meta.url).toString() + '")',
);
style.setProperty('--image-file-whatsnew', 'url("' + new URL('./whatsnew.avif', import.meta.url).toString() + '")');
style.setProperty(
  '--image-file-accelerometer-back',
  'url("' + new URL(new URL('accelerometer-back.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-accelerometer-front',
  'url("' + new URL(new URL('accelerometer-front.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-accessibility-icon',
  'url("' + new URL(new URL('accessibility-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-add-icon',
  'url("' + new URL(new URL('add-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-align-content-center-icon',
  'url("' + new URL(new URL('align-content-center-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-align-content-end-icon',
  'url("' + new URL(new URL('align-content-end-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-align-content-space-around-icon',
  'url("' +
    new URL(new URL('align-content-space-around-icon.svg', import.meta.url).href, import.meta.url).toString() +
    '")',
);
style.setProperty(
  '--image-file-align-content-space-between-icon',
  'url("' +
    new URL(new URL('align-content-space-between-icon.svg', import.meta.url).href, import.meta.url).toString() +
    '")',
);
style.setProperty(
  '--image-file-align-content-space-evenly-icon',
  'url("' +
    new URL(new URL('align-content-space-evenly-icon.svg', import.meta.url).href, import.meta.url).toString() +
    '")',
);
style.setProperty(
  '--image-file-align-content-start-icon',
  'url("' + new URL(new URL('align-content-start-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-align-content-stretch-icon',
  'url("' + new URL(new URL('align-content-stretch-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-align-items-center-icon',
  'url("' + new URL(new URL('align-items-center-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-align-items-flex-end-icon',
  'url("' + new URL(new URL('align-items-flex-end-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-align-items-flex-start-icon',
  'url("' +
    new URL(new URL('align-items-flex-start-icon.svg', import.meta.url).href, import.meta.url).toString() +
    '")',
);
style.setProperty(
  '--image-file-align-items-stretch-icon',
  'url("' + new URL(new URL('align-items-stretch-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-align-self-center-icon',
  'url("' + new URL(new URL('align-self-center-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-align-self-flex-end-icon',
  'url("' + new URL(new URL('align-self-flex-end-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-align-self-flex-start-icon',
  'url("' + new URL(new URL('align-self-flex-start-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-align-self-stretch-icon',
  'url("' + new URL(new URL('align-self-stretch-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-baseline-icon',
  'url("' + new URL(new URL('baseline-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-checkboxCheckmark',
  'url("' + new URL(new URL('checkboxCheckmark.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-chevrons',
  'url("' + new URL(new URL('chevrons.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-chromeSelect',
  'url("' + new URL(new URL('chromeSelect.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-chromeSelectDark',
  'url("' + new URL(new URL('chromeSelectDark.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-circled_backslash_icon',
  'url("' + new URL(new URL('circled_backslash_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-circled_exclamation_icon',
  'url("' + new URL(new URL('circled_exclamation_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-clear-warning_icon',
  'url("' + new URL(new URL('clear-warning_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-close-icon',
  'url("' + new URL(new URL('close-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-copy_icon',
  'url("' + new URL(new URL('copy_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-dropdown_7x6_icon',
  'url("' + new URL(new URL('dropdown_7x6_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-edit-icon',
  'url("' + new URL(new URL('edit-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-elements_panel_icon',
  'url("' + new URL(new URL('elements_panel_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-errorWave',
  'url("' + new URL(new URL('errorWave.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-error_icon',
  'url("' + new URL(new URL('error_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-feedback_button_icon',
  'url("' + new URL(new URL('feedback_button_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-file-sync_icon',
  'url("' + new URL(new URL('file-sync_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-file_icon',
  'url("' + new URL(new URL('file_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-flex-direction-icon',
  'url("' + new URL(new URL('flex-direction-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-flex-nowrap-icon',
  'url("' + new URL(new URL('flex-nowrap-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-flex-wrap-icon',
  'url("' + new URL(new URL('flex-wrap-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-frame-embedded-icon',
  'url("' + new URL(new URL('frame-embedded-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-frame-icon',
  'url("' + new URL(new URL('frame-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-help_outline',
  'url("' + new URL(new URL('help_outline.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_changes',
  'url("' + new URL(new URL('ic_changes.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_checkmark_16x16',
  'url("' + new URL(new URL('ic_checkmark_16x16.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_command_go_to_line',
  'url("' + new URL(new URL('ic_command_go_to_line.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_command_go_to_symbol',
  'url("' + new URL(new URL('ic_command_go_to_symbol.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_command_help',
  'url("' + new URL(new URL('ic_command_help.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_command_open_file',
  'url("' + new URL(new URL('ic_command_open_file.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_command_run_command',
  'url("' + new URL(new URL('ic_command_run_command.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_command_run_snippet',
  'url("' + new URL(new URL('ic_command_run_snippet.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_delete_filter',
  'url("' + new URL(new URL('ic_delete_filter.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_delete_list',
  'url("' + new URL(new URL('ic_delete_list.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_dimension_single',
  'url("' + new URL(new URL('ic_dimension_single.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_file_default',
  'url("' + new URL(new URL('ic_file_default.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_file_document',
  'url("' + new URL(new URL('ic_file_document.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_file_font',
  'url("' + new URL(new URL('ic_file_font.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_file_image',
  'url("' + new URL(new URL('ic_file_image.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_file_script',
  'url("' + new URL(new URL('ic_file_script.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_file_snippet',
  'url("' + new URL(new URL('ic_file_snippet.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_file_stylesheet',
  'url("' + new URL(new URL('ic_file_stylesheet.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_file_webbundle',
  'url("' + new URL(new URL('ic_file_webbundle.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_file_webbundle_inner_request',
  'url("' +
    new URL(new URL('ic_file_webbundle_inner_request.svg', import.meta.url).href, import.meta.url).toString() +
    '")',
);
style.setProperty(
  '--image-file-ic_folder_default',
  'url("' + new URL(new URL('ic_folder_default.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_folder_local',
  'url("' + new URL(new URL('ic_folder_local.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_folder_network',
  'url("' + new URL(new URL('ic_folder_network.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_info_black_18dp',
  'url("' + new URL(new URL('ic_info_black_18dp.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_layers_16x16',
  'url("' + new URL(new URL('ic_layers_16x16.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_memory_16x16',
  'url("' + new URL(new URL('ic_memory_16x16.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_page_next_16x16_icon',
  'url("' + new URL(new URL('ic_page_next_16x16_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_page_prev_16x16_icon',
  'url("' + new URL(new URL('ic_page_prev_16x16_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_preview_feature',
  'url("' + new URL(new URL('ic_preview_feature.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_redo_16x16_icon',
  'url("' + new URL(new URL('ic_redo_16x16_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_rendering',
  'url("' + new URL(new URL('ic_rendering.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_request_response',
  'url("' + new URL(new URL('ic_request_response.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_response',
  'url("' + new URL(new URL('ic_response.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_show_node_16x16',
  'url("' + new URL(new URL('ic_show_node_16x16.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_sources_authored',
  'url("' + new URL(new URL('ic_sources_authored.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_sources_deployed',
  'url("' + new URL(new URL('ic_sources_deployed.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_suggest_color',
  'url("' + new URL(new URL('ic_suggest_color.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_undo_16x16_icon',
  'url("' + new URL(new URL('ic_undo_16x16_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-ic_warning_black_18dp',
  'url("' + new URL(new URL('ic_warning_black_18dp.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-info-icon',
  'url("' + new URL(new URL('info-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-issue-cross-icon',
  'url("' + new URL(new URL('issue-cross-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-issue-exclamation-icon',
  'url("' + new URL(new URL('issue-exclamation-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-issue-questionmark-icon',
  'url("' + new URL(new URL('issue-questionmark-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-issue-text-icon',
  'url("' + new URL(new URL('issue-text-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-justify-content-center-icon',
  'url("' +
    new URL(new URL('justify-content-center-icon.svg', import.meta.url).href, import.meta.url).toString() +
    '")',
);
style.setProperty(
  '--image-file-justify-content-flex-end-icon',
  'url("' +
    new URL(new URL('justify-content-flex-end-icon.svg', import.meta.url).href, import.meta.url).toString() +
    '")',
);
style.setProperty(
  '--image-file-justify-content-flex-start-icon',
  'url("' +
    new URL(new URL('justify-content-flex-start-icon.svg', import.meta.url).href, import.meta.url).toString() +
    '")',
);
style.setProperty(
  '--image-file-justify-content-space-around-icon',
  'url("' +
    new URL(new URL('justify-content-space-around-icon.svg', import.meta.url).href, import.meta.url).toString() +
    '")',
);
style.setProperty(
  '--image-file-justify-content-space-between-icon',
  'url("' +
    new URL(new URL('justify-content-space-between-icon.svg', import.meta.url).href, import.meta.url).toString() +
    '")',
);
style.setProperty(
  '--image-file-justify-content-space-evenly-icon',
  'url("' +
    new URL(new URL('justify-content-space-evenly-icon.svg', import.meta.url).href, import.meta.url).toString() +
    '")',
);
style.setProperty(
  '--image-file-justify-items-center-icon',
  'url("' + new URL(new URL('justify-items-center-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-justify-items-end-icon',
  'url("' + new URL(new URL('justify-items-end-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-justify-items-start-icon',
  'url("' + new URL(new URL('justify-items-start-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-justify-items-stretch-icon',
  'url("' + new URL(new URL('justify-items-stretch-icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-largeIcons',
  'url("' + new URL(new URL('largeIcons.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-lighthouse_logo',
  'url("' + new URL(new URL('lighthouse_logo.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-link_icon',
  'url("' + new URL(new URL('link_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-mediumIcons',
  'url("' + new URL(new URL('mediumIcons.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-minus_icon',
  'url("' + new URL(new URL('minus_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-network_conditions_icon',
  'url("' + new URL(new URL('network_conditions_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-network_panel_icon',
  'url("' + new URL(new URL('network_panel_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-node_search_icon',
  'url("' + new URL(new URL('node_search_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-plus_icon',
  'url("' + new URL(new URL('plus_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-preview_feature_video_thumbnail',
  'url("' +
    new URL(new URL('preview_feature_video_thumbnail.svg', import.meta.url).href, import.meta.url).toString() +
    '")',
);
style.setProperty(
  '--image-file-refresh_12x12_icon',
  'url("' + new URL(new URL('refresh_12x12_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-resizeDiagonal',
  'url("' + new URL(new URL('resizeDiagonal.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-resizeHorizontal',
  'url("' + new URL(new URL('resizeHorizontal.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-resizeVertical',
  'url("' + new URL(new URL('resizeVertical.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-securityIcons',
  'url("' + new URL(new URL('securityIcons.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-settings_14x14_icon',
  'url("' + new URL(new URL('settings_14x14_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-smallIcons',
  'url("' + new URL(new URL('smallIcons.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-sources_panel_icon',
  'url("' + new URL(new URL('sources_panel_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-star_outline',
  'url("' + new URL(new URL('star_outline.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-survey_feedback_icon',
  'url("' + new URL(new URL('survey_feedback_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-switcherIcon',
  'url("' + new URL(new URL('switcherIcon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-three_dots_menu_icon',
  'url("' + new URL(new URL('three_dots_menu_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-trash_bin_icon',
  'url("' + new URL(new URL('trash_bin_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-treeoutlineTriangles',
  'url("' + new URL(new URL('treeoutlineTriangles.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-triangle-collapsed',
  'url("' + new URL(new URL('triangle-collapsed.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-triangle-expanded',
  'url("' + new URL(new URL('triangle-expanded.svg', import.meta.url).href, import.meta.url).toString() + '")',
);
style.setProperty(
  '--image-file-warning_icon',
  'url("' + new URL(new URL('warning_icon.svg', import.meta.url).href, import.meta.url).toString() + '")',
);

document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];