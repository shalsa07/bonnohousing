module.exports = {
  apps: [
    {
      name: 'ppsbluyari',
      script: 'npm',
      args: 'start',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
        PORT: '3005'
      },
      watch: false,
      autorestart: true,
      max_memory_restart: '500M'
    }
  ]
}