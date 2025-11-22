import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const accessLogStream = fs.createWriteStream(
    path.join(logsDir, 'app.log'), 
    { flags: 'a' }
);

morgan.token('user-id', (req) => {
    return req.user ? req.user.id : 'guest';
});

morgan.token('timestamp', () => {
    return new Date().toISOString();
});

const fileFormat = ':timestamp | :method :url | Status: :status | :response-time ms | IP: :remote-addr | User: :user-id | Agent: :user-agent';

const consoleFormat = (tokens, req, res) => {
    const status = Number(tokens.status(req, res));
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const responseTime = tokens['response-time'](req, res);
    const userId = tokens['user-id'](req, res);
    const timestamp = tokens.timestamp(req, res);
    const ip = tokens['remote-addr'](req, res);
    
    const statusColor = status >= 500 ? '\x1b[31m' : // Red for 5xx
                       status >= 400 ? '\x1b[33m' : // Yellow for 4xx
                       status >= 300 ? '\x1b[36m' : // Cyan for 3xx
                       status >= 200 ? '\x1b[32m' : // Green for 2xx
                       '\x1b[0m'; // Default
    
    const methodColor = '\x1b[35m'; // Magenta for method
    const timeColor = '\x1b[90m'; // Gray for timestamp
    const reset = '\x1b[0m';
    const bold = '\x1b[1m';
    
    return `${timeColor}[${timestamp}]${reset} ${methodColor}${bold}${method}${reset} ${url} ${statusColor}${status}${reset} ${responseTime}ms | IP: ${ip} | User: ${userId}`;
};

const fileLogger = morgan(fileFormat, {
    stream: accessLogStream,
});

const consoleLogger = morgan(consoleFormat);

const activityLogger = (req, res, next) => {
    fileLogger(req, res, () => {});
    
    consoleLogger(req, res, () => {});
    
    next();
};

export { activityLogger };