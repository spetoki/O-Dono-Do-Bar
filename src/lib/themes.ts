
export type ThemeName = 'red' | 'green' | 'blue' | 'orange' | 'purple';

export interface Theme {
  name: ThemeName;
  label: string;
  light: {
    primary: string;
    ring: string;
    'chart-1': string;
  };
  dark: {
    primary: string;
    ring: string;
    'chart-1': string;
  };
}

export const themes: Theme[] = [
  {
    name: 'red',
    label: 'Vermelho',
    light: {
      primary: '0 72.2% 50.6%',
      ring: '0 72.2% 50.6%',
      'chart-1': '0 72.2% 50.6%',
    },
    dark: {
      primary: '0 62.8% 30.6%',
      ring: '0 62.8% 30.6%',
      'chart-1': '0 62.8% 30.6%',
    },
  },
  {
    name: 'green',
    label: 'Verde',
    light: {
      primary: '142.1 76.2% 36.3%',
      ring: '142.1 76.2% 36.3%',
      'chart-1': '142.1 76.2% 36.3%',
    },
    dark: {
      primary: '142.1 70.6% 40.3%',
      ring: '142.1 70.6% 40.3%',
      'chart-1': '142.1 70.6% 40.3%',
    },
  },
  {
    name: 'blue',
    label: 'Azul',
    light: {
      primary: '221.2 83.2% 53.3%',
      ring: '221.2 83.2% 53.3%',
      'chart-1': '221.2 83.2% 53.3%',
    },
    dark: {
      primary: '217.2 91.2% 59.8%',
      ring: '217.2 91.2% 59.8%',
      'chart-1': '217.2 91.2% 59.8%',
    },
  },
  {
    name: 'orange',
    label: 'Laranja',
    light: {
      primary: '24.6 95% 53.1%',
      ring: '24.6 95% 53.1%',
      'chart-1': '24.6 95% 53.1%',
    },
    dark: {
      primary: '20.5 90.2% 48.2%',
      ring: '20.5 90.2% 48.2%',
      'chart-1': '20.5 90.2% 48.2%',
    },
  },
  {
    name: 'purple',
    label: 'Roxo',
    light: {
      primary: '262.1 83.3% 57.8%',
      ring: '262.1 83.3% 57.8%',
      'chart-1': '262.1 83.3% 57.8%',
    },
    dark: {
      primary: '263.4 70% 50.4%',
      ring: '263.4 70% 50.4%',
      'chart-1': '263.4 70% 50.4%',
    },
  },
];
