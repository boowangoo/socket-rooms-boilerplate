import io from 'socket.io-client';

import 'reflect-metadata';

import Router from './router'; 
import Select from './select';

import container from './config/iocConfig';

const socket = io();
const router = container.resolve<Router>(Router);
const select = container.resolve<Select>(Select);
router.changePage(select);
