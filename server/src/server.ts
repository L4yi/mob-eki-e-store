import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';
import { JsonStore } from './repositories/json/JsonStore';
import { backgroundScheduler } from './jobs/scheduler';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    // 1. Initialize data store
    const store = JsonStore.getInstance();
    await store.init();
    console.log('✅ [M.O.B EKI DataStore] Authoritative persistence initialized');

    // 2. Start automated background scheduler (reservation cleanup)
    backgroundScheduler.start(60 * 1000);

    // 3. Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 M.O.B EKI VENTURES Server running on http://localhost:${PORT}`);
      console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

bootstrap();
