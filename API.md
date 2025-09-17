# ejuicr-server

This is the server for ejuicr, a web application for creating and managing e-juice recipes.

## Technologies Used

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Passport](http://www.passportjs.org/) for authentication (Google and Twitter)
- [JSON Web Tokens](https://jwt.io/) for authorization
- [Nodemailer](https://nodemailer.com/) for sending emails
- [Bcrypt.js](https://www.npmjs.com/package/bcryptjs) for password hashing

## Project Structure

```
/home/jim/Projects/ejuicr-server/
├───.gitignore
├───package-lock.json
├───package.json
├───README.md
├───server.js
├───.git/...
├───.github/
│   └───workflows/
│       └───node.js.yml
├───auth/
│   ├───googleAuth.js
│   └───twitterAuth.js
├───config/
│   └───db.js
├───controllers/
│   ├───recipes.js
│   ├───settings.js
│   └───user.js
├───middleware/
│   ├───auth.js
│   └───errorHandler.js
├───models/
│   ├───recipe.js
│   ├───settings.js
│   └───user.js
├───routes/
│   ├───auth.js
│   ├───recipes.js
│   ├───settings.js
│   └───user.js
└───services/
    └───mailer.js
```

## API Endpoints

### Authentication

- `GET /auth/google`: Authenticate with Google
- `GET /auth/google/callback`: Google OAuth callback
- `GET /auth/twitter`: Authenticate with Twitter
- `GET /auth/twitter/callback`: Twitter OAuth callback

### User

- `POST /api/user`: Register a new user
- `POST /api/user/login`: Login a user
- `POST /api/user/reset-password`: Send a password reset email
- `POST /api/user/reset-password/:token`: Update password with a reset token
- `POST /api/user/change-password`: Change password with current password
- `GET /api/user/me`: Get the current user's data
- `DELETE /api/user`: Delete the current user's account
- `DELETE /api/user/google`: Remove Google profile data from a user
- `DELETE /api/user/twitter`: Remove Twitter profile data from a user

### Recipes

- `GET /api/recipes`: Get all recipes for the current user
- `GET /api/recipes/:id`: Get a single recipe
- `POST /api/recipes`: Create a new recipe
- `PUT /api/recipes/:id`: Update a recipe
- `DELETE /api/recipes/:id`: Delete a recipe

### Settings

- `GET /api/settings`: Get the current user's settings
- `POST /api/settings`: Update the current user's settings

## Database Models

### User

```javascript
{
  email: {
    type: String,
    min: 8,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    min: 6,
    max: 255,
  },
  authProvider: {
    type: String,
  },
  googleId: {
    type: String,
  },
  googlePicture: {
    type: String,
  },
  googleDisplayName: {
    type: String,
  },
  twitterId: {
    type: String,
  },
  twitterPicture: {
    type: String,
  },
  twitterDisplayName: {
    type: String,
  },
  twitterHandle: {
    type: String,
  },
}
```

### Recipe

```javascript
{
  name: {
    type: String,
    trim: true,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  strength: {
    type: Number,
    default: 0,
    min: 0,
  },
  base: {
    pg: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    vg: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
  },
  amount: {
    type: Number,
    min: 0,
    required: true,
  },
  ingredients: {
    nicotine: {
      strength: {
        type: Number,
        min: 0,
        max: 1000,
        required: true,
      },
      base: {
        pg: {
          type: Number,
          min: 0,
          max: 100,
          required: true,
        },
        vg: {
          type: Number,
          min: 0,
          max: 100,
          required: true,
        },
      },
    },
    flavors: [
      {
        name: {
          type: String,
          trim: true,
          required: true,
        },
        percentage: {
          type: Number,
          min: 0,
          max: 100,
          required: true,
        },
        base: {
          pg: {
            type: Number,
            min: 0,
            max: 100,
            required: true,
          },
          vg: {
            type: Number,
            min: 0,
            max: 100,
            required: true,
          },
        },
      },
    ],
  },
}
```

### Settings

```javascript
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  theme: {
    type: String,
    enum: ["light", "dark"],
    default: "dark",
  },
  units: {
    type: String,
    enum: ["weight", "volume", "both"],
    default: "both",
    required: true,
  },
  base: {
    pg: {
      type: Number,
      min: 0,
      max: 100,
      default: 30,
      required: true,
    },
    vg: {
      type: Number,
      min: 0,
      max: 100,
      default: 70,
      required: true,
    },
  },
  strength: {
    type: Number,
    min: 0,
    default: 6,
    required: true,
  },
  amount: {
    type: Number,
    min: 0,
    default: 30,
    required: true,
  },
  zeroNicotineMode: {
    type: Boolean,
    default: false,
    required: true,
  },
  nicotine: {
    strength: {
      type: Number,
      min: 0,
      max: 1000,
      default: 100,
      required: true,
    },
    base: {
      pg: {
        type: Number,
        min: 0,
        max: 100,
        default: 100,
        required: true,
      },
      vg: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
        required: true,
      },
    },
  },
  flavor: {
    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 5,
      required: true,
    },
    base: {
      pg: {
        type: Number,
        min: 0,
        max: 100,
        default: 100,
        required: true,
      },
      vg: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
        required: true,
      },
    },
  },
}
```