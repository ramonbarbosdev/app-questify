import * as Application from 'expo-application';
import * as SecureStore from 'expo-secure-store';

const KEY = 'device_id';

export async function getDeviceId(): Promise<string> {
  let id = await SecureStore.getItemAsync(KEY);

  if (id) return id;

  id = Application.getAndroidId();

  if (!id) {
    id = 'dev-' + Math.random().toString(36).substring(2, 12);
  }

  await SecureStore.setItemAsync(KEY, id);

  return id;
}