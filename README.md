# ejuicr-server

## Running the App Locally

### Prerequisites

You must have Node.js installed.

### Installation

1. Download or clone this repository.

```
git clone https://github.com/Jimfarrugia/ejuicr-server.git
```

2. Create a file called `.env` in the root folder and define the following variables:

```
NODE_ENV = development
PORT = 5000
MONGO_URI = mongodb+srv://dbUsername:dbPassword@dbClusterName.xxxxxxx.mongodb.net/dbCollectionName?retryWrites=true&w=majority
SESSION_SECRET = session_secret_string
JWT_SECRET = jsonwebtoken_secret_string
GOOGLE_CLIENT_ID = google_app_client_id
GOOGLE_CLIENT_SECRET = google_app_client_secret
TWITTER_CONSUMER_KEY = twitter_app_consumer_key
TWITTER_CONSUMER_SECRET = twitter_app_consumer_secret
EMAIL_ADDRESS = support@email.com
EMAIL_PASSWORD = support_email_password
CLIENT_URL = http://localhost:4200
```

**Note:** _These are example values._

**Note:** _"GOOGLE" and "TWITTER" values are only required for user authentication with OAuth and "EMAIL" values are required for resetting a user's password. Other features including user authentication with email/password should still work if they are left out._

2. Run the following command from the root folder to install dependencies:

```
npm install
```

3. Start the development server by running the following command:

```
npm run dev
```

The server should now be running at the following address and should restart whenever files are saved:

```
localhost:5000
```

4. Start the client-side application. See [ejuicr](https://github.com/jimfarrugia/ejuicr.git) and follow the installation instructions there to run the development server locally.
