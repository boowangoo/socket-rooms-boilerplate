import { Container } from 'inversify';

import Router from '../router';
import Select from '../select';

const container = new Container();
container.bind<Router>(Router).toSelf();
container.bind<Select>(Select).toSelf();

export default container;