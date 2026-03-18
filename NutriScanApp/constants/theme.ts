

import { Platform } from 'react-native';

export const Colors = {

  light: {
    text: '#313d21',
    background: '#86a476',
    tint: '#51e070',
    icon: '#d7e498',
    tabIconDefault: '#b3ac68',
    tabIconSelected: '#51e070',
    tabBarBackgroundColor: '#5a8746',
    safeAreaBackground: '#44753b',
  },
  dark: {
    text: '#ddffb8',
    background: '#364629',
    tint: '#51e070',
    icon: '#d7e498',
    tabIconDefault: '#799350',
    tabIconSelected: '#51e070',
    tabBarBackgroundColor: '#3b622f',
    safeAreaBackground: '#304e28',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
