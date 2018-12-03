import { Container } from 'inversify';

import RoomDB from '../roomDB';

const container = new Container();
container.bind<RoomDB>(RoomDB).toSelf();

export default container;