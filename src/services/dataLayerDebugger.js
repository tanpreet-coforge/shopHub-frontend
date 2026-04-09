/**
 * Data Layer Debugger
 * Use this to verify events are being tracked correctly
 */

export const setupDataLayerDebugger = () => {
  // Create a global debug function
  window.debugDataLayer = {
    // View all events
    getEvents: () => {
      console.log('📊 All Data Layer Events:', window.dataLayer);
      return window.dataLayer;
    },

    // Count events
    countEvents: () => {
      console.log(`📈 Total Events: ${window.dataLayer?.length || 0}`);
      return window.dataLayer?.length || 0;
    },

    // Get events by type
    getEventsByType: (eventType) => {
      const events = window.dataLayer?.filter(
        (e) => e.event === eventType
      ) || [];
      console.log(`📋 ${eventType} Events:`, events);
      return events;
    },

    // Clear data layer
    clear: () => {
      if (window.dataLayer) {
        window.dataLayer = [];
        console.log('✅ Data Layer cleared');
      }
    },

    // Real-time watcher
    watch: () => {
      console.log('👁️  Watching data layer for new events...');
      const originalPush = window.dataLayer.push;
      let count = 0;

      window.dataLayer.push = function (...args) {
        count++;
        console.log(`🎯 Event #${count}:`, args[0]);
        return originalPush.apply(this, args);
      };

      console.log('✅ Watcher activated. All new events will be logged.');
      return () => {
        window.dataLayer.push = originalPush;
        console.log('❌ Watcher stopped');
      };
    },

    // Get recent events
    getRecent: (count = 5) => {
      const recent = window.dataLayer?.slice(-count) || [];
      console.log(`📍 Last ${count} events:`, recent);
      return recent;
    },
  };

  console.log(
    '🔧 Data Layer Debugger Ready!\nUse window.debugDataLayer for debugging:'
  );
  console.log('  - window.debugDataLayer.getEvents()');
  console.log('  - window.debugDataLayer.countEvents()');
  console.log('  - window.debugDataLayer.getEventsByType("event_name")');
  console.log('  - window.debugDataLayer.watch()');
  console.log('  - window.debugDataLayer.getRecent(5)');
  console.log('  - window.debugDataLayer.clear()');
};

export default setupDataLayerDebugger;
