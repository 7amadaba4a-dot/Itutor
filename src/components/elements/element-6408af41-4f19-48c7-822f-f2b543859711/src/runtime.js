// This file will be executed in the browser
// You can write your custom JavaScript code here

// Access properties via the global despiaProperties object
// Example:
// console.log("API Key:", window.despiaProperties.apiKey);
// console.log("Environment:", window.despiaProperties.environment);
// console.log("Debug Mode:", window.despiaProperties.debug);
// console.log("User ID:", window.despiaProperties.userId);

// Listen for property updates
document.addEventListener('despia-properties-updated', function(event) {
const properties = event.detail.properties;
console.log('Properties updated:', properties);

// You can react to property changes here
// Example:
// if (properties.debug) {
//   console.log('Debug mode enabled');
// }
});

// Define the global despiaEventProxy function
// This function will trigger custom events through the established event system
window.despiaEventProxy = function(eventName, eventData) {
// Create a custom event
const customEvent = new CustomEvent('despia-custom-event', {
detail: { 
name: eventName, 
data: eventData 
}
});

// Dispatch only on the document to prevent multiple triggers
document.dispatchEvent(customEvent);

return true; // Return true to indicate the event was dispatched
};

// Also define customEvent as an alias for despiaEventProxy
// window.customEvent = window.despiaEventProxy;