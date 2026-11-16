const { spawn } = require('child_process');
const path = require('path');

console.log('[Unified Server] Starting EcoCarbon Fullstack Platform...');

// 1. Start Express Backend on internal port 5000
const backend = spawn('node', ['src/server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  env: {
    ...process.env,
    BACKEND_PORT: '5000'
  }
});

// 2. Start Next.js Frontend on Render public PORT
const frontend = spawn('npm', ['run', 'start'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  env: {
    ...process.env,
    INTERNAL_BACKEND_URL: 'http://127.0.0.1:5000'
  },
  shell: true
});

backend.on('error', (err) => {
  console.error('[Backend Error]:', err);
});

frontend.on('error', (err) => {
  console.error('[Frontend Error]:', err);
});

backend.on('exit', (code) => {
  if (code !== 0) {
    console.error(`[Backend] Process exited with code ${code}`);
    process.exit(code || 1);
  }
});

frontend.on('exit', (code) => {
  if (code !== 0) {
    console.error(`[Frontend] Process exited with code ${code}`);
    process.exit(code || 1);
  }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  backend.kill('SIGTERM');
  frontend.kill('SIGTERM');
});

process.on('SIGINT', () => {
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
});
