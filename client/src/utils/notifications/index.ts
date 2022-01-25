import { NotificationManager } from 'react-notifications';

export type TShowNotification = (message: string, callback?: () => void) => void;

export const showSuccess: TShowNotification= (message, title, callback?) => NotificationManager.success(message, 'Sukces', 3000, callback);
export const showInfo: TShowNotification= (message, title, callback?) => NotificationManager.info(message, 'Informacja', 3000, callback);
export const showWarning: TShowNotification= (message, title, callback?) => NotificationManager.warning(message, 'Ostrzeżenie', 3000, callback);
export const showError: TShowNotification= (message, title, callback?) => NotificationManager.error(message, 'Błąd', 3000, callback);