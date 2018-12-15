import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import moment from 'moment'
import store from './store'

const INSTANCE_LOCATOR = process.env.VUE_APP_INSTANCE_LOCATOR;
const TOKEN_URL = process.env.VUE_APP_TOKEN_URL;

let currentUser = null;

export async function loginUser(userId) {
  const chatManager = new ChatManager({
    instanceLocator: INSTANCE_LOCATOR,
    tokenProvider: new TokenProvider({ url: TOKEN_URL }),
    userId
  });
  currentUser = await chatManager.connect();
  return currentUser;
}

export async function subscribeToRoom(activeRoom) {
  currentUser.subscribeToRoom({
    roomId: activeRoom.id,
    hooks: {
      onMessage: message => {
        store.commit('addMessage', {
          name: message.sender.name,
          username: message.senderId,
          text: message.text,
          date: moment(message.createdAt).format('h:mm:ss a D-MM-YYYY')
        });
      },
      onPresenceChanged: () => {
        store.commit('setUsers', store.state.activeRoom.users);
      }
    }
  });
}