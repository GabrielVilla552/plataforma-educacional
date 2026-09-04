import { app } from './app.js';
import { config } from './config.js';
app.listen(config.port, () => console.log(`API V1 em http://localhost:${config.port}`));
