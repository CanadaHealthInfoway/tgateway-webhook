# tgateway-webhook
Demo implementation of a Terminology Gateway WebHook

This project contains a NodeJS implementation for a simple HTTP server that serves as a WebHook endpoint for Infoway's Terminology Gateway. 

Users installing this server will have to subscribe for receiving Terminology Gateway notifications. The server URL (endpoint) has to be registered with the Terminology Gateway. As part of the registration, a unique *api_id* is assigned to each endpoint. The *api_id* will be sent in each Terminology Gateway notification and must be echoed back in the response to the notification. More information about the notification service in the Terminology Gateway can be found here: TBD.

Once registered, the WebHook server receives notifications from the Terminology Gateway when content updates have been applied to terminology artifacts (subsets, codesystems, maps or packages) to which the user has subscribed. Upon notification, the WebHook server will invoke Terminology Gateway's native RESTful APIs to download the updated content.

The ***config.json*** file contains the server configuration:

- **port** - TCP/IP port number
- **gatewayBaseUrl** - the base URL of the Terminology Gateway native RESTful API. This URL can be used to override the *base_url* passed in the Terminology Gateway notification call
- **downloadDir** - directory where the server will download terminology artifacts
- **contextPath** - the server's context path
- **contextPathDown** - context path used to simulate the situation when the server is down
- **apiId** - *api_id* to be echoed back in the notification response

