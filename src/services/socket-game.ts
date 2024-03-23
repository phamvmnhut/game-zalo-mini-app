import { BE_URL } from '@config';
import { io } from 'socket.io-client';

export const socket = io(BE_URL, {
  autoConnect: false
});