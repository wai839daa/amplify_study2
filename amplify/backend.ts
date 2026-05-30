import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { getServerTime } from './functions/get-server-time/resources';

defineBackend({
  auth,
  data,
  getServerTime,
});
