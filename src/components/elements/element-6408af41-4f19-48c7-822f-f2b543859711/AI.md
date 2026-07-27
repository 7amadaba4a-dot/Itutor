---
name: despia-event-proxy
description: A modular event proxy for Despia that provides custom event handling capabilities with configurable events and properties from JSON files and runtime JavaScript execution.
keywords: sdk, events, custom events, javascript, runtime, integration, proxy, properties
---

#### despia-event-proxy
***Purpose:***
Provides a modular framework for defining and triggering custom events through JavaScript, specifically designed as an event proxy for Despia applications with configurable properties.

***Features:***
- Define custom events using a JSON configuration file (src/events.json)
- Define custom properties using a JSON configuration file (src/properties.json)
- Execute custom JavaScript code at runtime with access to defined properties
- Trigger events from anywhere in your application using window.customEvent() or window.despiaEventProxy()
- Access properties from runtime code via window.despiaProperties
- Modular system with events and properties defined in separate JSON files
- No visual UI - works silently in the background

***Properties:***
- eventsConfig: string - JSON configuration defining all available events with their names, types, descriptions, and sample data
- propertiesConfig: string - JSON configuration defining all available properties with their names, types, labels, descriptions, and default values
- runtimeJs: string - Custom JavaScript code that will be executed in the browser
- Dynamic properties based on src/properties.json (apiKey, environment, debug, userId by default)

***Events:***
- Dynamic events based on the src/events.json file
- Default events include:
  - on-callback: General async callback bridge. Payload matches the defined sampleData.

***Notes:***
- To trigger an event from your code, use either:
  - window.customEvent("eventName", dataObject)
  - window.despiaEventProxy("eventName", dataObject)
- Both functions will return true when the event is successfully dispatched
- Events are dispatched once to prevent duplicate triggers
- To access properties in runtime code, use: window.despiaProperties.propertyName
- To react to property changes, listen for the 'despia-properties-updated' event
- All events defined in the src/events.json will be automatically registered as trigger events
- All properties defined in the src/properties.json will be automatically added to the component
- The component has no visual representation and is designed to work in the background
- You can modify the src/events.json and src/properties.json files to add, remove or update available events and properties
- The runtime.js property is where you can add your custom JavaScript code
- Events are dynamically loaded from the src/events.json file at build time
- Properties are dynamically loaded from the src/properties.json file at build time
- To trigger an event from outside the component, use one of these methods:
```javascript
// Method 1: Using the global despiaEventProxy function
window.despiaEventProxy("on-callback", {
  sdk: "my-feature",
  data: { message: "Hello from external code" }
});

// Method 2: Using the global customEvent function (alias of despiaEventProxy)
window.customEvent("on-callback", {
  sdk: "my-feature",
  data: { message: "Hello from external code" }
});

// Method 3: Dispatching a custom event directly
const customEvent = new CustomEvent('despia-custom-event', {
  detail: { 
    name: "on-callback", 
    data: {
      sdk: "my-feature",
      data: { message: "Hello from external code" }
    }
  }
});
document.dispatchEvent(customEvent);
```
- If your event is not being triggered, check the browser console for any errors and ensure that:
  1. The event name matches exactly what's defined in your events.json
  2. You're calling the function from the correct window context
  3. The component is properly loaded and initialized